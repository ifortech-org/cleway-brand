"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItem } from "@/shared/types";
import { isEnglishPath, localizeHref } from "@/shared/lib/locale-path";

export default function DesktopNav({ navItems }: { navItems: NavItem[] }) {
  const pathname = usePathname();
  const useEnglish = isEnglishPath(pathname);

  return (
    <div className="hidden xl:flex items-center gap-7 text-primary">
      {navItems.map((navItem) => (
        <Link
          key={navItem.label}
          href={localizeHref(navItem.href, useEnglish)}
          target={navItem.target ? "_blank" : undefined}
          rel={navItem.target ? "noopener noreferrer" : undefined}
          className="transition-colors hover:text-foreground/80 text-foreground/60 text-sm">
          {navItem.label}
        </Link>
      ))}
    </div>
  );
}
