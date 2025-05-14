import React from 'react';
import Link from 'next/link';
import { Home, Calendar, FileText, User, Settings } from 'lucide-react';

interface BottomNavigationProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'home', name: 'Home', icon: Home, path: '/home' },
        { id: 'appointments', name: 'Appointments', icon: Calendar, path: '/appointments' },
        { id: 'records', name: 'Records', icon: FileText, path: '/records' },
        { id: 'profile', name: 'Profile', icon: User, path: '/profile' },
        { id: 'settings', name: 'Settings', icon: Settings, path: '/settings' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
            <div className="max-w-md mx-auto">
                <div className="flex justify-between">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.id}
                            href={tab.path}
                            className="flex-1"
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <div className={`flex flex-col items-center py-2 ${
                                activeTab === tab.id ? 'text-blue-600' : 'text-gray-500'
                            }`}>
                                <tab.icon size={22} />
                                <span className="text-xs mt-1">{tab.name}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default BottomNavigation;