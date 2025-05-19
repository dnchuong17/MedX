"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export default function SplashScreen() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsLoading(false)
          setTimeout(() => {
            router.push("/welcome")
          }, 300)
          return 100
        }
        return prev + 10
      })
    }, 200)

    return () => clearInterval(interval)
  }, [router])

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3 } },
  }

  return (
    <main className="min-h-dvh w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
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
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <motion.div
            className={isLoading ? "animate-pulse" : ""}
            initial="hidden"
            animate="visible"
            variants={logoVariants}
          >
            <div className="flex flex-col items-center">
              <Image
                src="/image/logo.svg"
                alt="MedX Logo"
                width={120}
                height={120}
                priority
              />
              <motion.h1
                className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 drop-shadow-lg animate-gradient-slow"
                variants={textVariants}
              >
                MedX
              </motion.h1>
              <motion.p
                className="text-blue-900 mt-4 text-center text-xl font-semibold"
                variants={textVariants}
                transition={{ delay: 0.5 }}
              >
                Your personal healthcare assistant
              </motion.p>
            </div>
          </motion.div>
          <AnimatePresence>
            {isLoading && (
              <motion.div
                className="mt-12 w-64 bg-white/50 backdrop-blur-sm rounded-full h-2 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-2 rounded-full animate-gradient"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  style={{ minWidth: 8 }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}
