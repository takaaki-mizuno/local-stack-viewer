"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Cloud, Database, Mail, Home } from "lucide-react";

const navigationItems = [
  {
    name: "ダッシュボード",
    href: "/",
    icon: Home,
  },
  {
    name: "S3",
    href: "/s3",
    icon: Database,
  },
  {
    name: "SES",
    href: "/ses",
    icon: Mail,
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex h-16 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Cloud className="h-6 w-6" />
          <span className="text-xl font-bold">LocalStack Viewer</span>
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
      </div>
    </nav>
  );
}
