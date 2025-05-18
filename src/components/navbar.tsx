"use client"

import React from "react"
import { Home, User, Calendar, MessageCircle } from "lucide-react"
import Link from "next/link"

interface BottomNavigationProps {
  activeItem?: "home" | "profile" | "chat" | "booking"
}

const navItems = [
  { key: "home", href: "/", icon: Home },
  { key: "profile", href: "/profile", icon: User },
  { key: "chat", href: "/chat", icon: MessageCircle },
  { key: "booking", href: "/booking", icon: Calendar },
] as const

export function BottomNavigation({
  activeItem = "home",
}: BottomNavigationProps) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 ">
      <nav className="flex items-center justify-between bg-neutral-900/40 rounded-full shadow-xl px-4 py-2 min-w-[200px] max-w-xs mx-auto backdrop-blur-xs">
        {navItems.map(({ key, href, icon: Icon }) => (
          <Link
            key={key}
            href={href}
            aria-label={key}
            className="flex-1 flex justify-center"
          >
            <div
              className={`flex items-center justify-center w-10 h-10 transition-colors ${
                activeItem === key
                  ? "bg-white text-purple-600 shadow-md"
                  : "text-white/70"
              } rounded-full`}
            >
              <Icon className="w-6 h-6" />
            </div>
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default BottomNavigation
