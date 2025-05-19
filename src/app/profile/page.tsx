"use client"

import React from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import BottomNavigation from "@/components/navbar"
import { useRouter } from "next/navigation"
import {
  FaUserCircle,
  FaHeartbeat,
  FaWallet,
  FaLock,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaChevronRight,
  FaArrowLeft,
  FaCamera,
  FaBell,
} from "react-icons/fa"

interface MenuItemProps {
  icon: React.ReactNode
  label: string
  onClick?: () => void
}

const MenuItem = ({ icon, label, onClick }: MenuItemProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center justify-between p-4 rounded-xl hover:bg-[#EEF0FF] cursor-pointer transition-colors active:bg-[#E8E9FF]"
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <div className="bg-[#EEF0FF] p-3 rounded-full text-[#6C4FF7]">
          {icon}
        </div>
        <span className="text-gray-700 text-base font-medium">{label}</span>
      </div>
      <FaChevronRight className="w-4 h-4 text-gray-400" />
    </motion.div>
  )
}

export default function ProfilePage() {
  const router = useRouter()

  const handleMenuItemClick = (label: string) => {
    switch (label) {
      case "Profile":
        router.push("/profile/edit-profile")
        break
      case "Medical Records":
        router.push("/medical-records")
        break
      case "Wallet":
        router.push("/wallet")
        break
      case "Privacy Policy":
        router.push("/privacy-policy")
        break
      case "Settings":
        router.push("/settings")
        break
      case "Help":
        router.push("/help")
        break
      case "Logout":
        // Handle logout logic here
        localStorage.removeItem("accessToken")
        router.push("/auth/login")
        break
      default:
        break
    }
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-b from-[#f5f5fa] to-white overflow-hidden">
      {/* Status Bar */}
      <div className="h-6 bg-[#6C4FF7] w-full" />

      {/* Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 bg-white w-full overflow-y-auto shadow-lg rounded-b-3xl"
      >
        {/* Header with Back Button and Title */}
        <div className="sticky top-0 z-10 p-6 flex items-center justify-between border-b border-gray-100 bg-white">
          <div className="flex items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-[#6C4FF7] mr-4 hover:bg-[#EEF0FF] p-2 rounded-full transition-colors"
              onClick={() => router.back()}
            >
              <FaArrowLeft className="w-5 h-5" />
            </motion.button>
            <h2 className="text-[#6C4FF7] text-2xl font-bold">My Profile</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="text-[#6C4FF7] hover:bg-[#EEF0FF] p-2 rounded-full transition-colors relative"
          >
            <FaBell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </motion.button>
        </div>

        {/* Profile Picture */}
        <div className="flex flex-col items-center p-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-20 h-20 rounded-full overflow-hidden ring-4 ring-[#EEF0FF] shadow-lg">
              <Image
                src="/7Foods.png"
                alt="Profile"
                fill
                className="object-cover"
                priority
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute bottom-0 right-0 bg-[#6C4FF7] rounded-full p-2 shadow-lg hover:bg-[#5a3fd9] transition-colors"
            >
              <FaCamera className="w-4 h-4 text-white" />
            </motion.button>
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold mt-6 text-gray-800"
          >
            John Doe
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-500 mt-1"
          >
            john.doe@gmail.com
          </motion.p>
        </div>

        {/* Menu */}
        <div className="px-6 pb-6">
          <AnimatePresence>
            {[
              { icon: <FaUserCircle className="w-5 h-5" />, label: "Profile" },
              {
                icon: <FaHeartbeat className="w-5 h-5" />,
                label: "Medical Records",
              },
              { icon: <FaWallet className="w-5 h-5" />, label: "Wallet" },
              { icon: <FaLock className="w-5 h-5" />, label: "Privacy Policy" },
              { icon: <FaCog className="w-5 h-5" />, label: "Settings" },
              { icon: <FaQuestionCircle className="w-5 h-5" />, label: "Help" },
              { icon: <FaSignOutAlt className="w-5 h-5" />, label: "Logout" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MenuItem
                  icon={item.icon}
                  label={item.label}
                  onClick={() => handleMenuItemClick(item.label)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="flex-shrink-0">
        <BottomNavigation />
      </div>
    </div>
  )
}
