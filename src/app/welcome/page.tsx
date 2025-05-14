'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MedicalFolderIcon from "@/components/medical-folder-icon";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate login process
        setTimeout(() => {
            setIsLoading(false);
            router.push('/auth/login');
        }, 1500);
    };

    return (
        <main
            className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-indigo-100 via-blue-200 to-indigo-200 p-4">
            <div className="w-full max-w-md flex flex-col items-center justify-center space-y-12">
                {/* Logo and Title */}
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 relative">
                        <div className="absolute inset-0 bg-indigo-700 rounded-tl-lg rounded-tr-lg rounded-br-lg"></div>
                        <div className="absolute inset-0 bg-indigo-500 rounded-tl-lg rounded-tr-lg rounded-br-lg ml-2 mt-2"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <MedicalFolderIcon />

                        </div>
                    </div>
                    <h1 className="text-indigo-800 text-5xl font-bold mt-6">MedX</h1>
                    <p className="text-gray-600 mt-2">A decentralized healthcare platform</p>
                </div>

                {/* Buttons */}
                <div className="w-full space-y-4">
                    <button
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="w-full py-3 bg-indigo-600 text-white rounded-full font-medium tracking-wide transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
                    >
                        {isLoading ? 'Logging in...' : 'Log In'}
                    </button>

                    <Link href="/auth/register">
                        <div className="w-full py-3 bg-blue-100 text-indigo-700 rounded-full font-medium tracking-wide text-center transition-colors hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            Sign Up
                        </div>
                    </Link>
                </div>
            </div>
        </main>
    );
}