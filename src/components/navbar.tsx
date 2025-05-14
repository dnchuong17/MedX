"use client";

import React from 'react';
import { Home, User, Calendar } from 'lucide-react';
import Link from 'next/link';

interface BottomNavigationProps {
    activeItem?: 'home' | 'profile' | 'calendar';
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeItem = 'home' }) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-indigo-700 px-4 py-2 flex justify-around">
            <Link
                href="/"
                className={`flex-1 flex flex-col items-center justify-center p-1 ${activeItem === 'home' ? 'text-white' : 'text-white/70'}`}
            >
                <Home className="w-6 h-6" />
            </Link>
            <Link
                href="/profile"
                className={`flex-1 flex flex-col items-center justify-center p-1 ${activeItem === 'profile' ? 'text-white' : 'text-white/70'}`}
            >
                <User className="h-6 w-6" />
            </Link>
            <Link
                href="/calendar"
                className={`flex-1 flex flex-col items-center justify-center p-1 ${activeItem === 'calendar' ? 'text-white' : 'text-white/70'}`}
            >
                <Calendar className="w-6 h-6" />
            </Link>
        </nav>
    );
};

export default BottomNavigation;