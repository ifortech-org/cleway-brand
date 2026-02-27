import Link from "next/link";
import LogoDynamic from "@/shared/components/logo-dynamic";
import MobileNav from "@/shared/components/header/mobile-nav";
import DesktopNav from "@/shared/components/header/desktop-nav";
import LanguageSwitcher from "@/shared/components/header/language-switcher";

const navItems = [
  {
    label: "Home",
    href: "/",
    target: false,
  },
  {
    label: "Blog",
    href: "/blog",
    target: false,
  },
  {
    label: "About",
    href: "/about",
    target: false,
  },
];

export default function Header() {
  return (
    <header className="sticky top-0 w-full border-border/40 bg-background/95 z-50">
      <div className="container flex items-center justify-between h-14">
        <Link
          href="/"
          aria-label="Home page"
          className="flex items-center h-14 min-w-[100px] max-w-[180px] xl:max-w-[220px] overflow-visible">
          <LogoDynamic
            style={{
              maxHeight: 48,
              width: "auto",
              height: "100%",
              objectFit: "contain",
            }}
            className="w-full h-full"
          />
        </Link>
        <div className="hidden xl:flex gap-7 items-center justify-between">
          <DesktopNav navItems={navItems} />
          <LanguageSwitcher />
        </div>
        <div className="flex items-center xl:hidden">
          <MobileNav navItems={navItems} />
        </div>
      </div>
    </header>
  );
}
