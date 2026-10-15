"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IdCard, Wallpaper } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";
import { cn } from "@/lib/utils";

/** Kart oluşturucu ile duvar kağıdı stüdyosu arasında geçiş. */
export const ModeSwitch = () => {
  const pathname = usePathname();
  const t = useTranslations();

  const modes = [
    { href: "/", label: t.mode_card, icon: IdCard },
    { href: "/wallpaper", label: t.mode_wallpaper, icon: Wallpaper },
  ];

  return (
    <nav
      aria-label={t.mode_label}
      className="flex h-8 items-center rounded-md border bg-card p-0.5"
    >
      {modes.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            aria-label={label}
            className={cn(
              "flex h-full items-center gap-1.5 rounded-sm px-2 font-display text-xs uppercase tracking-wider transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            <span className="hidden lg:inline">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
