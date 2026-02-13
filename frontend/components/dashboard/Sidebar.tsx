"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  Key,
  Home,
  LayoutGrid,
  ListChecks,
  Users,
  Settings,
  FileDown,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                NAV CONFIG                                  */
/* -------------------------------------------------------------------------- */

export const sidebarNav = [
  {
    label: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Workspace",
    href: "/jobs",
    icon: LayoutGrid,
  },
  {
    label: "Leads",
    icon: Users,
    children: [
      { label: "All Leads", href: "/leads", icon: ListChecks },
      { label: "Export", href: "/export", icon: FileDown },
    ],
  },
  {
    label: "API",
    href: "/api",
    icon: Key,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];



export function Sidebar({ user }: { user: any }) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 w-[280px] flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center p-4 text-2xl text-white rounded-md w-fit font-semibold ">
        Scrappex
      </div>

      <ScrollArea className="flex-1 px-4">
        <nav className="space-y-1">
          {sidebarNav.map((item: any) => {
            const Icon = item.icon;
            const isActive =
              item.href &&
              (pathname === item.href ||
                pathname.startsWith(item.href + "/"));

            /* ----------------------------- Collapsible ----------------------------- */
            if (item.children) {
              const isChildActive = item.children.some(
                (c: any) =>

                  pathname === c.href ||
                  pathname.startsWith(c.href + "/")
              );

              return (
                <Collapsible
                  key={item.label}
                  defaultOpen={isChildActive}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between rounded-xl px-3 py-2 text-sm text-[#8B8F97]
                                 hover:text-[#E7E9EE] hover:bg-white/5 transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-[#6F7480]" />
                        {item.label}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="ml-7 space-y-1">
                    {item.children.map((child: any) => {
                      const ChildIcon = child.icon;
                      const activeChild =
                        pathname === child.href ||
                        pathname.startsWith(child.href + "/");

                      return (
                        <Link
                          key={child.label}
                          href={child.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                            activeChild
                              ? "bg-white/5 border border-white/10 text-[#E7E9EE]"
                              : "text-[#8B8F97] hover:bg-white/5"
                          )}
                        >
                          <ChildIcon
                            className={cn(
                              "h-4 w-4",
                              activeChild
                                ? "text-[#E7E9EE]"
                                : "text-[#6F7480]"
                            )}
                          />
                          {child.label}
                        </Link>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white/5 border border-white/10 text-[#E7E9EE]"
                    : "text-[#8B8F97] hover:bg-white/5"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    isActive ? "text-[#E7E9EE]" : "text-[#6F7480]"
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator className="bg-white/10" />

      <div className="flex items-center gap-3 p-4">
        <Avatar>
          <AvatarImage src={user?.avatar} />
          <AvatarFallback>{user?.name?.[0] ?? "U"}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col text-sm">
          <span className="font-medium text-[#E7E9EE]">
            {user?.name}
          </span>
          <span className="text-[#8B8F97]">
            {user?.email}
          </span>
        </div>
      </div>
    </aside>
  );
}
