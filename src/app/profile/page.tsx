import React from 'react';
import {
    UserCircle,
    Heart,
    Wallet,
    Lock,
    Settings,
    HelpCircle,
    LogOut,
    Home,
    Headphones,
    User,
    ClipboardList
} from 'lucide-react';
import Image from 'next/image';
import BottomNavigation from "@/components/navbar";

const ProfilePage: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[#f5f5fa] items-center ">
            {/* Content Container */}
            <div className="bg-white w-full  overflow-hidden">
                {/* Header with Back Button and Title */}
                <div className="p-4 flex items-center">
                    <button className="text-[#6C4FF7] mr-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2"
                                  strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <h2 className="text-[#6C4FF7] text-xl font-bold">My Profile</h2>
                </div>

                {/* Profile Picture */}
                <div className="flex flex-col items-center mt-2 mb-6">
                    <div className="relative">
                        <Image
                            src="/avatar-placeholder.jpg" // đổi bằng avatar thực tế
                            alt="Profile"
                            width={96}
                            height={96}
                            className="rounded-full object-cover"
                        />
                        <button className="absolute bottom-0 right-0 bg-[#6C4FF7] rounded-full p-1">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M11 4H4C3.47 4 2.96 4.21 2.59 4.59C2.21 4.96 2 5.47 2 6V20C2 20.53 2.21 21.04 2.59 21.41C2.96 21.79 3.47 22 4 22H18C18.53 22 19.04 21.79 19.41 21.41C19.79 21.04 20 20.53 20 20V13"
                                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path
                                    d="M18.5 2.5C18.9 2.1 19.44 1.88 20 1.88C20.56 1.88 21.1 2.1 21.5 2.5C21.9 2.9 22.12 3.44 22.12 4C22.12 4.56 21.9 5.1 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
                                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    <h3 className="text-xl font-semibold mt-4">John Doe</h3>
                </div>

                {/* Menu */}
                <div className="px-6 space-y-3 pb-6">
                    <MenuItem icon={<UserCircle />} label="Profile"/>
                    <MenuItem icon={<Heart />} label="Medical Records"/>
                    <MenuItem icon={<Wallet />} label="Wallet"/>
                    <MenuItem icon={<Lock />} label="Privacy Policy"/>
                    <MenuItem icon={<Settings />} label="Settings"/>
                    <MenuItem icon={<HelpCircle />} label="Help"/>
                    <MenuItem icon={<LogOut />} label="Logout"/>
                </div>
            </div>

            <BottomNavigation />
        </div>
    );
};

interface MenuItemProps {
    icon: React.ReactNode;
    label: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label }) => {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
            <div className="flex items-center space-x-4">
                <div className="bg-[#EEF0FF] p-2 rounded-full text-[#6C4FF7]">
                    {icon}
                </div>
                <span className="text-black text-base">{label}</span>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round"/>
            </svg>
        </div>
    );
};

export default ProfilePage;
