import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { BookAddressForm } from "@/components/account/book-address-form";
import { ShopUnavailable } from "@/components/shop/shop-card";
import { addressCommand } from "@/lib/account/actions";
import { api } from "@/lib/api/client";
import type { Address } from "@/lib/cart/types";
import { addressLines, countries } from "@/lib/checkout/address";
import { isSessionEnded, requireSession, signInUrl } from "@/lib/session/session";

export const metadata: Metadata = { title: "Addresses" };

const MAX_ADDRESSES = 10;

const NOTES: Record<string, string> = {
  added: "Address added.",
  saved: "Address saved.",
  deleted: "Address deleted.",
  default: "Default address changed.",
};

export default function AddressesPage(props: PageProps<"/account/addresses">) {
  return (
    <>
      <h1 className="text-4xl font-semibold">Addresses</h1>
      <Suspense fallback={<p className="mt-6 text-muted-foreground">Loading…</p>}>
        <AddressBook {...props} />
      </Suspense>
    </>
  );
}

async function AddressBook({ searchParams }: PageProps<"/account/addresses">) {
  const params = await searchParams;
  const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";
  const session = await requireSession("/account/addresses");
  let addresses: Address[];
  try {
    addresses = await api<Address[]>("/addresses", { token: session.token });
  } catch (error) {
    if (isSessionEnded(error)) redirect(signInUrl("/account/addresses"));
    return (
      <div className="mt-6">
        <ShopUnavailable />
      </div>
    );
  }
  const editing = addresses.find((a) => a.id === one(params.edit));
  const adding = one(params.new) === "1" && addresses.length < MAX_ADDRESSES;
  const note = one(params.note);

  if (editing || adding) {
    const start: Record<string, string> = editing
      ? Object.fromEntries(
          Object.entries(editing).map(([key, value]) => [key, typeof value === "string" ? value : ""]),
        )
      : { fullName: "", phone: "" };
    return (
      <div className="mt-6 rounded-3xl bg-white p-5 ring-1 ring-border sm:p-6">
        <h2 className="mb-4 text-xl font-semibold">{editing ? "Edit address" : "New address"}</h2>
        <BookAddressForm id={editing?.id ?? ""} countries={countries()} defaults={start} isDefault={editing?.isDefault ?? false} />
        <Link href="/account/addresses" className="mt-4 inline-block text-sm text-jh-deep hover:underline">
          Back to addresses
        </Link>
      </div>
    );
  }

  return (
    <>
      {note ? (
        <p
          role={NOTES[note] ? "status" : "alert"}
          className={`mt-5 rounded-2xl px-4 py-3 text-sm ${NOTES[note] ? "bg-jh-bright/15 text-jh-navy" : "bg-destructive/10 text-destructive"}`}
        >
          {NOTES[note] ?? note}
        </p>
      ) : null}
      {addresses.length === 0 ? (
        <p className="mt-6 text-muted-foreground">No addresses yet. Add one here or at checkout.</p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <li key={a.id} className="flex flex-col rounded-2xl bg-white p-5 text-sm ring-1 ring-border">
              {a.isDefault ? (
                <span className="mb-2 self-start rounded-full bg-jh-bright/20 px-2.5 py-0.5 text-xs font-semibold text-jh-deep">
                  Default
                </span>
              ) : null}
              <address className="flex flex-col not-italic">
                {addressLines(a).map((line, i) => (
                  <span key={i} className={i === 0 ? "font-semibold" : "text-muted-foreground"}>
                    {line}
                  </span>
                ))}
              </address>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/account/addresses?edit=${a.id}`}
                  className="rounded-full px-3 py-1.5 font-medium text-jh-deep ring-1 ring-border hover:bg-jh-light"
                >
                  Edit <span className="sr-only">{a.fullName}, {a.city}</span>
                </Link>
                {!a.isDefault ? (
                  <form action={addressCommand}>
                    <input type="hidden" name="id" value={a.id} />
                    <input type="hidden" name="command" value="default" />
                    <button type="submit" className="rounded-full px-3 py-1.5 ring-1 ring-border hover:bg-jh-light">
                      Make default <span className="sr-only">{a.fullName}, {a.city}</span>
                    </button>
                  </form>
                ) : null}
                <form action={addressCommand}>
                  <input type="hidden" name="id" value={a.id} />
                  <input type="hidden" name="command" value="delete" />
                  <button
                    type="submit"
                    className="rounded-full px-3 py-1.5 text-muted-foreground ring-1 ring-border hover:bg-destructive/10 hover:text-destructive"
                  >
                    Delete <span className="sr-only">{a.fullName}, {a.city}</span>
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
      {addresses.length < MAX_ADDRESSES ? (
        <Link
          href="/account/addresses?new=1"
          className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-jh-bright px-5 py-2.5 font-semibold text-jh-navy hover:bg-jh-bright/85"
        >
          <Plus aria-hidden className="size-4" /> Add an address
        </Link>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">You have {MAX_ADDRESSES} addresses, the most you can keep. Delete one to add another.</p>
      )}
    </>
  );
}
