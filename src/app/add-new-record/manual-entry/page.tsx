"use client"
import React, { useState } from 'react';
import { FaPaperclip } from 'react-icons/fa';
import { ArrowLeft, Search, Settings } from 'lucide-react';
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import BottomNavigation from "@/components/navbar";
import { uploadHealthRecord, HealthRecordResponse, getCurrentUser } from '@/utils/api';

const HealthRecordForm = () => {
    const { connected, publicKey } = useWallet();
    const [entryMode, setEntryMode] = useState<'upload' | 'manual'>('upload');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [apiResponse, setApiResponse] = useState<HealthRecordResponse | null>(null);

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0], // Current date
        doctorFacility: '',
        recordType: '',
        facility: '',
        notes: '',
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);
        setApiResponse(null);

        if (!connected || !publicKey) {
            setErrorMessage("Please connect your wallet first.");
            setIsLoading(false);
            return;
        }

        if (!formData.doctorFacility || !formData.recordType || !formData.facility) {
            setErrorMessage("Please fill in all required fields.");
            setIsLoading(false);
            return;
        }

        try {
            const walletAddress = publicKey.toBase58();
            const currentUser = await getCurrentUser();

            if (!currentUser?.id) {
                setErrorMessage("User session expired. Please login again.");
                setIsLoading(false);
                return;
            }

            const healthRecordData: HealthRecordInput = {
                file: selectedFile || undefined,
                date: formData.date,
                doctor: formData.doctorFacility,
                category: formData.recordType,
                facility: formData.facility,
                notes: formData.notes,
                userId: currentUser.id.toString(),
                publicKey: walletAddress,
            };

            console.log("Submitting data:", healthRecordData);

            const result = await uploadHealthRecord(healthRecordData);
            console.log("Upload result:", result);

            setApiResponse(result);
            setSuccessMessage("Health record uploaded successfully!");

            setFormData({
                date: new Date().toISOString().split("T")[0],
                doctorFacility: "",
                recordType: "",
                facility: "",
                notes: "",
            });
            setSelectedImage(null);
            setSelectedFile(null);
        } catch (error) {
            console.error("Error during form submit:", error);

            if (axios.isAxiosError(error) && error.response?.data?.recordId) {
                const fallbackData = error.response.data as HealthRecordResponse;
                setApiResponse(fallbackData);
                setSuccessMessage("Health record uploaded successfully (despite error status)");
            } else {
                setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-800 flex justify-center">
            <div className="w-full max-w-md bg-white flex flex-col">

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

                {/* Wallet Connection Section */}
                <div className="px-4 mb-4">
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-indigo-800 mb-2">Wallet Connection</h3>
                        {!connected ? (
                            <div className="space-y-2">
                                <p className="text-sm text-indigo-600">Connect your wallet to upload health records</p>
                                <WalletMultiButton className="w-full" />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-green-600">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                                        <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span className="text-sm font-medium">Wallet Connected</span>
                                </div>
                                <div className="bg-white rounded p-2 border">
                                    <p className="text-xs text-gray-500 mb-1">Public Key:</p>
                                    <p className="text-xs font-mono text-gray-800 break-all">
                                        {publicKey?.toBase58()}
                                    </p>
                                </div>
                                <WalletMultiButton className="w-full" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content - Form */}
                <form onSubmit={handleSubmit} className="flex-grow overflow-auto px-4 pb-4">
                    {/* Success/Error Messages */}
                    {successMessage && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                            {successMessage}
                        </div>
                    )}

                    {errorMessage && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                            {errorMessage}
                        </div>
                    )}

                    {/* API Response (if available) */}
                    {apiResponse && (
                        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded relative mb-4">
                            <h3 className="font-bold mb-2">API Response:</h3>
                            <pre className="text-xs overflow-auto max-h-40 bg-blue-100 p-2 rounded">
                                {JSON.stringify(apiResponse, null, 2)}
                            </pre>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex mb-4">
                        <button
                            type="button"
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
                            type="button"
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
                            <div
                                className="w-full border border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center bg-white mb-6">
                                <div className="w-12 h-12 flex items-center justify-center mb-4">
                                    <div className="w-16 h-16 relative">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                                                <rect x="4" y="4" width="16" height="16" rx="2" stroke="black"
                                                      strokeWidth="2"/>
                                                <circle cx="8.5" cy="8.5" r="1.5" fill="black"/>
                                                <path d="M5 19L10 14L12 16L19 9" stroke="black" strokeWidth="2"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-lg text-gray-700 mb-6 text-center">Upload an image of your health
                                    record</p>

                                <div className="flex w-full gap-4">
                                    <label
                                        className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg text-center cursor-pointer">
                                        Upload from Gallery
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                    <label
                                        className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg border border-gray-300 text-center cursor-pointer">
                                        Take a Photo
                                        <input
                                            type="file"
                                            accept="image/*"
                                            capture="environment"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                {selectedImage && (
                                    <div className="mt-4 w-full">
                                        <img
                                            src={selectedImage}
                                            alt="Selected"
                                            className="w-full rounded-lg border border-gray-300"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Form Fields */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Record Information</h2>
                                <p className="text-gray-500 mb-4">Fill in the health record details</p>

                                <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-4">
                                    {/* Date */}
                                    <div>
                                        <label className="text-gray-500 block mb-1">Date *</label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800"
                                            required
                                        />
                                    </div>

                                    {/* Doctor */}
                                    <div>
                                        <label className="text-gray-500 block mb-1">Doctor *</label>
                                        <input
                                            type="text"
                                            name="doctorFacility"
                                            value={formData.doctorFacility}
                                            onChange={handleInputChange}
                                            placeholder="Enter doctor's name"
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800"
                                            required
                                        />
                                    </div>

                                    {/* Facility */}
                                    <div>
                                        <label className="text-gray-500 block mb-1">Facility *</label>
                                        <input
                                            type="text"
                                            name="facility"
                                            value={formData.facility}
                                            onChange={handleInputChange}
                                            placeholder="Enter facility name"
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800"
                                            required
                                        />
                                    </div>

                                    {/* Record Type - Dropdown */}
                                    <div>
                                        <label className="text-gray-500 block mb-1">Record Type *</label>
                                        <select
                                            name="recordType"
                                            value={formData.recordType}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800"
                                            required
                                        >
                                            <option value="">Select record type</option>
                                            <option value="General Check-up">General Check-up</option>
                                            <option value="Lab Result">Lab Result</option>
                                            <option value="Prescription">Prescription</option>
                                            <option value="Immunization">Immunization</option>
                                            <option value="X-Ray">X-Ray</option>
                                            <option value="Blood Test">Blood Test</option>
                                        </select>
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <label className="text-gray-500 block mb-1">Notes</label>
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleInputChange}
                                            placeholder="Add any additional notes"
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800"
                                            rows={3}
                                        />
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
                                <label className="block text-sm font-medium text-gray-700">Record Type *</label>
                                <select
                                    name="recordType"
                                    value={formData.recordType}
                                    onChange={handleInputChange}
                                    className="w-full mt-1 px-4 py-3 border-none rounded-full bg-indigo-50 text-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                                    required
                                >
                                    <option value="">Select record type</option>
                                    <option value="General Check-up">General Check-up</option>
                                    <option value="Lab Result">Lab Result</option>
                                    <option value="Prescription">Prescription</option>
                                    <option value="Immunization">Immunization</option>
                                    <option value="X-Ray">X-Ray</option>
                                    <option value="Blood Test">Blood Test</option>
                                </select>
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date *</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="w-full mt-1 px-4 py-3 border-none rounded-full bg-indigo-50 text-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            {/* Doctor's Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Doctor's Name *</label>
                                <input
                                    type="text"
                                    name="doctorFacility"
                                    value={formData.doctorFacility}
                                    onChange={handleInputChange}
                                    placeholder="Enter your doctor's name"
                                    className="w-full mt-1 px-4 py-3 border-none rounded-full bg-indigo-50 text-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            {/* Facility */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Facility *</label>
                                <input
                                    type="text"
                                    name="facility"
                                    value={formData.facility}
                                    onChange={handleInputChange}
                                    placeholder="Enter facility name"
                                    className="w-full mt-1 px-4 py-3 border-none rounded-full bg-indigo-50 text-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            {/* Note */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Note (optional)</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
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
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>

                                {selectedImage && (
                                    <div className="mt-4 w-full">
                                        <img
                                            src={selectedImage}
                                            alt="Selected"
                                            className="w-full rounded-lg border border-gray-300"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Footer Buttons */}
                    <div className="p-4 space-y-3 mt-4">
                        <button
                            type="button"
                            className="w-full py-3 rounded-full border border-indigo-600 text-indigo-600 font-semibold"
                            onClick={() => {
                                // Reset form
                                setFormData({
                                    date: new Date().toISOString().split('T')[0],
                                    doctorFacility: '',
                                    recordType: '',
                                    facility: '',
                                    notes: '',
                                });
                                setSelectedImage(null);
                                setSelectedFile(null);
                                setErrorMessage(null);
                                setSuccessMessage(null);
                                setApiResponse(null);
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !connected}
                            className={`w-full py-3 rounded-full ${
                                isLoading || !connected ? 'bg-gray-400' : 'bg-indigo-600'
                            } text-white font-semibold`}
                        >
                            {isLoading ? 'Saving...' : !connected ? 'Connect Wallet First' : 'Save'}
                        </button>
                    </div>
                </form>

                <BottomNavigation />
            </div>
        </div>
    );
};

export default HealthRecordForm;