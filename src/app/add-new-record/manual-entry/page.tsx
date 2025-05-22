"use client"
import React, { useState } from 'react';
import { FaPaperclip } from 'react-icons/fa';
import { ArrowLeft, Search, Settings } from 'lucide-react';
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import BottomNavigation from "@/components/navbar";
import {uploadHealthRecord, HealthRecordResponse, getCurrentUser, HealthRecordInput} from '@/utils/api';
import axios from "axios";
import { sign } from 'tweetnacl';
import bs58 from 'bs58';

const HealthRecordForm = () => {
    const { connected, publicKey, signMessage } = useWallet();
    const [entryMode, setEntryMode] = useState<'upload' | 'manual'>('upload');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [apiResponse, setApiResponse] = useState<HealthRecordResponse | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [signature, setSignature] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0], // Current date
        doctorFacility: '',
        recordType: '',
        facility: '',
        notes: '',
    });

    // Function to authenticate user by signing a message
    const authenticateUser = async () => {
        if (!connected || !publicKey || !signMessage) {
            setErrorMessage("Wallet not connected or doesn't support message signing.");
            return;
        }

        try {
            setIsLoading(true);
            setErrorMessage(null);

            console.log("=== STARTING AUTHENTICATION ===");
            console.log("Wallet Address:", publicKey.toBase58());
            console.log("Wallet Connected:", connected);

            // Create a message to sign with timestamp for uniqueness
            const timestamp = Date.now();
            const message = `Authenticate health record access\nWallet: ${publicKey.toBase58()}\nTimestamp: ${timestamp}`;
            console.log("Authentication Message:", message);

            const messageBytes = new TextEncoder().encode(message);
            console.log("Message Bytes Length:", messageBytes.length);

            // Sign the message
            console.log("Requesting signature from wallet...");
            const messageSignature = await signMessage(messageBytes);
            console.log("Raw Signature Length:", messageSignature.length);

            const signatureBase58 = bs58.encode(messageSignature);
            console.log("Base58 Signature:", signatureBase58);

            // Verify the signature (optional client-side verification)
            console.log("Verifying signature...");
            const isValid = sign.detached.verify(
                messageBytes,
                messageSignature,
                publicKey.toBytes()
            );
            console.log("Signature Valid:", isValid);

            if (isValid) {
                setSignature(signatureBase58);
                setIsAuthenticated(true);
                setSuccessMessage("Authentication successful! You can now submit health records.");
                console.log("=== AUTHENTICATION SUCCESS ===");
            } else {
                setErrorMessage("Signature verification failed.");
                console.log("=== AUTHENTICATION FAILED ===");
            }
        } catch (error) {
            console.log("=== AUTHENTICATION ERROR ===");
            console.log("Error Type:", error?.constructor?.name);
            console.log("Error Message:", error instanceof Error ? error.message : "Unknown error");
            console.log("Full Error:", error);
            setErrorMessage("Failed to authenticate. Please try again.");
        } finally {
            setIsLoading(false);
            console.log("=== AUTHENTICATION PROCESS COMPLETE ===");
        }
    };

    // Function to sign health record data
    const signHealthRecord = async (recordData: any) => {
        if (!connected || !publicKey || !signMessage) {
            throw new Error("Wallet not connected or doesn't support message signing.");
        }

        try {
            // Create a deterministic string from the record data
            const dataString = JSON.stringify({
                date: recordData.date,
                doctor: recordData.doctor,
                category: recordData.category,
                facility: recordData.facility,
                notes: recordData.notes,
                timestamp: Date.now()
            });

            const messageBytes = new TextEncoder().encode(dataString);
            const messageSignature = await signMessage(messageBytes);
            const signatureBase58 = bs58.encode(messageSignature);

            return {
                signature: signatureBase58,
                message: dataString,
                publicKey: publicKey.toBase58()
            };
        } catch (error) {
            console.error("Error signing health record:", error);
            throw error;
        }
    };

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

        if (!isAuthenticated) {
            setErrorMessage("Please authenticate first by signing the authentication message.");
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

            // Sign the health record data
            const recordSignature = await signHealthRecord({
                date: formData.date,
                doctor: formData.doctorFacility,
                category: formData.recordType,
                facility: formData.facility,
                notes: formData.notes
            });

            const healthRecordData: HealthRecordInput = {
                file: selectedFile || undefined,
                date: formData.date,
                doctor: formData.doctorFacility,
                category: formData.recordType,
                facility: formData.facility,
                notes: formData.notes,
                userId: currentUser.id.toString(),
                publicKey: walletAddress,
                // Add signature data
                recordSignature: recordSignature.signature,
                signedMessage: recordSignature.message,
                authSignature: signature // Include authentication signature
            };

            console.log("=== SUBMITTING DATA TO BACKEND ===");
            console.log("Health Record Data:", healthRecordData);
            console.log("Record Signature:", recordSignature.signature);
            console.log("Auth Signature:", signature);
            console.log("Timestamp:", new Date().toISOString());

            const result = await uploadHealthRecord(healthRecordData);

            console.log("=== BACKEND RESPONSE RECEIVED ===");
            console.log("Response Type:", typeof result);
            console.log("Full Response Object:", result);
            console.log("Response Keys:", Object.keys(result || {}));

            // // Log specific fields
            // if (result) {
            //     console.log("- Record ID:", result?.recordId || 'Not provided');
            //     console.log("- Message:", result?.message || 'Not provided');
            //     console.log("- Transaction Hash:", result?.txHash || 'Not provided');
            //     console.log("- Status:", result?.status || 'Not provided');
            //     console.log("- Success:", result?.success || 'Not provided');
            //     console.log("- Timestamp:", result?.timestamp || 'Not provided');
            //     console.log("- User ID:", result?.userId || 'Not provided');
            //     console.log("- Public Key:", result?.publicKey || 'Not provided');
            //
            //     // Log any additional fields
            //     const knownFields = ['recordId', 'message', 'txHash', 'status', 'success', 'timestamp', 'userId', 'publicKey'];
            //     const additionalFields = Object.keys(result).filter(key => !knownFields.includes(key));
            //     if (additionalFields.length > 0) {
            //         console.log("- Additional Fields:", additionalFields.reduce((obj, key) => {
            //             obj[key] = result[key];
            //             return obj;
            //         }, {}));
            //     }
            // }

            console.log("=== RESPONSE PROCESSING COMPLETE ===");

            setApiResponse(result);
            setSuccessMessage("Health record uploaded and verified successfully!");

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
            console.log("=== ERROR OCCURRED ===");
            console.log("Error Type:", error?.constructor?.name);
            console.log("Error Message:", error instanceof Error ? error.message : "Unknown error");
            console.log("Error Stack:", error instanceof Error ? error.stack : "No stack trace");
            console.log("Full Error Object:", error);
            console.log("Error Time:", new Date().toISOString());

            if (axios.isAxiosError(error)) {
                console.log("=== AXIOS ERROR DETAILS ===");
                console.log("- Request URL:", error.config?.url);
                console.log("- Request Method:", error.config?.method?.toUpperCase());
                console.log("- Request Headers:", error.config?.headers);
                console.log("- Request Data:", error.config?.data);
                console.log("- Status Code:", error.response?.status);
                console.log("- Status Text:", error.response?.statusText);
                console.log("- Response Headers:", error.response?.headers);
                console.log("- Response Data:", error.response?.data);
                console.log("- Response Data Type:", typeof error.response?.data);

                if (error.response?.data) {
                    console.log("=== RESPONSE DATA BREAKDOWN ===");
                    const responseData = error.response.data;
                    console.log("Response Data Keys:", Object.keys(responseData));

                    // Log each field in response data
                    Object.keys(responseData).forEach(key => {
                        console.log(`- ${key}:`, responseData[key]);
                    });
                }

                if (error.response?.data?.recordId) {
                    console.log("=== FALLBACK SUCCESS RESPONSE ===");
                    const fallbackData = error.response.data as HealthRecordResponse;
                    console.log("Fallback Data:", fallbackData);
                    console.log("Using fallback response as success");
                    setApiResponse(fallbackData);
                    setSuccessMessage("Health record uploaded successfully (despite error status)");
                } else {
                    console.log("=== NO FALLBACK DATA AVAILABLE ===");
                    setErrorMessage(`Backend Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
                }
            } else {
                console.log("=== NON-AXIOS ERROR ===");
                console.log("This is not an HTTP request error");
                setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
            }

            console.log("=== ERROR HANDLING COMPLETE ===");
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
                        <h3 className="text-sm font-medium text-indigo-800 mb-2">Wallet Connection & Authentication</h3>
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

                                {/* Authentication Status */}
                                <div className={`flex items-center gap-2 ${isAuthenticated ? 'text-green-600' : 'text-orange-600'}`}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        {isAuthenticated ? (
                                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                                        ) : (
                                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                                        )}
                                        {isAuthenticated && <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>}
                                    </svg>
                                    <span className="text-sm font-medium">
                                        {isAuthenticated ? 'Authenticated' : 'Authentication Required'}
                                    </span>
                                </div>

                                <div className="bg-white rounded p-2 border">
                                    <p className="text-xs text-gray-500 mb-1">Public Key:</p>
                                    <p className="text-xs font-mono text-gray-800 break-all">
                                        {publicKey?.toBase58()}
                                    </p>
                                </div>

                                {!isAuthenticated && (
                                    <button
                                        onClick={authenticateUser}
                                        disabled={isLoading}
                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg text-sm font-medium disabled:opacity-50"
                                    >
                                        {isLoading ? 'Authenticating...' : 'Sign Message to Authenticate'}
                                    </button>
                                )}

                                {/*<WalletMultiButton className="w-full" />*/}
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

                    {/* Show signature info when authenticated */}
                    {isAuthenticated && signature && (
                        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded relative mb-4">
                            <h4 className="font-medium mb-1">Authentication Verified</h4>
                            <p className="text-xs font-mono break-all">Signature: {signature.substring(0, 32)}...</p>
                        </div>
                    )}

                    {/*/!* API Response Display *!/*/}
                    {/*{apiResponse && (*/}
                    {/*    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded relative mb-4">*/}
                    {/*        <h3 className="font-bold mb-2 flex items-center gap-2">*/}
                    {/*            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                    {/*                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" fill="none"/>*/}
                    {/*                <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>*/}
                    {/*            </svg>*/}
                    {/*            Backend Response:*/}
                    {/*        </h3>*/}
                    {/*        <div className="bg-green-100 p-3 rounded text-xs">*/}
                    {/*            <div className="mb-2">*/}
                    {/*                <strong>Record ID:</strong> {apiResponse.recordId || 'N/A'}*/}
                    {/*            </div>*/}
                                {/*{apiResponse.message && (*/}
                                {/*    <div className="mb-2">*/}
                                {/*        <strong>Message:</strong> {apiResponse.message}*/}
                                {/*    </div>*/}
                                {/*)}*/}
                                {/*{apiResponse.txHash && (*/}
                                {/*    <div className="mb-2">*/}
                                {/*        <strong>Transaction Hash:</strong>*/}
                                {/*        <span className="font-mono block mt-1 break-all">{apiResponse.txHash}</span>*/}
                                {/*    </div>*/}
                                {/*)}*/}
                                {/*{apiResponse.timestamp && (*/}
                                {/*    <div className="mb-2">*/}
                                {/*        <strong>Timestamp:</strong> {new Date(apiResponse.timestamp).toLocaleString()}*/}
                                {/*    </div>*/}
                                {/*)}*/}
                    {/*            <details className="mt-3">*/}
                    {/*                <summary className="cursor-pointer font-medium text-green-700 hover:text-green-800">*/}
                    {/*                    View Full Response (JSON)*/}
                    {/*                </summary>*/}
                    {/*                <pre className="text-xs overflow-auto max-h-40 bg-white p-2 rounded mt-2 border">*/}
                    {/*                    {JSON.stringify(apiResponse, null, 2)}*/}
                    {/*                </pre>*/}
                    {/*            </details>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*)}*/}

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
                                setIsAuthenticated(false);
                                setSignature(null);
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !connected || !isAuthenticated}
                            className={`w-full py-3 rounded-full ${
                                isLoading || !connected || !isAuthenticated ? 'bg-gray-400' : 'bg-indigo-600'
                            } text-white font-semibold`}
                        >
                            {isLoading ? 'Saving...' :
                                !connected ? 'Connect Wallet First' :
                                    !isAuthenticated ? 'Authenticate First' : 'Save Record'}
                        </button>
                    </div>
                </form>

                <BottomNavigation />
            </div>
        </div>
    );
};

export default HealthRecordForm;