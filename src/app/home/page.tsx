"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/store/store"
import {
  cleanupExpired,
  selectCompletedChallengeIds,
} from "@/store/slices/challengesSlice"

import {
  Bell,
  Settings,
  Clock,
  LogOut,
  User,
  MessageCircle,
  Users,
  Search,
} from "lucide-react"
import { FaUserCircle } from "react-icons/fa"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

import BottomNavigation from "@/components/navbar"
import { setAuthToken, apiClient, getAllChallenges } from "@/utils/api"
import { BarLoader } from "react-spinners"

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
  const dispatch = useDispatch()
  const completedChallengeIds = useSelector((state: RootState) =>
    selectCompletedChallengeIds(state.challenges)
  )
  const [search, setSearch] = useState("")
  const [visibleCount, setVisibleCount] = useState(3)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

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

  useEffect(() => {
    dispatch(cleanupExpired())
  }, [dispatch])

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

  const filteredChallenges = challenges.filter((challenge: Challenge) => {
    if (!search) return true
    return challenge.description.toLowerCase().includes(search.toLowerCase())
  })

  const handleLoadMore = () => {
    setIsLoadingMore(true)
    setTimeout(() => {
      setVisibleCount((c) => c + 3)
      setIsLoadingMore(false)
    }, 500)
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
            <p className="text-sm font-semibold text-blue-600">
              {user?.name || "Loading..."}
            </p>
          </motion.div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSearch((s) => (s ? "" : s))}
            className="focus:outline-none"
            title="Search Challenges"
          >
            <Search className="h-6 w-6 text-gray-500" />
          </button>
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
            className="font-semibold text-gray-800 mb-4 text-lg tracking-tight"
          >
            Current Challenges
          </motion.h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {isChallengesLoading ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-gray-500 text-sm col-span-full flex justify-center items-center"
              >
                <BarLoader
                  color="#B95CF4"
                  loading={true}
                />
              </motion.div>
            ) : challengesError ? (
              <motion.div className="text-red-500 text-sm col-span-full">
                {challengesError}
              </motion.div>
            ) : filteredChallenges.length === 0 ? (
              <div className="text-gray-500 text-sm col-span-full">
                No challenges found.
              </div>
            ) : (
              filteredChallenges
                .slice(0, visibleCount)
                .map((challenge: Challenge, idx: number) => {
                  const isCompleted = completedChallengeIds.includes(
                    challenge.id
                  )
                  return (
                    <motion.div
                      key={challenge.id}
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{
                        delay: idx * 0.08 + 0.1,
                        type: "spring",
                        stiffness: 100,
                      }}
                      className={cn(
                        "relative bg-white rounded-xl border shadow-md p-3 flex flex-col gap-3 transition-all cursor-pointer group hover:shadow-lg hover:border-blue-400",
                        isCompleted
                          ? "opacity-60 grayscale pointer-events-none"
                          : ""
                      )}
                      onClick={() =>
                        !isCompleted &&
                        router.push(`/challenge/${challenge.id}`)
                      }
                    >
                      <div className="flex items-center gap-3 mb-1">
                        <span
                          className={cn(
                            "inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50",
                            challenge.conditionKey.includes("water")
                              ? "bg-blue-100 text-blue-500"
                              : "bg-indigo-100 text-indigo-500"
                          )}
                        >
                          <Clock className="w-5 h-5" />
                        </span>
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-gray-800 truncate">
                            {challenge.description}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {challenge.conditionValue} {challenge.unit} •{" "}
                            {challenge.timeFrame}
                          </p>
                        </div>
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-yellow-200 text-yellow-800 text-xs font-bold shadow-sm border border-yellow-300">
                          +{challenge.rewardAmount}
                        </span>
                      </div>
                      {isCompleted && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 text-green-600 text-xs font-semibold">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Completed
                        </div>
                      )}
                    </motion.div>
                  )
                })
            )}
          </div>
          {filteredChallenges.length > visibleCount && (
            <div className="flex justify-center mt-4">
              <button
                className="px-4 py-2 rounded-md bg-purple-400 text-white font-semibold text-sm shadow hover:bg-purple-500 transition-colors flex items-center gap-2"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore && (
                  <BarLoader
                    color="#ffffff"
                    height={4}
                    width={100}
                  />
                )}
                {!isLoadingMore && "Load more"}
              </button>
            </div>
          )}
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
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
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
        </motion.div>
      </main>
      <BottomNavigation />
    </div>
  )
}

export default HomePage
