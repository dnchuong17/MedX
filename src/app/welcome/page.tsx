"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="rounded-3xl shadow-xl border-0 bg-white/40 backdrop-blur-2xl">
          <CardContent className="flex flex-col items-center py-12 px-8">
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
                  width={72}
                  height={72}
                  className="mb-3"
                  priority
                />
              </motion.div>
              <motion.h1
                className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3E3187] to-[#443CC6] drop-shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
              >
                MedX
              </motion.h1>
              <motion.p
                className="text-indigo-900 mt-4 text-center text-lg font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
              >
                Your personal healthcare assistant
              </motion.p>
              <motion.p
                className="text-gray-500 mt-2 text-center text-base"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
              >
                Securely manage your health records and access care anytime,
                anywhere.
              </motion.p>
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
                className="w-full py-3 text-base rounded-full font-semibold tracking-wide bg-gradient-to-r from-[#3E3187] to-[#443CC6] text-white shadow-md hover:scale-105 transition-transform"
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
                passHref
                legacyBehavior
              >
                <a
                  className="block w-full py-3 bg-blue-100 text-indigo-700 rounded-full font-medium tracking-wide text-center transition-colors hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                  aria-label="Sign up for MedX"
                >
                  Sign Up
                </a>
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
