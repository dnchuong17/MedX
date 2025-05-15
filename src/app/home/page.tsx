"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bell, Settings, User, MessageCircle, Users, Clock } from 'lucide-react';

interface HealthMetric {
    title: string;
    value: string | number;
    description: string;
}

interface Challenge {
    id: string;
    title: string;
    progress: number;
    description: string;
    icon: React.ReactNode;
}

const HomePage = () => {
    const healthMetrics: HealthMetric[] = [
        { title: 'BMI Index', value: '23.5', description: 'Normal' },
        { title: 'Heart Rate', value: '72', description: 'Average BPM today' },
        { title: 'Activity Streak', value: '7', description: 'Consecutive active days' },
        { title: 'Weight Loss', value: '3.2/5', description: 'KG lost/goal' },
    ];

    const challenges: Challenge[] = [
        {
            id: '1',
            title: '10K Steps Challenge',
            progress: 70,
            description: '7,533/10,000 steps today',
            icon: <Clock className="h-5 w-5 text-indigo-500" />,
        },
        {
            id: '2',
            title: 'Drink Enough Water Challenge (30 days)',
            progress: 40,
            description: '1.2/3.0 liters today • Day 18/30',
            icon: <Clock className="h-5 w-5 text-blue-500" />,
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Header */}
            <header className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                        <Image
                            src="/api/placeholder/40/40"
                            alt="Profile"
                            width={40}
                            height={40}
                        />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Hi, Welcome Back</p>
                        <p className="text-sm font-semibold text-blue-600">John Doe</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <Bell className="h-6 w-6 text-gray-500" />
                    <Settings className="h-6 w-6 text-gray-500" />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 px-4 pb-20">
                {/* Health Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {healthMetrics.map((metric, index) => (
                        <div
                            key={index}
                            className="bg-gray-100 rounded-lg p-4"
                        >
                            <h3 className="text-sm text-gray-800 font-medium">{metric.title}</h3>
                            <p className="text-2xl font-bold text-indigo-600">{metric.value}</p>
                            <p className="text-xs text-gray-500">{metric.description}</p>
                        </div>
                    ))}
                </div>

                {/* Health News */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="font-semibold text-gray-800">Today's Health News</h2>
                        <Link href="#" className="text-xs text-gray-500">See All</Link>
                    </div>
                    <div className="bg-gray-100 rounded-lg overflow-hidden">
                        <div className="h-40 w-full relative">
                            <Image
                                src="/api/placeholder/400/160"
                                alt="Healthy Foods"
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="font-medium text-sm">7 Foods That Help Boost Immunity in Winter</h3>
                            <p className="text-xs text-gray-500 mt-1">
                                These foods are not only tasty but also help your body fight off common winter diseases.
                            </p>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-blue-600">Nutrition</span>
                                <span className="text-xs text-gray-400">5 hours ago</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Current Challenges */}
                <div className="mb-6">
                    <h2 className="font-semibold text-gray-800 mb-2">Current Challenges</h2>
                    <div className="space-y-3">
                        {challenges.map((challenge) => (
                            <div
                                key={challenge.id}
                                className="bg-gray-100 rounded-lg p-3"
                            >
                                <div className="flex space-x-3 items-center mb-2">
                                    {challenge.icon}
                                    <div>
                                        <h3 className="text-sm font-medium">{challenge.title}</h3>
                                        <p className="text-xs text-gray-500">{challenge.description}</p>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-300 rounded-full h-1.5">
                                    <div
                                        className="bg-blue-600 h-1.5 rounded-full"
                                        style={{ width: `${challenge.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Access */}
                <div>
                    <h2 className="font-semibold text-gray-800 mb-2">Quick Access</h2>
                    <div className="grid grid-cols-3 gap-2">
                        <Link href="/profile" className="flex flex-col items-center justify-center bg-gray-100 rounded-lg py-4">
                            <div className="bg-gray-200 p-2 rounded-full mb-1">
                                <User className="h-5 w-5 text-gray-600" />
                            </div>
                            <span className="text-xs">Profile</span>
                        </Link>
                        <Link href="/chatbot" className="flex flex-col items-center justify-center bg-gray-100 rounded-lg py-4">
                            <div className="bg-gray-200 p-2 rounded-full mb-1">
                                <MessageCircle className="h-5 w-5 text-gray-600" />
                            </div>
                            <span className="text-xs">Chatbot</span>
                        </Link>
                        <Link href="/community" className="flex flex-col items-center justify-center bg-gray-100 rounded-lg py-4">
                            <div className="bg-gray-200 p-2 rounded-full mb-1">
                                <Users className="h-5 w-5 text-gray-600" />
                            </div>
                            <span className="text-xs">Community</span>
                        </Link>
                    </div>
                </div>
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-indigo-700 px-4 py-2 flex justify-around">
                <button className="flex-1 flex items-center justify-center p-1 text-white">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-6 h-6"
                    >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    </svg>
                </button>
                <button className="flex-1 flex items-center justify-center p-1">
                    <User className="h-6 w-6 text-white opacity-70" />
                </button>
                <button className="flex-1 flex items-center justify-center p-1">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-6 h-6 text-white opacity-70"
                    >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                </button>
            </nav>
        </div>
    );
};

export default HomePage;