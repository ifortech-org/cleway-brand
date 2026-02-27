"use client";

import { usePathname } from "next/navigation";
import {
  isEnglishPath,
  toEnglishPath,
  toItalianPath,
} from "@/shared/lib/locale-path";

export default function LanguageSwitcher({
  onChange,
}: {
  onChange?: () => void;
}) {
  const pathname = usePathname();
  const isEnglish = isEnglishPath(pathname);

  const handleChange = (value: string) => {
    const nextPath = value === "EN" ? toEnglishPath(pathname) : toItalianPath(pathname);
    if (nextPath !== pathname) {
      window.location.assign(nextPath);
      return;
    }
    onChange?.();
  };

  return (
    <select
      aria-label="Language selector"
      value={isEnglish ? "EN" : "IT"}
      onChange={(event) => handleChange(event.target.value)}
      className="h-9 rounded-md border border-border bg-background px-2 text-sm">
      <option value="IT">IT</option>
      <option value="EN">EN</option>
    </select>
  );
}
