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
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import {
  Home,
  LayoutGrid,
  ShieldCheck,
  FileCheck,
  ListChecks,
  Flag,
  Landmark,
  ClipboardList,
  AlertTriangle,
  Users,
  Settings,
  BookOpen,
} from "lucide-react";

export const sidebarNav = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Workspace",
    href: "/workspace",
    icon: LayoutGrid,
    active: true,
  },
  {
    label: "Risk Management",
    icon: ShieldCheck,
    children: [
      { label: "Compliance", href: "/compliance", icon: FileCheck },
      { label: "Regulatory Requirements", href: "/regulatory", icon: ListChecks },
      { label: "Controls & Assessments", href: "/controls", icon: ClipboardList },
    ],
  },
  {
    label: "Initiatives Management",
    href: "/initiatives",
    icon: Flag,
  },
  {
    label: "Governance",
    href: "/governance",
    icon: Landmark,
  },
  {
    label: "Audit Management",
    href: "/audit",
    icon: ClipboardList,
  },
  {
    label: "Issues and Exceptions",
    href: "/issues",
    icon: AlertTriangle,
  },
  {
    label: "User’s Management",
    href: "/users",
    icon: Users,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    label: "Consultancy",
    href: "/consultancy",
    icon: BookOpen,
  },
];


export function Sidebar({ user }: { user: any }) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 w-[280px] flex-col rounded-r-3xl bg-white shadow-sm">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 text-lg font-semibold">
        Platform
      </div>

      <ScrollArea className="flex-1 px-4">
        <nav className="space-y-1">
          {sidebarNav.map((item:any) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            if (item.children) {
              return (
                <Collapsible key={item.label} defaultOpen>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="ml-7 space-y-1">
                    {item.children.map((child:any) => {
                      const ChildIcon = child.icon;
                      const activeChild = pathname === child.href;

                      return (
                        <Link
                          key={child.label}
                          href={child.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted",
                            activeChild && "bg-black text-white"
                          )}
                        >
                          <ChildIcon className="h-4 w-4" />
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
                href={item.href!}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium",
                  isActive
                    ? "bg-black text-white"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator />

      {/* User */}
      <div className="flex items-center gap-3 p-4">
        <Avatar>
          <AvatarImage src={user?.avatar} />
          <AvatarFallback>{user?.name?.[0] ?? "U"}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col text-sm">
          <span className="font-medium">{user?.name}</span>
          <span className="text-muted-foreground">{user?.email}</span>
        </div>
      </div>
    </aside>
  );
}
