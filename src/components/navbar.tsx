"use client"

import React from "react"
import { Home, User, MessageCircle, File } from "lucide-react"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { setActiveTab, NavigationTab } from "@/store/features/navigationSlice"

const navItems = [
  { key: "home" as NavigationTab, href: "/", icon: Home },
  { key: "chat" as NavigationTab, href: "/chat", icon: MessageCircle },
  { key: "health-record" as NavigationTab, href: "/health-record", icon: File },
  { key: "profile" as NavigationTab, href: "/profile", icon: User },
] as const

export function BottomNavigation() {
  const dispatch = useDispatch()
  const activeTab = useSelector(
    (state: RootState) => state.navigation.activeTab
  )

  const handleTabClick = (tab: NavigationTab) => {
    dispatch(setActiveTab(tab))
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <nav className="flex items-center justify-between bg-neutral-900/40 rounded-full shadow-xl px-4 py-2 min-w-[300px] max-w-xs mx-auto backdrop-blur-xs">
        {navItems.map(({ key, href, icon: Icon }) => (
          <Link
            key={key}
            href={href}
            aria-label={key}
            className="flex-1 flex justify-center"
            onClick={() => handleTabClick(key)}
          >
            <div
              className={`flex items-center justify-center w-10 h-10 transition-colors ${
                activeTab === key
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
