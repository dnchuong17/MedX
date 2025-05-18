'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import {verifyOtp} from "@/utils/api";

export default function VerifyPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get('email') || '';
    const [otp, setOtp] = useState('');

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const isVerified = await verifyOtp({ email, otp });
            if (isVerified) {
                alert("Verify Successfully! You can login now.");
                router.push('/auth/login');
            } else {
                alert("OTP code is incorrect or expired.");
            }
        } catch (err: any) {
            alert(`Unauthorized: ${err}`);
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4 text-indigo-700">Xác thực Email</h1>
            <form onSubmit={handleVerify} className="space-y-4">
                <p className="text-gray-600">We've sent an OTP code to: <strong>{email}</strong></p>
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-3 border rounded"
                    placeholder="Enter OTP"
                    required
                />
                <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded">
                    Xác thực
                </button>
            </form>
        </div>
    );
}
