"use client"
import React, { useState } from 'react';
import { FaPaperclip } from 'react-icons/fa';
import { ArrowLeft, Search, Settings} from 'lucide-react';
import BottomNavigation from "@/components/navbar";

const HealthRecordForm = () => {
    const [entryMode, setEntryMode] = useState<'upload' | 'manual'>('upload');
    // const [, setSelectedFile] = useState<File | null>(null);
    const [formData] = useState({
        date: '01/02/2025',
        doctorFacility: 'Dr. Thomas Johnson',
        recordType: 'General Check-up',
        notes: 'Addition notes',
    });

    // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.files && e.target.files.length > 0) {
    //         setSelectedFile(e.target.files[0]);
    //     }
    // };
    //
    // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { name, value } = e.target;
    //     setFormData({
    //         ...formData,
    //         [name]: value,
    //     });
    // };

    return (
        <div className="min-h-screen bg-gray-800 flex justify-center">
            <div className="w-full max-w-md bg-white flex flex-col">
                {/* Status Bar */}
                <div className="bg-gray-200 p-2 px-4 flex justify-between items-center">
                    <span className="font-semibold">16:04</span>
                    <div className="flex items-center space-x-2">
                        <span>●●●</span>
                        <span>📶</span>
                        <span>🔋</span>
                    </div>
                </div>

                {/* Header */}
                <div className="p-4 flex items-center justify-between">
                    <button className="text-indigo-600">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold text-indigo-600 text-center flex-grow">Add New Record</h1>
                    <div className="flex space-x-2">
                        <button className="bg-indigo-100 rounded-full p-2 text-indigo-600">
                            <Search size={20} />
                        </button>
                        <button className="bg-indigo-100 rounded-full p-2 text-indigo-600">
                            <Settings size={20} />
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-grow overflow-auto px-4 pb-4">
                    {/* Tabs */}
                    <div className="flex mb-4">
                        <button
                            className={`flex-1 py-3 rounded-l-lg ${
                                entryMode === 'upload'
                                    ? 'bg-indigo-100 text-indigo-700 font-semibold'
                                    : 'bg-white text-gray-700'
                            } border border-indigo-200`}
                            onClick={() => setEntryMode('upload')}
                        >
                            Upload Image
                        </button>
                        <button
                            className={`flex-1 py-3 rounded-r-lg ${
                                entryMode === 'manual'
                                    ? 'bg-indigo-100 text-indigo-700 font-semibold'
                                    : 'bg-white text-gray-700'
                            } border border-indigo-200`}
                            onClick={() => setEntryMode('manual')}
                        >
                            Manual Entry
                        </button>
                    </div>

                    {entryMode === 'upload' && (
                        <div>
                            {/* Upload Image Area */}
                            <div className="w-full border border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center bg-white mb-6">
                                <div className="w-12 h-12 flex items-center justify-center mb-4">
                                    <div className="w-16 h-16 relative">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="4" y="4" width="16" height="16" rx="2" stroke="black" strokeWidth="2"/>
                                                <circle cx="8.5" cy="8.5" r="1.5" fill="black"/>
                                                <path d="M5 19L10 14L12 16L19 9" stroke="black" strokeWidth="2"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-lg text-gray-700 mb-6">Upload an image of your health record</p>
                                <div className="flex w-full gap-4">
                                    <button className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg">
                                        Upload from Gallery
                                    </button>
                                    <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg border border-gray-300">
                                        Take a Photo
                                    </button>
                                </div>
                            </div>

                            {/* Nearby Medical Facilities Section */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Nearby Medical Facilities</h2>
                                <p className="text-gray-500 mb-4">You can edit the extracted information if needed</p>

                                <div className="bg-white rounded-lg p-4 border border-gray-200 overflow-hidden">
                                    <div className="border-b border-gray-200 py-3 flex">
                                        <div className="text-gray-500 w-1/3">Date</div>
                                        <div className="text-gray-800 w-2/3">{formData.date}</div>
                                    </div>
                                    <div className="border-b border-gray-200 py-3 flex">
                                        <div className="text-gray-500 w-1/3">Doctor/ Facility</div>
                                        <div className="text-gray-800 w-2/3">{formData.doctorFacility}</div>
                                    </div>
                                    <div className="border-b border-gray-200 py-3 flex">
                                        <div className="text-gray-500 w-1/3">Record Type</div>
                                        <div className="text-gray-800 w-2/3">{formData.recordType}</div>
                                    </div>
                                    <div className="py-3 flex">
                                        <div className="text-gray-500 w-1/3">Notes</div>
                                        <div className="text-gray-800 w-2/3">{formData.notes}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Manual Entry Form Fields */}
                    {entryMode === 'manual' && (
                        <div className="space-y-4">
                            {/* Record Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Record Type</label>
                                <select
                                    className="w-full mt-1 px-4 py-3 border-none rounded-full bg-indigo-50 text-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500">
                                    <option>Select record type</option>
                                    <option>General Check-up</option>
                                    <option>Lab Result</option>
                                    <option>Prescription</option>
                                </select>
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date</label>
                                <input
                                    type="date"
                                    className="w-full mt-1 px-4 py-3 border-none rounded-full bg-indigo-50 text-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                                    placeholder="dd/mm/yyyy"
                                />
                            </div>

                            {/* Doctor's Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Doctor's Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your doctor's name"
                                    className="w-full mt-1 px-4 py-3 border-none rounded-full bg-indigo-50 text-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Note */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Note (optional)</label>
                                <textarea
                                    rows={3}
                                    placeholder="Add any additional information"
                                    className="w-full mt-1 px-4 py-3 border-none rounded-2xl bg-indigo-50 text-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Attachment */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Attachment (optional)</label>
                                <label
                                    className="flex items-center justify-center gap-2 mt-2 px-4 py-3 border-2 border-dotted border-indigo-200 rounded-full bg-indigo-50 text-sm text-indigo-600 cursor-pointer">
                                    <FaPaperclip/> Add file attachment
                                    <input type="file" hidden/>
                                </label>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="p-4 space-y-3">
                    <button className="w-full py-3 rounded-full border border-indigo-600 text-indigo-600 font-semibold">
                        Cancel
                    </button>
                    <button className="w-full py-3 rounded-full bg-indigo-600 text-white font-semibold">
                        Save
                    </button>
                </div>


                <BottomNavigation />
            </div>
        </div>
    );
};

export default HealthRecordForm;