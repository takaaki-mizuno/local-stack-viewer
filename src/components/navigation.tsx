"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Cloud, Database, Mail, Home } from "lucide-react";
import { LanguageSwitcher } from "./language-switcher";

export function Navigation() {
  const pathname = usePathname();
  const t = useTranslations('navigation');

  const navigationItems = [
    {
      name: t('home'),
      href: "/",
      icon: Home,
    },
    {
      name: t('s3'),
      href: "/s3",
      icon: Database,
    },
    {
      name: t('ses'),
      href: "/ses",
      icon: Mail,
    },
  ];

  return (
    <nav className="flex h-16 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Cloud className="h-6 w-6" />
          <span className="text-xl font-bold">{t('title')}</span>
        </div>
      </div>

      <div className="flex items-center space-x-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
        <LanguageSwitcher />
      </div>
    </nav>
  );
}
