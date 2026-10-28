import { ShoppingBag, UserRound } from "lucide-react";
import Link from "next/link";
import { signOut } from "@/lib/session/actions";
import { getSession } from "@/lib/session/session";

const ICON =
  "relative flex size-11 items-center justify-center rounded-full text-jh-navy hover:bg-jh-light focus-visible:outline-2 focus-visible:outline-jh-bright";

/**
 * The header's personal part: the account (Sign in, or the first name with
 * Sign out) and the cart with its number of pieces. Read from the session
 * cookies only (no API call), so every page stays fast.
 */
export async function HeaderAccount() {
  const session = await getSession();
  if (!session) {
    return (
      <div className="flex items-center gap-1">
        <Link href="/sign-in" className={`${ICON} md:w-auto md:gap-1.5 md:px-3 md:text-sm md:font-medium`}>
          <UserRound aria-hidden className="size-5" />
          <span className="sr-only md:not-sr-only">Sign in</span>
        </Link>
      </div>
    );
  }
  const count = session.cartCount;
  return (
    <div className="flex items-center gap-1">
      <details className="group relative">
        <summary
          role="button"
          aria-label={`Account menu${session.firstName ? ` for ${session.firstName}` : ""}`}
          className={`${ICON} cursor-pointer list-none md:w-auto md:gap-1.5 md:px-3 md:text-sm md:font-medium [&::-webkit-details-marker]:hidden`}>
          <UserRound aria-hidden className="size-5" />
          <span aria-hidden className="hidden md:inline">{session.firstName || "Account"}</span>
        </summary>
        <div className="absolute right-0 z-40 mt-2 w-52 rounded-2xl bg-white p-2 shadow-lg ring-1 ring-border">
          <p className="px-3 py-2 text-xs text-muted-foreground">Signed in{session.firstName ? ` as ${session.firstName}` : ""}</p>
          <Link href="/account" className="block rounded-xl px-3 py-2 text-sm hover:bg-jh-light">
            My account
          </Link>
          <Link href="/account/orders" className="block rounded-xl px-3 py-2 text-sm hover:bg-jh-light">
            My orders
          </Link>
          <Link href="/cart" className="block rounded-xl px-3 py-2 text-sm hover:bg-jh-light">
            Cart
          </Link>
          <form action={signOut}>
            <button type="submit" className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-jh-light">
              Sign out
            </button>
          </form>
        </div>
      </details>
      <Link href="/cart" className={ICON} aria-label={count > 0 ? `Cart, ${count} ${count === 1 ? "piece" : "pieces"}` : "Cart"}>
        <ShoppingBag aria-hidden className="size-5" />
        {count > 0 ? (
          <span
            aria-hidden
            className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-jh-bright px-1 text-[0.7rem] font-bold text-jh-navy tabular-nums"
          >
            {count > 999 ? "999+" : count}
          </span>
        ) : null}
      </Link>
    </div>
  );
}
