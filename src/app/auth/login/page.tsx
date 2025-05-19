"use client"

import React, { useEffect, useState, useCallback, memo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useWallet } from "@solana/wallet-adapter-react"
import "@solana/wallet-adapter-react-ui/styles.css"
import {
    loginUser,
    loginWallet,
    loginByPhone,
    setAuthToken,
    getUserByEmail
} from "@/utils/api"
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
import {
    MdFingerprint,
    MdArrowBack,
    MdVisibility,
    MdVisibilityOff,
    MdAutorenew,
} from "react-icons/md"
import { z } from "zod"
import { Input } from "@/components/ui/input"

enum LoginTab {
    EMAIL = "Email",
    PHONE = "Phone",
    WALLET = "Wallet",
}

interface LoginFormProps {
    onSubmit: (e: React.FormEvent) => Promise<void>
    error: string | null
    loading: boolean
    showPassword: boolean
    setShowPassword: (show: boolean) => void
    password: string
    setPassword: (value: string) => void
    children: React.ReactNode
}

const emailSchema = z
    .string()
    .email({ message: "Please enter a valid email address." })
const phoneSchema = z
    .string()
    .min(8, { message: "Phone number is too short." })
    .max(20, { message: "Phone number is too long." })
    .regex(/^\+?[0-9\s\-()]{8,20}$/, {
        message: "Please enter a valid phone number.",
    })
const passwordSchema = z.string().min(1, { message: "Password is required." })

const LoginForm = memo(
    ({
         onSubmit,
         error,
         loading,
         showPassword,
         setShowPassword,
         password,
         setPassword,
         children,
     }: LoginFormProps) => {
        return (
            <Card className="w-full">
                <form
                    onSubmit={onSubmit}
                    className="w-full"
                    noValidate
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
                                <Input
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
                                    {showPassword ? (
                                        <MdVisibilityOff className="w-5 h-5 text-gray-500" />
                                    ) : (
                                        <MdVisibility className="w-5 h-5 text-gray-500" />
                                    )}
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
                                <MdFingerprint className="w-6 h-6 text-indigo-600" />
                            </Button>
                        </div>
                    </CardContent>
                </form>
            </Card>
        )
    }
)

LoginForm.displayName = "LoginForm"

const EmailTab = memo(
    ({
         email,
         setEmail,
         error,
         loading,
         showPassword,
         setShowPassword,
         password,
         setPassword,
         handleEmailLogin,
     }: {
        email: string
        setEmail: (value: string) => void
        error: string | null
        loading: boolean
        showPassword: boolean
        setShowPassword: (show: boolean) => void
        password: string
        setPassword: (value: string) => void
        handleEmailLogin: (e: React.FormEvent) => Promise<void>
    }) => (
        <LoginForm
            onSubmit={handleEmailLogin}
            error={error}
            loading={loading}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            password={password}
            setPassword={setPassword}
        >
            <div>
                <label className="block text-gray-800 font-medium mb-1">Email</label>
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@example.com"
                    className="w-full px-4 py-3 rounded-lg bg-blue-50 border-0 focus:ring-2 focus:ring-indigo-500"
                    aria-required="true"
                />
            </div>
        </LoginForm>
    )
)

EmailTab.displayName = "EmailTab"

const PhoneTab = memo(
    ({
         phone,
         setPhone,
         error,
         loading,
         showPassword,
         setShowPassword,
         password,
         setPassword,
         handlePhoneLogin,
     }: {
        phone: string
        setPhone: (value: string) => void
        error: string | null
        loading: boolean
        showPassword: boolean
        setShowPassword: (show: boolean) => void
        password: string
        setPassword: (value: string) => void
        handlePhoneLogin: (e: React.FormEvent) => Promise<void>
    }) => (
        <LoginForm
            onSubmit={handlePhoneLogin}
            error={error}
            loading={loading}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            password={password}
            setPassword={setPassword}
        >
            <div>
                <label className="block text-gray-800 font-medium mb-1">
                    Phone Number
                </label>
                <Input
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
)

PhoneTab.displayName = "PhoneTab"

const WalletTab = memo(
    ({
         error,
         loading,
         handleWalletLogin,
     }: {
        error: string | null
        loading: boolean
        handleWalletLogin: () => Promise<void>
    }) => (
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
              <MdAutorenew className="animate-spin h-5 w-5 text-white" />
              Logging in...
            </span>
                    ) : (
                        "Log In with Wallet"
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
)

WalletTab.displayName = "WalletTab"

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
    }, [activeTab])

    const checkProfileAndRedirect = async (userEmail: string) => {
        try {
            const userData = await getUserByEmail(userEmail)
            console.log("User profile data:", userData)

            if (userData.age !== null &&
                userData.gender !== null &&
                userData.height !== null &&
                userData.weight !== null) {
                router.push("/home")
            } else {

                router.push("/profile/set-up")
            }
        } catch (err) {
            console.error("Error checking profile:", err)
            router.push("/profile/set-up")
        }
    }

    const handleEmailLogin = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault()
            setError(null)

            try {
                emailSchema.parse(email)
                passwordSchema.parse(password)
            } catch (err) {
                if (err instanceof z.ZodError) {
                    setError(err.errors[0].message)
                    return
                }
                setError("Validation error.")
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
                console.log(
                    "Token in localStorage:",
                    localStorage.getItem("accessToken")
                )

                await checkProfileAndRedirect(email)
            } catch (err: unknown) {
                if (
                    err &&
                    typeof err === "object" &&
                    "response" in err &&
                    err.response &&
                    typeof err.response === "object" &&
                    "data" in err.response &&
                    err.response.data &&
                    typeof err.response.data === "object" &&
                    "message" in err.response.data
                ) {
                    setError(
                        (err.response.data as { message?: string }).message ||
                        "Login failed. Please check your credentials and try again."
                    )
                } else if (err instanceof Error) {
                    setError(err.message)
                } else {
                    setError("Login failed. Please check your credentials and try again.")
                }
            } finally {
                setLoading(false)
            }
        },
        [email, password, router]
    )

    const handlePhoneLogin = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault()
            setError(null)

            try {
                phoneSchema.parse(phone)
                passwordSchema.parse(password)
            } catch (err) {
                if (err instanceof z.ZodError) {
                    setError(err.errors[0].message)
                    return
                }
                setError("Validation error.")
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
                    console.log(
                        "Token in localStorage:",
                        localStorage.getItem("accessToken")
                    )

                    router.push("/profile/set-up")
                } else {
                    throw new Error("No token received from server")
                }
            } catch (err: unknown) {
                if (
                    err &&
                    typeof err === "object" &&
                    "response" in err &&
                    err.response &&
                    typeof err.response === "object" &&
                    "data" in err.response &&
                    err.response.data &&
                    typeof err.response.data === "object" &&
                    "message" in err.response.data
                ) {
                    setError(
                        (err.response.data as { message?: string }).message ||
                        "Login failed."
                    )
                } else if (err instanceof Error) {
                    setError(err.message)
                } else {
                    setError("Login failed.")
                }
            } finally {
                setLoading(false)
            }
        },
        [phone, password, router]
    )

    const handleWalletLogin = useCallback(async () => {
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
            } catch (signErr: unknown) {
                if (signErr instanceof Error) {
                    if (signErr.message?.includes("User rejected")) {
                        setError("You declined to sign the authentication message.")
                    } else {
                        setError(`Signature failed: ${signErr.message || "Unknown error"}`)
                    }
                } else {
                    setError("Signature failed: Unknown error")
                }
                setLoading(false)
                return
            }

            const signature = bs58.encode(signatureUint8)

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
                console.log(
                    "Token in localStorage:",
                    localStorage.getItem("accessToken")
                )

                // For wallet login, we may need an additional API call to get user data
                // For now, default to profile setup page
                router.push("/profile/set-up")
            } else {
                throw new Error("No token received from server")
            }
        } catch (err: unknown) {
            if (
                err &&
                typeof err === "object" &&
                "response" in err &&
                err.response &&
                typeof err.response === "object" &&
                "data" in err.response &&
                err.response.data &&
                typeof err.response.data === "object" &&
                "message" in err.response.data
            ) {
                setError(
                    (err.response.data as { message?: string }).message ||
                    "Wallet login failed."
                )
            } else if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("Wallet login failed.")
            }
        } finally {
            setLoading(false)
        }
    }, [connected, publicKey, signMessage, router])

    const renderActiveTab = () => {
        switch (activeTab) {
            case LoginTab.EMAIL:
                return (
                    <EmailTab
                        email={email}
                        setEmail={setEmail}
                        error={error}
                        loading={loading}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        password={password}
                        setPassword={setPassword}
                        handleEmailLogin={handleEmailLogin}
                    />
                )
            case LoginTab.PHONE:
                return (
                    <PhoneTab
                        phone={phone}
                        setPhone={setPhone}
                        error={error}
                        loading={loading}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        password={password}
                        setPassword={setPassword}
                        handlePhoneLogin={handlePhoneLogin}
                    />
                )
            case LoginTab.WALLET:
                return (
                    <WalletTab
                        error={error}
                        loading={loading}
                        handleWalletLogin={handleWalletLogin}
                    />
                )
            default:
                return null
        }
    }

    return (
        <div className="h-screen w-full flex flex-col bg-white">
            <div className="flex-1 flex flex-col px-6 pt-2 pb-6 mt-6">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <Link
                        href="/"
                        className="text-indigo-600"
                    >
                        <MdArrowBack className="h-6 w-6" />
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

                {/* Tab content */}
                {renderActiveTab()}

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