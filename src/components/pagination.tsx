"use client";

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PageHeaderProps {
    title: string;
    showBackButton?: boolean;
    onBackClick?: () => void;
    rightElement?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
                                                   title,
                                                   showBackButton = true,
                                                   onBackClick,
                                                   rightElement
                                               }) => {
    const router = useRouter();

    const handleBackClick = () => {
        if (onBackClick) {
            onBackClick();
        } else {
            router.back();
        }
    };

    return (
        <div className="flex items-center justify-between py-4 px-4 border-b border-gray-100">
            <div className="flex items-center">
                {showBackButton && (
                    <button
                        onClick={handleBackClick}
                        className="mr-3 p-1 rounded-full hover:bg-gray-100"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-700" />
                    </button>
                )}
                <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
            </div>
            {rightElement && (
                <div>{rightElement}</div>
            )}
        </div>
    );
};

export default PageHeader;