"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      router.push("/auth/login")
    }, 1500)
  }

  return (
    <main className="h-screen w-screen flex items-center justify-center bg-gradient-to-b from-indigo-100 via-blue-200 to-indigo-200 p-4">
      <div className="w-full max-w-md flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center w-full">
          <div className={isLoading ? "animate-pulse" : ""}>
            <div className="flex flex-col items-center">
              {/*<MedicalFolderIcon />*/}
              <Image
                src="/image/logo.svg"
                alt="MedX Logo"
                width={64}
                height={64}
                className="mb-2"
              />
              <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3E3187] to-[#443CC6] drop-shadow-lg">
                MedX
              </h1>

              <p className="text-indigo-900 mt-4 text-center ">
                Your personal healthcare assistant
              </p>
            </div>
          </div>

          <div className="w-full space-y-4 mt-8">
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full py-3 bg-[#453DC7] text-white rounded-full font-medium tracking-wide transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>

            <Link
              href="/auth/register"
              passHref
            >
              <div className="w-full py-3 bg-blue-100 text-indigo-700 rounded-full font-medium tracking-wide text-center transition-colors hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer">
                Sign Up
              </div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
