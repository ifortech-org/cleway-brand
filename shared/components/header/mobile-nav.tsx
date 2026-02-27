"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import { NavItem } from "@/shared/types";
import Logo from "@/shared/components/logo";
import { useState } from "react";
import { AlignRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { isEnglishPath, localizeHref } from "@/shared/lib/locale-path";
import LanguageSwitcher from "@/shared/components/header/language-switcher";

export default function MobileNav({ navItems }: { navItems: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const useEnglish = isEnglishPath(pathname);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          aria-label="Open Menu"
          variant="ghost"
          className="w-10 p-5 focus-visible:ring-1 focus-visible:ring-offset-1">
          <AlignRight className="dark:text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <div className="mx-auto">
            <Logo />
          </div>
          <div className="sr-only">
            <SheetTitle>Main Navigation</SheetTitle>
            <SheetDescription>Navigate to the website pages</SheetDescription>
          </div>
        </SheetHeader>
        <div className="pt-10 pb-20">
          <div className="container">
            <div className="mb-6 flex justify-center">
              <LanguageSwitcher onChange={() => setOpen(false)} />
            </div>
            <ul className="list-none text-center space-y-3">
              <>
                {navItems.map((navItem) => (
                  <li key={navItem.label}>
                    <Link
                      onClick={() => setOpen(false)}
                      href={localizeHref(navItem.href, useEnglish)}
                      target={navItem.target ? "_blank" : undefined}
                      rel={navItem.target ? "noopener noreferrer" : undefined}
                      className="hover:text-decoration-none hover:opacity-50 text-lg">
                      {navItem.label}
                    </Link>
                  </li>
                ))}
              </>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
