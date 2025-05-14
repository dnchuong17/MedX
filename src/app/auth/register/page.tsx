"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

type RegisterMethod = "Email" | "Phone" | "Wallet";

const RegisterPage = () => {
    const router = useRouter();
    const [registerMethod, setRegisterMethod] = useState<RegisterMethod>("Email");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [step, setStep] = useState<"register" | "setPassword">("register");
    const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you'd handle the registration logic here
        // For now, we'll just move to the password step
        setStep("setPassword");
    };

    const handlePasswordCreation = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you'd handle the password creation and complete registration
        // Then redirect to a success page or login
        router.push("/auth/login");
    };

    const walletOptions = [
        { id: "phantom", name: "Phantom Wallet", icon: "🦊" },
        { id: "solflare", name: "Solflare", icon: "💎" },
        { id: "sollet", name: "Sollet", icon: "🔑" },
    ];

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
                    <h1 className="text-center flex-1 text-indigo-700 text-xl font-semibold">Set Password</h1>
                </div>

                <div className="p-6 flex-1">
                    <p className="text-gray-500 mb-6">
                        Create a secure password for your account to keep your information safe.
                    </p>

                    <form onSubmit={handlePasswordCreation} className="space-y-6">
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

                            <div className="mt-2">
                                <p className="text-sm text-gray-700 mb-1">Your password must contain at least:</p>
                                <div className="space-y-1">
                                    <div className="flex items-center">
                                        <div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center mr-2">
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        </div>
                                        <span className="text-sm">8-32 characters</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center mr-2">
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        </div>
                                        <span className="text-sm">1 lowercase (a-z) and 1 uppercase (A-Z)</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center mr-2">
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        </div>
                                        <span className="text-sm">1 number (1-9)</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center mr-2">
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        </div>
                                        <span className="text-sm">1 special character (e.g. @ # $ * !)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-gray-800 font-medium">Confirm Password</label>
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
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
        );
    }

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex items-center p-4">
                <Link href="/auth/login">
                    <button className="p-2">
                        <ArrowLeft size={20} />
                    </button>
                </Link>
                <h1 className="text-center flex-1 text-indigo-700 text-xl font-semibold">Log In</h1>
            </div>

            <div className="p-6">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Welcome</h2>
                    <p className="text-gray-600">Create a new account using your preferred method</p>
                </div>

                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        onClick={() => setRegisterMethod("Email")}
                        className={`flex-1 py-3 text-center ${
                            registerMethod === "Email"
                                ? "text-indigo-700 border-b-2 border-indigo-700 font-medium"
                                : "text-gray-500"
                        }`}
                    >
                        Email
                    </button>
                    <button
                        onClick={() => setRegisterMethod("Phone")}
                        className={`flex-1 py-3 text-center ${
                            registerMethod === "Phone"
                                ? "text-indigo-700 border-b-2 border-indigo-700 font-medium"
                                : "text-gray-500"
                        }`}
                    >
                        Phone
                    </button>
                    <button
                        onClick={() => setRegisterMethod("Wallet")}
                        className={`flex-1 py-3 text-center ${
                            registerMethod === "Wallet"
                                ? "text-indigo-700 border-b-2 border-indigo-700 font-medium"
                                : "text-gray-500"
                        }`}
                    >
                        Wallet
                    </button>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                    {registerMethod === "Wallet" ? (
                        <>
                            <div className="text-gray-800 font-medium mb-2">
                                Register with Solana Wallet
                            </div>
                            <p className="text-gray-600 text-sm mb-4">
                                Connect your Solana wallet to register a new account
                            </p>
                            <div className="space-y-3">
                                {walletOptions.map((wallet) => (
                                    <button
                                        key={wallet.id}
                                        type="button"
                                        onClick={() => setSelectedWallet(wallet.id)}
                                        className={`w-full p-4 flex items-center justify-between rounded-lg border ${
                                            selectedWallet === wallet.id
                                                ? "border-indigo-500 bg-indigo-50"
                                                : "border-gray-200"
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <span className="text-xl mr-2">{wallet.icon}</span>
                                            <span>{wallet.name}</span>
                                        </div>
                                        {selectedWallet === wallet.id && (
                                            <div className="w-4 h-4 rounded-full bg-indigo-600"></div>
                                        )}
                                    </button>
                                ))}
                            </div>
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
                                    <label className="text-gray-800 font-medium">Phone Number</label>
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
                        Log In
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-indigo-600 font-medium">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;