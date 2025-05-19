"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useWallet } from "@solana/wallet-adapter-react"
import "@solana/wallet-adapter-react-ui/styles.css"
import { loginUser, loginWallet, loginByPhone, setAuthToken } from "@/utils/api"
import bs58 from "bs58"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { AnimatePresence, motion } from "framer-motion"

enum LoginTab {
  EMAIL = "Email",
  PHONE = "Phone",
  WALLET = "Wallet",
}

interface LoginFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  error: string | null;
  loading: boolean;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  children: React.ReactNode;
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

  useEffect(() => {
    setError(null)
    setPassword("")
  }, [activeTab])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email) {
      setError("Email is required.")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.")
      return
    }

    if (!password) {
      setError("Password is required.")
      return
    }

    setLoading(true)
    try {
      const response = await loginUser({ email, password })

      console.log("Login response:", response)

      if (!response || !response.token) {
        setError("No authentication token received. Please try again.")
        return
      }

      const token = response.token
      localStorage.setItem("accessToken", token)
      setAuthToken(token)

      console.log("Login token:", token)
      console.log("Token in localStorage:", localStorage.getItem("accessToken"))

      router.push("/profile/set-up")
    } catch (err: any) {
      console.error("Login error details:", err)

      if (err?.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.message) {
        setError(err.message)
      } else {
        setError("Login failed. Please check your credentials and try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!phone) {
      setError("Phone number is required.")
      return
    }

    const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/
    if (!phoneRegex.test(phone)) {
      setError("Please enter a valid phone number.")
      return
    }

    if (!password) {
      setError("Password is required.")
      return
    }

    setLoading(true)
    try {
      const formattedPhone = phone.replace(/\s+/g, "")

      const response = await loginByPhone(formattedPhone, password)

      const token = response.token
      if (token) {
        localStorage.setItem("accessToken", token)
        setAuthToken(token)

        console.log("Login token:", token)
        console.log("Token in localStorage:", localStorage.getItem("accessToken"))

        router.push("/auth/verification")
      } else {
        throw new Error("No token received from server")
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Login failed.")
    } finally {
      setLoading(false)
    }
  }

  const handleWalletLogin = async () => {
    setError(null)

    if (!connected) {
      setError("Please connect your wallet first.")
      return
    }

    if (!publicKey) {
      setError("Unable to detect wallet public key.")
      return
    }

    if (!signMessage) {
      setError("Your wallet does not support message signing.")
      return
    }

    setLoading(true)
    try {
      const message = `Login to MedX at ${new Date().toISOString()}`
      const encodedMessage = new TextEncoder().encode(message)

      let signatureUint8
      try {
        signatureUint8 = await signMessage(encodedMessage)
      } catch (signErr: any) {
        // Handle user rejection of signature request
        if (signErr.message?.includes("User rejected")) {
          setError("You declined to sign the authentication message.")
        } else {
          setError(`Signature failed: ${signErr.message || "Unknown error"}`)
        }
        setLoading(false)
        return
      }

      const signature = bs58.encode(signatureUint8)

      // Using the proper loginWallet function
      const response = await loginWallet({
        wallet_address: publicKey.toBase58(),
        message,
        signature,
      })

      const token = response.token
      if (token) {
        localStorage.setItem("accessToken", token)
        setAuthToken(token)

        console.log("Wallet login token:", token)
        console.log("Token in localStorage:", localStorage.getItem("accessToken"))

        router.push("/profile/set-up")
      } else {
        throw new Error("No token received from server")
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Wallet login failed.")
    } finally {
      setLoading(false)
    }
  }

  // Reusable login form component
  const LoginForm: React.FC<LoginFormProps> = ({
                                                 onSubmit,
                                                 error,
                                                 loading,
                                                 showPassword,
                                                 setShowPassword,
                                                 children
                                               }) => (
      <Card className="w-full">
        <form
            onSubmit={onSubmit}
            className="w-full"
            noValidate // Disable native browser validation to use our custom validation
        >
          <CardContent className="space-y-4">
            {error && (
                <div className="text-red-600 text-sm font-medium">{error}</div>
            )}

            {children}

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
                    aria-required="true"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    aria-label={showPassword ? "Hide password" : "Show password"}
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
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </>
                    ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
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
                Forgot Password
              </Link>
            </div>

            <Button
                type="submit"
                disabled={loading}
                className="w-full"
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>

            <div className="text-center">
              <span className="text-gray-500">or</span>
            </div>

            <div className="flex justify-center">
              <Button
                  type="button"
                  variant="secondary"
                  size="icon"
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
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
  )

  const renderEmailTab = () => (
      <LoginForm
          onSubmit={handleEmailLogin}
          error={error}
          loading={loading}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
      >
        <div>
          <label className="block text-gray-800 font-medium mb-1">
            Email
          </label>
          <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@example.com"
              className="w-full px-4 py-3 rounded-lg bg-blue-50 border-0 focus:ring-2 focus:ring-indigo-500"
              aria-required="true"
              autoComplete="email"
          />
        </div>
      </LoginForm>
  )

  const renderPhoneTab = () => (
      <LoginForm
          onSubmit={handlePhoneLogin}
          error={error}
          loading={loading}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
      >
        <div>
          <label className="block text-gray-800 font-medium mb-1">
            Phone Number
          </label>
          <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+123 456 7890"
              className="w-full px-4 py-3 rounded-lg bg-blue-50 border-0 focus:ring-2 focus:ring-indigo-500"
              aria-required="true"
              autoComplete="tel"
          />
        </div>
      </LoginForm>
  )

  const renderWalletTab = () => (
      <Card className="w-full space-y-6">
        <CardContent className="space-y-4">
          {error && (
              <div className="text-red-600 text-sm font-medium">{error}</div>
          )}
          <CardHeader>
            <CardTitle>Connect with Wallet</CardTitle>
            <CardDescription>
              Connect your Solana wallet to log in.
            </CardDescription>
          </CardHeader>
          <WalletMultiButton className="w-full" />
        </CardContent>
        <CardFooter>
          <Button
              type="button"
              onClick={handleWalletLogin}
              disabled={loading}
              className="w-full"
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
          </Button>
        </CardFooter>
      </Card>
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
            <Button
                variant={activeTab === LoginTab.EMAIL ? "default" : "ghost"}
                className="flex-1 border-b-2"
                onClick={() => setActiveTab(LoginTab.EMAIL)}
            >
              Email
            </Button>
            <Button
                variant={activeTab === LoginTab.PHONE ? "default" : "ghost"}
                className="flex-1 border-b-2"
                onClick={() => setActiveTab(LoginTab.PHONE)}
            >
              Phone
            </Button>
            <Button
                variant={activeTab === LoginTab.WALLET ? "default" : "ghost"}
                className="flex-1 border-b-2"
                onClick={() => setActiveTab(LoginTab.WALLET)}
            >
              Wallet
            </Button>
          </div>

          {/* Tab content with framer-motion animation */}
          <AnimatePresence mode="wait">
            {activeTab === LoginTab.EMAIL && (
                <motion.div
                    key="email"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                >
                  {renderEmailTab()}
                </motion.div>
            )}
            {activeTab === LoginTab.PHONE && (
                <motion.div
                    key="phone"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                >
                  {renderPhoneTab()}
                </motion.div>
            )}
            {activeTab === LoginTab.WALLET && (
                <motion.div
                    key="wallet"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                >
                  {renderWalletTab()}
                </motion.div>
            )}
          </AnimatePresence>

          {/* Register CTA */}
          <div className="mt-6 flex flex-col items-center">
          <span className="text-gray-600 text-sm mb-2">
            Don&apos;t have an account?
          </span>
            <Button
                asChild
                className="w-full"
            >
              <Link href="/auth/register">Register</Link>
            </Button>
          </div>
        </div>
      </div>
  )
}