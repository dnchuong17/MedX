/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import "@solana/wallet-adapter-react-ui/styles.css"
import { registerByEmail } from "@/utils/api"

type RegisterMethod = "Email" | "Phone" | "Wallet"

const RegisterPageContent = () => {
  const router = useRouter()
  const wallet = useWallet()
  const [registerMethod, setRegisterMethod] = useState<RegisterMethod>("Email")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [step, setStep] = useState<"register" | "setPassword">("register")

  useEffect(() => {
    if (registerMethod === "Wallet" && wallet.connected && wallet.publicKey) {
      // Optionally, call registerWallet here if you want to register on backend
      // await registerWallet({ wallet_address: wallet.publicKey.toBase58(), message, signature })
      router.push("/home")
    }
  }, [registerMethod, wallet.connected, wallet.publicKey, router])

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (registerMethod === "Wallet") {
      if (wallet.connected) {
        return
      } else {
        alert("Please connect your wallet first!")
      }
    } else {
      setStep("setPassword")
    }
  }

  const handlePasswordCreation = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert("Passwords do not match!")
      return
    }

    try {
      await registerByEmail({
        name: fullName,
        email,
        password,
      })

      alert("Register successfully! Please check your email to take OTP code.")
      router.push(`/auth/verify?email=${encodeURIComponent(email)}`)
    } catch (err: any) {
      alert("Register error: " + (err.message || JSON.stringify(err)))
    }
  }

  if (step === "setPassword") {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="flex items-center p-4">
          <button
            onClick={() => setStep("register")}
            className="p-2"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-center flex-1 text-indigo-700 text-xl font-semibold">
            Set Password
          </h1>
        </div>

        <div className="p-6 flex-1">
          <form
            onSubmit={handlePasswordCreation}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="text-gray-800 font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-100 border border-gray-200"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-gray-800 font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-100 border border-gray-200"
                  placeholder="Confirm password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium"
            >
              Create New Password
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center p-4">
        <Link href="/auth/login">
          <button className="p-2">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <h1 className="text-center flex-1 text-indigo-700 text-xl font-semibold">
          Register
        </h1>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Welcome</h2>
          <p className="text-gray-600">
            Create a new account using your preferred method
          </p>
        </div>

        <div className="flex border-b border-gray-200 mb-6">
          {["Email", "Phone", "Wallet"].map((method) => (
            <button
              key={method}
              onClick={() => setRegisterMethod(method as RegisterMethod)}
              className={`flex-1 py-3 text-center ${
                registerMethod === method
                  ? "text-indigo-700 border-b-2 border-indigo-700 font-medium"
                  : "text-gray-500"
              }`}
            >
              {method}
            </button>
          ))}
        </div>

        <form
          onSubmit={handleRegister}
          className="space-y-6"
        >
          {registerMethod === "Wallet" ? (
            <>
              <div className="text-gray-800 font-medium mb-2">
                Register with Solana Wallet
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Connect your Solana wallet to register a new account
              </p>
              <WalletMultiButton className="w-full" />
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-gray-800 font-medium">Full name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-100 border border-gray-200"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {registerMethod === "Email" && (
                <div className="space-y-2">
                  <label className="text-gray-800 font-medium">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-100 border border-gray-200"
                    placeholder="example@example.com"
                    required
                  />
                </div>
              )}

              {registerMethod === "Phone" && (
                <div className="space-y-2">
                  <label className="text-gray-800 font-medium">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-100 border border-gray-200"
                    placeholder="+123 456 890"
                    required
                  />
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium"
          >
            Continue
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-indigo-600 font-medium"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPageContent
