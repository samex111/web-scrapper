'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import {
  House,
  Briefcase,
  Users,
  Key,
  Settings,
  BookOpen
} from "lucide-react";


const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <House className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
,
  },
  {
    name: "Jobs",
    href: "/jobs",
    icon: <Briefcase className="h-5 w-5 text-muted-foreground group-hover:text-primary" />,
  },
  {
    name: "Leads",
    href: "/leads",
    icon: <Users className="h-5 w-5 text-muted-foreground group-hover:text-primary" />,
  },
  {
    name: "API Keys",
    href: "/api-keys",
    icon: <Key className="h-5 w-5 text-muted-foreground group-hover:text-primary" />,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5 text-muted-foreground group-hover:text-primary" />,
  },
  {
    name: "Docs",
    href: "/docs",
    icon: <BookOpen className="h-5 w-5 text-muted-foreground group-hover:text-primary" />,
  },
];


export function Sidebar({ user }: { user: any }) {
  const pathname = usePathname();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-col flex-grow  pt-5 pb-4 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-4">
          <h1 className="text-xl font-bold text-blue-600">
            ScrapeX
          </h1>
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const color = isActive ? 'black' : 'white';
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-3 py-2 text-sm font-medium rounded-md
                  ${isActive && "text-primary"
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {user.avatar ? (
                <img
                  className="h-10 w-10 rounded-full"
                  src={user.avatar}
                  alt={user.name}
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                  {user.name?.[0] || user.email[0].toUpperCase()}
                </div>
              )}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-700">
                {user.name || 'User'}
              </p>
              <p className="text-xs text-gray-500">
                {user.plan} Plan
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}