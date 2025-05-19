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
  Edit2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { FaUserCircle } from "react-icons/fa"
import { motion } from "framer-motion"
import BottomNavigation from "@/components/navbar"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import {
  calculateBMI,
  getBMIStatus,
  calculateBMR,
  calculateDailyCalories,
  calculateIdealWeight,
} from "@/utils/healthMetrics"
import { getCurrentUser, updateUserProfile } from "@/utils/api"

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

const HomePage = () => {
  const router = useRouter()
  const profile = useSelector((state: RootState) => state.profile)
  const [userName, setUserName] = useState<string>("")
  const [isEditingName, setIsEditingName] = useState(false)
  const [newName, setNewName] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      router.push("/auth/login")
      return
    }

    async function fetchUserData() {
      try {
        const userData = await getCurrentUser()
        setUserName(userData.name || "")
        setNewName(userData.name || "")
      } catch (error) {
        console.error("Failed to fetch user data:", error)
        if (
          error instanceof Error &&
          error.message.includes("No authentication token found")
        ) {
          router.push("/auth/login")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleUpdateName = async () => {
    if (!newName.trim()) return

    try {
      const userData = await getCurrentUser()
      await updateUserProfile(userData.id.toString(), { name: newName.trim() })
      setUserName(newName.trim())
      setIsEditingName(false)
    } catch (error) {
      console.error("Failed to update name:", error)
      alert("Failed to update name. Please try again.")
    }
  }

  const bmi = calculateBMI(profile.height, profile.weight)
  const bmr = calculateBMR(profile)
  const dailyCalories = calculateDailyCalories(bmr)
  const idealWeight = calculateIdealWeight(profile.height, profile.gender)

  const healthMetrics: HealthMetric[] = [
    {
      title: "BMI Index",
      value: bmi !== null ? bmi : "--",
      description: getBMIStatus(bmi),
    },
    {
      title: "BMR",
      value: bmr !== null ? bmr : "--",
      description: "Basal Metabolic Rate (kcal/day)",
    },
    {
      title: "Ideal Weight",
      value: idealWeight !== null ? idealWeight : "--",
      description: "Based on height & gender (kg)",
    },
    {
      title: "Daily Calories",
      value: dailyCalories !== null ? dailyCalories : "--",
      description: "Recommended intake (kcal)",
    },
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

  function handleLogout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken")
      router.push("/auth/login")
    }
  }

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
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="text-sm font-semibold text-blue-600 bg-transparent border-b border-blue-300 focus:outline-none focus:border-blue-600 w-32"
                  placeholder="Enter your name"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleUpdateName()
                    }
                  }}
                />
                <button
                  onClick={handleUpdateName}
                  className="text-xs text-green-600 hover:text-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditingName(false)
                    setNewName(userName)
                  }}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-blue-600">
                  {loading ? "Loading..." : userName || "Guest"}
                </p>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit2 size={14} />
                </button>
              </div>
            )}
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="flex items-center space-x-4"
        >
          <Bell className="h-6 w-6 text-gray-500" />
          <Settings className="h-6 w-6 text-gray-500" />
          <button
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="h-6 w-6 text-gray-500 hover:text-red-500 transition-colors" />
          </button>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-20 ">
        {/* Health Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {healthMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
              }}
              className="bg-gray-100 rounded-lg p-4 hover:shadow-lg transition-shadow shadow-lg"
            >
              <h3 className="text-sm text-gray-800 font-medium">
                {metric.title}
              </h3>
              <p className="text-2xl font-bold text-indigo-600">
                {metric.value}
              </p>
              <p className="text-xs text-gray-500">{metric.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Health News */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="mb-6"
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-gray-800">
              Today&apos;s Health News
            </h2>
            <Link
              href="#"
              className="text-xs text-gray-500"
            >
              See All
            </Link>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-gray-100 rounded-xl shadow-md"
          >
            <div className="h-40 w-full relative">
              <Image
                src="/7Foods.png"
                alt="Healthy Foods"
                fill
                style={{ objectFit: "cover" }}
                className="rounded-xl"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-sm">
                7 Foods That Help Boost Immunity in Winter
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                These foods are not only tasty but also help your body fight off
                common winter diseases.
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-blue-600">Nutrition</span>
                <span className="text-xs text-gray-400">5 hours ago</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Current Challenges */}
        <div className="mb-6">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="font-semibold text-gray-800 mb-2"
          >
            Current Challenges
          </motion.h2>
          <div className="space-y-3">
            {challenges.map((challenge, idx) => (
              <motion.div
                key={challenge.id}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  delay: idx * 0.15 + 0.2,
                  type: "spring",
                  stiffness: 100,
                }}
                className="bg-gray-100 rounded-lg p-3 transition-shadow  shadow-md"
              >
                <div className="flex space-x-3 items-center mb-2 ">
                  {challenge.icon}
                  <div>
                    <h3 className="text-sm font-medium">{challenge.title}</h3>
                    <p className="text-xs text-gray-500">
                      {challenge.description}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-1.5">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full"
                    style={{ width: `${challenge.progress}%` }}
                  ></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Access */}
        <div>
          <h2 className="font-semibold text-gray-800 mb-2">Quick Access</h2>
          <div className="grid grid-cols-3 gap-2 ">
            {[
              {
                href: "/profile",
                label: "Profile",
                icon: <User className="h-5 w-5 text-gray-600" />,
              },
              {
                href: "/chatbot",
                label: "Chatbot",
                icon: <MessageCircle className="h-5 w-5 text-gray-600" />,
              },
              {
                href: "/community",
                label: "Community",
                icon: <Users className="h-5 w-5 text-gray-600" />,
              },
            ].map((item) => (
              <motion.div
                key={item.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  href={item.href}
                  className="flex flex-col items-center justify-center bg-gray-100 rounded-lg py-4 focus:ring-2 focus:ring-indigo-400 outline-none shadow-lg"
                >
                  <div className="bg-gray-200 p-2 rounded-full mb-1">
                    {item.icon}
                  </div>
                  <span className="text-xs">{item.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  )
}

export default HomePage
