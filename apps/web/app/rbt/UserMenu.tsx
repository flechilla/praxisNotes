"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";

type UserMenuProps = {
  user: Session["user"] | undefined;
};

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close the menu when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <a
          href="/auth/signin"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          Sign in
        </a>
      </div>
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user.email?.charAt(0).toUpperCase() || "U";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-sm text-gray-600 hidden sm:inline-block">
          {user.name || user.email?.split("@")[0]}
        </span>
        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 shadow-sm">
          <span className="text-sm font-medium text-indigo-700">
            {initials}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-1 z-20 border border-gray-100">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.name || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>

          <a
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Profile
          </a>

          <a
            href="/settings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Settings
          </a>

          <button
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
