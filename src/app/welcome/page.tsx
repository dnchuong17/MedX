"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function WelcomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      router.push("/auth/login")
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <style
        jsx
        global
      >{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s ease infinite;
        }
        .animate-gradient-slow {
          background-size: 200% 200%;
          animation: gradient 6s ease infinite;
        }
      `}</style>
      {/* App-like container */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <Card className="border-0 backdrop-blur-2xl overflow-hidden bg-gradient-to-br from-blue-50/80 via-purple-50/80 to-pink-50/80">
            <CardContent className="flex flex-col items-center py-12 px-6">
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.2,
                    type: "spring",
                    stiffness: 120,
                  }}
                >
                  <Image
                    src="/image/logo.svg"
                    alt="MedX Logo"
                    width={80}
                    height={80}
                    className="mb-4"
                    priority
                  />
                </motion.div>
                <motion.h1
                  className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 drop-shadow-lg animate-gradient-slow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                >
                  MedX
                </motion.h1>
                <motion.p
                  className="text-blue-900 mt-4 text-center text-xl font-medium"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
                >
                  Your personal healthcare assistant
                </motion.p>
                <motion.p
                  className="text-gray-600 mt-3 text-center text-base leading-relaxed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
                >
                  Securely manage your health records and access care anytime,
                  anywhere.
                </motion.p>
              </motion.div>

              {/* Features Section */}
              <motion.div
                className="w-full mt-8 space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.8 }}
              >
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm">Secure Health Records</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm">24/7 Access to Care</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-pink-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <span className="text-sm">Easy Appointment Booking</span>
                </div>
              </motion.div>

              <motion.div
                className="w-full space-y-4 mt-10"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <Button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full py-4 text-base rounded-2xl font-semibold tracking-wide bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all animate-gradient"
                  aria-label="Log in to MedX"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                        />
                      </svg>
                      Logging in...
                    </span>
                  ) : (
                    "Log In"
                  )}
                </Button>
                <Link
                  href="/auth/register"
                  className="block w-full py-4 bg-white text-blue-600 rounded-2xl font-medium tracking-wide text-center transition-all hover:bg-blue-50 active:scale-[0.98] shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                  aria-label="Sign up for MedX"
                >
                  Sign Up
                </Link>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
