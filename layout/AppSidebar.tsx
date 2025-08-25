"use client";

import React, { useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AcademicCapIcon,
  BeakerIcon,
  EllipsisHorizontalIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";

import { useSidebar } from "../context/SidebarContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

const navItems: NavItem[] = [
  {
    icon: <BeakerIcon className="w-6 h-6" />,
    name: "ផ្ទាំងព័ត៌មាន",
    path: "/learn/dashboard",
  },
  {
    icon: <AcademicCapIcon className="w-6 h-6" />,
    name: "ការសិក្សា",
    path: "/learn/learning",
  },
  {
    icon: <UserCircleIcon className="w-6 h-6" />,
    name: "គណនី",
    path: "/learn/profile",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  const renderMenuItems = (navItems: NavItem[]) => (
    <ul>
      {navItems.map((nav) => (
        <li key={nav.name}>
          <Link
            className={`group relative flex items-center w-full gap-3 px-3 py-2 font-medium rounded-lg text-theme-sm ${isActive(nav.path) ? "bg-brand-50 text-brand-500 dark:bg-brand-500/[0.12] dark:text-brand-400" : "text-gray-700 hover:bg-gray-100 group-hover:text-gray-700 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-gray-300"}`}
            href={nav.path}
          >
            <span
              className={`${isActive(nav.path) ? "text-brand-500 dark:text-brand-400" : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"}`}
            >
              {nav.icon}
            </span>
            {(isExpanded || isHovered || isMobileOpen) && (
              <span className="menu-item-text">{nav.name}</span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 dark:text-gray-200 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
              ? "w-[290px]"
              : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                alt="Logo"
                className="dark:hidden"
                height={40}
                src="/images/logo/logo.svg"
                width={150}
              />
              <Image
                alt="Logo"
                className="hidden dark:block"
                height={40}
                src="/images/logo/logo-dark.svg"
                width={150}
              />
            </>
          ) : (
            <Image
              alt="Logo"
              height={32}
              src="/images/logo/logo-icon.svg"
              width={32}
            />
          )}
        </Link>
      </div>

      {/* Menu */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <h2
              className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
              }`}
            >
              {isExpanded || isHovered || isMobileOpen ? (
                "Menu"
              ) : (
                <EllipsisHorizontalIcon className="w-5 h-5" />
              )}
            </h2>
            {renderMenuItems(navItems)}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
