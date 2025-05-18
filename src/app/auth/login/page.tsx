/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useWallet } from "@solana/wallet-adapter-react"
import "@solana/wallet-adapter-react-ui/styles.css"
import { loginUser, loginWallet } from "@/utils/api"
import bs58 from "bs58"

enum LoginTab {
  EMAIL = "Email",
  PHONE = "Phone",
  WALLET = "Wallet",
}

export default function LoginPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<LoginTab>(LoginTab.EMAIL)
  const [email, setEmail] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const { publicKey, connected, signMessage } = useWallet()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (connected && publicKey) {
      console.log("Wallet connected:", publicKey.toBase58())
    }
  }, [connected, publicKey])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      let loginData
      if (activeTab === LoginTab.EMAIL) {
        if (!email || !password) {
          setError("Email and password are required.")
          setLoading(false)
          return
        }
        loginData = { email, password }
      } else if (activeTab === LoginTab.PHONE) {
        if (!phone || !password) {
          setError("Phone and password are required.")
          setLoading(false)
          return
        }
        loginData = { email: phone, password }
      } else {
        setError("Invalid login method.")
        setLoading(false)
        return
      }
      const response = await loginUser(loginData)
      localStorage.setItem("token", response.token)
      router.push("/auth/verification")
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Login failed.")
    } finally {
      setLoading(false)
    }
  }

  const renderEmailTab = () => (
    <form
      onSubmit={handleLogin}
      className="w-full"
    >
      <div className="space-y-4">
        {error && (
          <div className="text-red-600 text-sm font-medium">{error}</div>
        )}
        <div>
          <label className="block text-gray-800 font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@example.com"
            className="w-full px-4 py-3 rounded-lg bg-blue-50 border-0 focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-800 font-medium mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-lg bg-blue-50 border-0 focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {/* Eye icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-gray-500"
              >
                {showPassword ? (
                  <>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line
                      x1="1"
                      y1="1"
                      x2="23"
                      y2="23"
                    />
                  </>
                ) : (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                    />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-indigo-600 text-sm font-medium"
          >
            Forget Password
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-indigo-600 text-white rounded-full font-medium tracking-wide transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <div className="text-center">
          <span className="text-gray-500">or</span>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center"
          >
            {/* Fingerprint icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-indigo-600"
            >
              <path d="M12 11c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6 6 2.7 6 6z" />
              <path d="M14 11a2 2 0 0 0-2-2" />
              <path d="M16 11a4 4 0 0 0-4-4" />
              <path d="M18 11a6 6 0 0 0-6-6" />
              <path d="M20 11a8 8 0 0 0-8-8" />
            </svg>
          </button>
        </div>
      </div>
    </form>
  )

  const renderPhoneTab = () => (
    <form
      onSubmit={handleLogin}
      className="w-full"
    >
      <div className="space-y-4">
        {error && (
          <div className="text-red-600 text-sm font-medium">{error}</div>
        )}
        <div>
          <label className="block text-gray-800 font-medium mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+123 456 890"
            className="w-full px-4 py-3 rounded-lg bg-blue-50 border-0 focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-800 font-medium mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-lg bg-blue-50 border-0 focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {/* Eye icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-gray-500"
              >
                {showPassword ? (
                  <>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line
                      x1="1"
                      y1="1"
                      x2="23"
                      y2="23"
                    />
                  </>
                ) : (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                    />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-indigo-600 text-sm font-medium"
          >
            Forget Password
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-indigo-600 text-white rounded-full font-medium tracking-wide transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <div className="text-center">
          <span className="text-gray-500">or</span>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center"
          >
            {/* Fingerprint icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-indigo-600"
            >
              <path d="M12 11c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6 6 2.7 6 6z" />
              <path d="M14 11a2 2 0 0 0-2-2" />
              <path d="M16 11a4 4 0 0 0-4-4" />
              <path d="M18 11a6 6 0 0 0-6-6" />
              <path d="M20 11a8 8 0 0 0-8-8" />
            </svg>
          </button>
        </div>
      </div>
    </form>
  )

  const renderWalletTab = () => (
    <div className="w-full space-y-6">
      {/* Wallet Connection Card */}
      <div className="w-full space-y-4">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-base font-medium text-gray-800 mb-2">
            Connect with Wallet
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Connect your Solana wallet to log in.
          </p>
          <WalletMultiButton className="w-full" />
        </div>
      </div>

      {/* Log In Button */}
      <button
        type="button"
        onClick={async () => {
          if (!connected || !publicKey) {
            alert("Please connect your wallet first.")
            return
          }
          if (!signMessage) {
            alert("Your wallet does not support message signing.")
            return
          }
          setLoading(true)
          try {
            const message = `Login to MedX at ${new Date().toISOString()}`
            const encodedMessage = new TextEncoder().encode(message)
            const signatureUint8 = await signMessage(encodedMessage)
            const signature = bs58.encode(signatureUint8)
            const response = await loginWallet({
              wallet_address: publicKey.toBase58(),
              message,
              signature,
            })
            localStorage.setItem("token", response.token)
            router.push("/home")
          } catch (err: any) {
            alert(
              err?.response?.data?.message ||
                err.message ||
                "Wallet login failed."
            )
          } finally {
            setLoading(false)
          }
        }}
        disabled={loading}
        className={`w-full py-3 rounded-full font-medium tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
                ${
                  loading
                    ? "bg-indigo-400 text-white opacity-70 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500"
                }
            `}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Logging in...
          </span>
        ) : (
          "Log In with Wallet"
        )}
      </button>
    </div>
  )
  return (
    <div className="h-screen w-full flex flex-col bg-white">
      <div className="flex-1 flex flex-col px-6 pt-2 pb-6 mt-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link
            href="/"
            className="text-indigo-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <h1 className="flex-1 text-center text-xl font-semibold text-indigo-600">
            Log In
          </h1>
          <div className="w-6"></div> {/* Placeholder for balanced layout */}
        </div>

        {/* Welcome text */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Welcome</h2>
          <p className="text-gray-600 text-sm">
            Log in securely to your account using your preferred method
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-6 py-2 text-center flex-1 ${
              activeTab === LoginTab.EMAIL
                ? "text-indigo-600 border-b-2 border-indigo-600 font-medium"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(LoginTab.EMAIL)}
          >
            Email
          </button>
          <button
            className={`px-6 py-2 text-center flex-1 ${
              activeTab === LoginTab.PHONE
                ? "text-indigo-600 border-b-2 border-indigo-600 font-medium"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(LoginTab.PHONE)}
          >
            Phone
          </button>
          <button
            className={`px-6 py-2 text-center flex-1 ${
              activeTab === LoginTab.WALLET
                ? "text-indigo-600 border-b-2 border-indigo-600 font-medium"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(LoginTab.WALLET)}
          >
            Wallet
          </button>
        </div>

        {/* Tab content */}
        <div className="space-y-6">
          {activeTab === LoginTab.EMAIL && renderEmailTab()}
          {activeTab === LoginTab.PHONE && renderPhoneTab()}
          {activeTab === LoginTab.WALLET && renderWalletTab()}
        </div>
      </div>
    </div>
  )
}
