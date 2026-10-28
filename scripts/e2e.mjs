/**
 * Runs the browser tests against a real shop:
 *
 * 1. prepares the TEST database jana_test (never jana_dev): migrated,
 *    emptied, the seeded menu, and Bulk hair priced and live with a photo
 * 2. starts the API's build (../house-of-jana-api/dist) on port 4101, with
 *    the stand-in Razorpay and bank transfer switched on
 * 3. builds this site against that API and runs Playwright
 *
 * Usage: npm run test:e2e   (extra arguments go to Playwright)
 * Needs the API built first: `npm run build` in ../house-of-jana-api.
 */
import { execFileSync, spawn } from "node:child_process";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { deflateSync, crc32 } from "node:zlib";

const ROOT = join(import.meta.dirname, "..");
const API_DIR = join(ROOT, "..", "house-of-jana-api");
const API_PORT = 4101;
const API = `http://localhost:${API_PORT}/api/v1`;
const QC = { email: "qc.shop@test.local", password: "QcShop2026pass" };
const win = process.platform === "win32";

function npm(cwd, args, env = {}) {
  execFileSync(win ? "npm.cmd" : "npm", args, {
    cwd,
    env: { ...process.env, ...env },
    stdio: "inherit",
    shell: win,
  });
}

/** A real light-blue PNG, so the upload goes through the API's checks. */
function png(width = 400, height = 500) {
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body));
    return Buffer.concat([len, body, crc]);
  };
  const row = width * 3 + 1;
  const raw = Buffer.alloc(row * height);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) raw.set([0xe9, 0xf1, 0xfa], y * row + 1 + x * 3);
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 2;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

async function resetDatabase() {
  npm(API_DIR, ["run", "migration:run"], { DATABASE_NAME: "jana_test" });
  process.loadEnvFile(join(API_DIR, ".env"));
  const { Client } = createRequire(join(API_DIR, "package.json"))("pg");
  const db = new Client({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT ?? 5432),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: "jana_test",
  });
  await db.connect();
  const { rows } = await db.query("SELECT current_database() AS name");
  if (rows[0].name !== "jana_test") throw new Error("Refusing to reset anything but jana_test");
  await db.query(`TRUNCATE inventory_transactions, inventory, product_images, product_categories,
    product_variants, products, categories, refresh_tokens, user_roles, audit_logs, users CASCADE`);
  await db.end();
  npm(API_DIR, ["run", "admin:create-super", "--", "--email", QC.email, "--first-name", "QC"], {
    DATABASE_NAME: "jana_test",
    ADMIN_PASSWORD: QC.password,
  });
  npm(API_DIR, ["run", "seed:catalog"], { DATABASE_NAME: "jana_test" });
}

async function call(token, method, path, body) {
  const form = body instanceof FormData;
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, ...(form ? {} : { "Content-Type": "application/json" }) },
    body: body === undefined ? undefined : form ? body : JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`${method} ${path}: ${res.status} ${JSON.stringify(json)}`);
  return json.data;
}

/**
 * Bulk hair goes live with: straight and curly at 18 in priced (curly 18 in
 * from stock, 40 pieces; straight made to order, 14 days), curly 22 in
 * priced too. Everything else stays a draft.
 */
async function priceBulkHair() {
  const login = await fetch(`${API}/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(QC),
  });
  const token = (await login.json()).data.accessToken;
  const list = await call(token, "GET", "/admin/products?search=bulk");
  const id = list[0].id;
  await call(token, "PATCH", `/admin/products/${id}/variants`, {
    where: { Length: "18 in" },
    singlePrice: "6000",
    bulkPrice: "5200",
    leadTimeDays: 14,
  });
  await call(token, "PATCH", `/admin/products/${id}/variants`, {
    where: { Texture: "Curly", Length: "22 in" },
    singlePrice: "7000",
    bulkPrice: "6100",
  });
  let product = await call(token, "GET", `/admin/products/${id}`);
  const curly18 = product.variants.filter((v) => v.options.Texture === "Curly" && v.options.Length === "18 in");
  for (const variant of curly18) {
    await call(token, "PATCH", `/admin/products/${id}/variants/${variant.id}`, { stockMode: "IN_STOCK" });
    await call(token, "POST", `/admin/inventory/${variant.id}/adjustments`, { type: "RESTOCK", quantity: 40 });
  }
  product = await call(token, "GET", `/admin/products/${id}`);
  await call(token, "PATCH", `/admin/products/${id}`, {
    version: product.version,
    shortDescription: "Raw Indian human hair in bulk, sorted by hand.",
    description: "Hand-picked natural human hair from Purba Midnapore.",
    attributes: { Origin: "India" },
  });
  const form = new FormData();
  form.append("files", new Blob([png()], { type: "image/png" }), "bulk.png");
  await call(token, "POST", `/admin/products/${id}/images`, form);
  await call(token, "PATCH", `/admin/products/${id}/status`, { status: "ACTIVE" });
}

async function waitFor(url, ms = 60_000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`${url} did not start`);
}

await resetDatabase();
const api = spawn("node", ["dist/main"], {
  cwd: API_DIR,
  env: {
    ...process.env,
    DATABASE_NAME: "jana_test",
    APP_PORT: String(API_PORT),
    APP_ENV: "test",
    LOG_LEVEL: "warn",
    THROTTLE_LIMIT: "100000",
    STORAGE_DRIVER: "local",
    UPLOAD_LOCAL_DIR: join(tmpdir(), "jana-web-e2e-uploads"),
    PUBLIC_BASE_URL: `http://localhost:${API_PORT}`,
    AUTH_THROTTLE_LIMIT: "10000",
    // Checkout (JS2): online payment with the stand-in Razorpay, bank transfer,
    // ₹250 shipping in India below ₹50,000 of goods.
    ONLINE_PAYMENTS_ENABLED: "true",
    RAZORPAY_FAKE: "true",
    BANK_TRANSFER_DETAILS: "Account name: House of Jana Ventures Pvt Ltd | Bank: Test Bank | IFSC: TEST0000001",
    SHIPPING_FEE_INDIA: "250",
    FREE_SHIPPING_THRESHOLD_INDIA: "50000",
    ORDER_JOBS_ENABLED: "false",
    SHOP_URL: "http://localhost:3301",
  },
  stdio: "inherit",
});
let code = 1;
try {
  await waitFor(`${API}/health/live`);
  await priceBulkHair();
  npm(ROOT, ["exec", "--", "next", "build"], { API_URL: API });
  try {
    npm(ROOT, ["exec", "--", "playwright", "test", ...process.argv.slice(2)], { API_URL: API });
    code = 0;
  } catch {
    code = 1;
  }
} finally {
  api.kill();
}
process.exit(code);
