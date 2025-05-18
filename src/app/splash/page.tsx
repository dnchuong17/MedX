"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
// import MedicalFolderIcon from '../../components/medical-folder-icon';

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
          }, 500)
          return 100
        }
        return prev + 10
      })
    }, 200)

    return () => clearInterval(interval)
  }, [router])

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
                width={120}
                height={120}
                priority
              />
              <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3E3187] to-[#443CC6] drop-shadow-lg">
                MedX
              </h1>{" "}
              <p className="text-indigo-700 mt-4 text-center">
                Your personal healthcare assistant
              </p>
            </div>
          </div>
          {isLoading && (
            <div className="mt-12 w-64 bg-blue-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
