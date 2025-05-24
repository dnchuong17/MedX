"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

import {
  Bell,
  Settings,
  Clock,
  LogOut,
  User,
  MessageCircle,
  Users,
} from "lucide-react"
import { FaUserCircle } from "react-icons/fa"
import { motion } from "framer-motion"

import BottomNavigation from "@/components/navbar"
import { setAuthToken, apiClient, getAllChallenges } from "@/utils/api"

interface HealthMetric {
  title: string
  value: string | number
  description: string
}

interface Challenge {
  id: number
  description: string
  conditionKey: string
  conditionValue: number
  unit: string
  timeFrame: string
  rewardAmount: number
  conditionKeywords: string[] | null
}

interface UserData {
  name: string
  email: string
}

const HomePage = () => {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [isChallengesLoading, setIsChallengesLoading] = useState(true)
  const [challengesError, setChallengesError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        if (!token) throw new Error("No token found")

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

  useEffect(() => {
    async function fetchChallenges() {
      setIsChallengesLoading(true)
      setChallengesError(null)
      try {
        const data = await getAllChallenges()
        setChallenges(data)
      } catch {
        setChallengesError("Failed to load challenges")
      } finally {
        setIsChallengesLoading(false)
      }
    }
    fetchChallenges()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    setAuthToken(null)
    router.push("/auth/login")
  }

  const healthMetrics: HealthMetric[] = [
    { title: "BMI Index", value: "23.5", description: "Normal" },
    { title: "Heart Rate", value: "72", description: "Average BPM today" },
    {
      title: "Activity Streak",
      value: "7",
      description: "Consecutive active days",
    },
    { title: "Weight Loss", value: "3.2/5", description: "KG lost/goal" },
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
          <button
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="h-6 w-6 text-gray-500 hover:text-red-500 transition-colors" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-20">
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

        {/* Challenges */}
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
            {isChallengesLoading ? (
              <div className="text-gray-500 text-sm">Loading challenges...</div>
            ) : challengesError ? (
              <div className="text-red-500 text-sm">{challengesError}</div>
            ) : challenges.length === 0 ? (
              <div className="text-gray-500 text-sm">
                No challenges available.
              </div>
            ) : (
              challenges.map((challenge, idx) => (
                <motion.div
                  key={challenge.id}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    delay: idx * 0.15 + 0.2,
                    type: "spring",
                    stiffness: 100,
                  }}
                  className="bg-gray-100 rounded-lg p-3 shadow-md cursor-pointer hover:bg-gray-200"
                  onClick={() => router.push(`/challenge/${challenge.id}`)}
                >
                  <div className="flex space-x-3 items-center mb-2">
                    <Clock
                      className={`h-5 w-5 ${
                        challenge.conditionKey.includes("water")
                          ? "text-blue-500"
                          : "text-indigo-500"
                      }`}
                    />
                    <div>
                      <h3 className="text-sm font-medium">
                        {challenge.description}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {challenge.conditionValue} {challenge.unit} •{" "}
                        {challenge.timeFrame}
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full"
                      style={{
                        width: `${Math.floor(Math.random() * 80) + 10}%`,
                      }}
                    ></div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
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
        {/* Quick Access */}
        <div>
          <h2 className="font-semibold text-gray-800 mb-2">Quick Access</h2>
          <div className="grid grid-cols-3 gap-2">
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
