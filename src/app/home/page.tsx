"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Bell,
  Settings,
  User,
  MessageCircle,
  Users,
  Clock,
  LogOut,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { FaUserCircle } from "react-icons/fa"
import { motion } from "framer-motion"
import BottomNavigation from "@/components/navbar"
import { setAuthToken, apiClient } from "@/utils/api" // 👈 Đảm bảo import đúng

interface HealthMetric {
  title: string
  value: string | number
  description: string
}

interface Challenge {
  id: string
  title: string
  progress: number
  description: string
  icon: React.ReactNode
}

interface UserData {
  name: string
  email: string
  // Thêm các field khác nếu cần
}

const HomePage = () => {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        if (!token) {
          throw new Error("No token found")
        }

        setAuthToken(token)
        const response = await apiClient.get<UserData>("/user/me")
        setUser(response.data)
      } catch (error) {
        console.error("Error fetching user:", error)
        localStorage.removeItem("accessToken")
        setAuthToken(null)
        router.push("/auth/login")
      }
    }

    fetchUser()
  }, [router])

  function handleLogout() {
    localStorage.removeItem("accessToken")
    setAuthToken(null)
    router.push("/auth/login")
  }

  const healthMetrics: HealthMetric[] = [
    { title: "BMI Index", value: "23.5", description: "Normal" },
    { title: "Heart Rate", value: "72", description: "Average BPM today" },
    { title: "Activity Streak", value: "7", description: "Consecutive active days" },
    { title: "Weight Loss", value: "3.2/5", description: "KG lost/goal" },
  ]

  const challenges: Challenge[] = [
    {
      id: "1",
      title: "10K Steps Challenge",
      progress: 70,
      description: "7,533/10,000 steps today",
      icon: <Clock className="h-5 w-5 text-indigo-500" />,
    },
    {
      id: "2",
      title: "Drink Enough Water Challenge (30 days)",
      progress: 40,
      description: "1.2/3.0 liters today • Day 18/30",
      icon: <Clock className="h-5 w-5 text-blue-500" />,
    },
  ]

  return (
      <div className="flex flex-col min-h-screen bg-white">
        {/* Header */}
        <header className="sticky top-0 z-30 p-4 flex items-center justify-between bg-white bg-opacity-95 backdrop-blur shadow-xl mb-8">
          <div className="flex items-center space-x-2">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center"
            >
              <FaUserCircle className="w-8 h-8 text-gray-400" />
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
            >
              <p className="text-sm text-gray-500">Hi, Welcome Back</p>
              <p className="text-sm font-semibold text-blue-600">
                {user?.name || "Loading..."}
              </p>
            </motion.div>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="h-6 w-6 text-gray-500" />
            <Settings className="h-6 w-6 text-gray-500" />
            <button onClick={handleLogout} title="Logout">
              <LogOut className="h-6 w-6 text-gray-500 hover:text-red-500 transition-colors" />
            </button>
          </div>
        </header>

        {/* ... phần main giữ nguyên ... */}
        <BottomNavigation activeItem="home" />
      </div>
  )
}

export default HomePage
