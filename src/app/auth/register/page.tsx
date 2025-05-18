/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Eye, EyeOff, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import "@solana/wallet-adapter-react-ui/styles.css"
import { registerByPhone, setEmailAfterPhone, verifyOtp } from "@/utils/api"
import { AnimatePresence, motion } from "framer-motion"

type RegisterMethod = "Email" | "Phone"

const tabList: RegisterMethod[] = ["Email", "Phone"]

const tabUnderlineVariants = {
  initial: { x: 0 },
  animate: (index: number) => ({
    x: `${index * 100}%`,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  }),
}

const stepVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -30, transition: { duration: 0.2 } },
}

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
  const [step, setStep] = useState<
    "register" | "setPassword" | "setEmail" | "verifyOtp"
  >("register")
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)
  const [otp, setOtp] = useState("")

  useEffect(() => {
    // No wallet tab logic needed
  }, [wallet.connected, wallet.publicKey, router])

  function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (registerMethod === "Phone") {
      setStep("setPassword")
    } else {
      setStep("setPassword")
    }
  }

  async function handlePhonePassword(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setFeedback(null)
    try {
      await registerByPhone({ name: fullName, phone: phoneNumber, password })
      setStep("setEmail")
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: "Register error: " + (err.message || JSON.stringify(err)),
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSetEmail(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setFeedback(null)
    try {
      await setEmailAfterPhone(phoneNumber, email)
      setStep("verifyOtp")
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: "Set email error: " + (err.message || JSON.stringify(err)),
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setFeedback(null)
    try {
      await verifyOtp({ email, otp })
      setFeedback({ type: "success", message: "Verification successful!" })
      setTimeout(() => router.push("/home"), 1200)
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: "OTP error: " + (err.message || JSON.stringify(err)),
      })
    } finally {
      setIsLoading(false)
    }
  }

  function handleWalletContinue() {
    if (wallet.connected) {
      router.push("/home")
    }
  }

  // Animated feedback/toast
  function FeedbackToast() {
    if (!feedback) return null
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`fixed top-6 left-1/2 z-50 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-medium ${
            feedback.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {feedback.message}
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <div className="flex flex-col h-full min-h-screen bg-white relative">
      <FeedbackToast />
      <div className="flex items-center p-4">
        <Link href={step === "register" ? "/auth/login" : "#"}>
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition"
            onClick={
              step === "setPassword" ? () => setStep("register") : undefined
            }
            type="button"
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>
        </Link>
        <h1 className="text-center flex-1 text-indigo-700 text-xl font-semibold">
          {step === "register"
            ? "Register"
            : step === "setPassword"
            ? "Set Password"
            : step === "setEmail"
            ? "Set Email"
            : "Verify OTP"}
        </h1>
      </div>
      <div className="p-6 flex-1 flex flex-col justify-center">
        <AnimatePresence
          mode="wait"
          initial={false}
        >
          {step === "register" && (
            <motion.div
              key="register"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-8"
            >
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Welcome</h2>
                <p className="text-gray-600">
                  Create a new account using your preferred method
                </p>
              </div>
              <div className="relative flex border-b border-gray-200 mb-6">
                {tabList.map((method) => (
                  <button
                    key={method}
                    onClick={() => setRegisterMethod(method)}
                    className={`flex-1 py-3 text-center transition font-medium focus:outline-none ${
                      registerMethod === method
                        ? "text-indigo-700"
                        : "text-gray-500 hover:text-indigo-600"
                    }`}
                    type="button"
                  >
                    {method}
                  </button>
                ))}
                <motion.div
                  className="absolute bottom-0 left-0 w-1/3 h-0.5 bg-indigo-700 rounded-full"
                  variants={tabUnderlineVariants}
                  initial="initial"
                  animate="animate"
                  custom={tabList.indexOf(registerMethod)}
                  style={{ width: "50%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </div>
              <form
                onSubmit={handleRegister}
                className="space-y-6"
              >
                <AnimatePresence
                  mode="wait"
                  initial={false}
                >
                  <motion.div
                    key="fields"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    {registerMethod === "Email" && (
                      <div className="space-y-2">
                        <label className="text-gray-800 font-medium">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-3 rounded-lg bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                          placeholder="example@example.com"
                          required
                        />
                      </div>
                    )}
                    {registerMethod === "Phone" && (
                      <div className="space-y-2">
                        <label className="text-gray-800 font-medium">
                          Full name
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full p-3 rounded-lg bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                          placeholder="Enter your full name"
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
                          className="w-full p-3 rounded-lg bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                          placeholder="+84 909 090 909"
                          required
                        />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium transition hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:opacity-60"
                  disabled={isLoading}
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
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    "Continue"
                  )}
                </button>
              </form>
              {/* Wallet registration always at the bottom, centered */}
              <div className="flex flex-col items-center justify-center mt-12 mb-4 min-h-[220px]">
                <div className="text-gray-800 font-medium mb-2 text-center">
                  Register with Solana Wallet
                </div>
                <p className="text-gray-600 text-sm mb-4 text-center">
                  Connect your Solana wallet to register a new account
                </p>
                <div className="flex justify-center items-center gap-4 w-full">
                  <WalletMultiButton className="w-full max-w-xs" />
                  <button
                    type="button"
                    onClick={handleWalletContinue}
                    disabled={!wallet.connected}
                    aria-label="Continue with connected wallet"
                    className={`flex items-center justify-center p-3 rounded-full bg-indigo-600 text-white transition hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:opacity-60 ${
                      !wallet.connected ? "cursor-not-allowed" : ""
                    }`}
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="text-indigo-600 font-medium hover:underline"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </motion.div>
          )}
          {step === "setPassword" && (
            <motion.div
              key="setPassword"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-8"
            >
              <form
                onSubmit={handlePhonePassword}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-gray-800 font-medium">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 rounded-lg bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                      placeholder="Enter password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-500 hover:text-indigo-600"
                      tabIndex={-1}
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
                      className="w-full p-3 rounded-lg bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                      placeholder="Confirm password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-3 text-gray-500 hover:text-indigo-600"
                      tabIndex={-1}
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
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium transition hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:opacity-60"
                  disabled={isLoading || password !== confirmPassword}
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
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    "Continue"
                  )}
                </button>
              </form>
            </motion.div>
          )}
          {step === "setEmail" && (
            <motion.div
              key="setEmail"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-8"
            >
              <form
                onSubmit={handleSetEmail}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-gray-800 font-medium">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    placeholder="example@example.com"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium transition hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:opacity-60"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Continue"}
                </button>
              </form>
            </motion.div>
          )}
          {step === "verifyOtp" && (
            <motion.div
              key="verifyOtp"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-8"
            >
              <form
                onSubmit={handleVerifyOtp}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-gray-800 font-medium">OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    placeholder="Enter OTP"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium transition hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:opacity-60"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default RegisterPageContent
