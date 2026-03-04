"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const PRIVATE_ROUTE_PREFIXES = ["/dashboard", "/playground"];

function isPrivatePath(pathname: string): boolean {
  return PRIVATE_ROUTE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export default function AuthRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { status } = useSession();

  const privatePath = isPrivatePath(pathname);

  useEffect(() => {
    if (!privatePath) return;
    if (status !== "unauthenticated") return;
    router.replace("/");
  }, [privatePath, router, status]);

  if (privatePath && status !== "authenticated") {
    return null;
  }

  return <>{children}</>;
}
