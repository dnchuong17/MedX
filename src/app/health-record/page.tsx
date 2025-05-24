"use client";
import { useState, useEffect } from "react";
import {
    ChevronLeft,
    Search,
    Settings,
    ChevronDown,
} from "lucide-react";
import BottomNavigation from "@/components/navbar";
import { useRouter } from "next/navigation";
import AddButton from "@/components/health-record/add.button";

import { getUserRecord } from "@/utils/api";

export interface UserRecord {
    url: string;
    versionOf: string | null;
    doctor: string;
    category: string;
    facility: string;
    date: string | null;
    notes: string;
}


interface UIRecord {
    id: number;
    title: string;
    date: string;
    doctor?: string;
    lab?: string;
    type: string;
    location: string;
    status: string;
    url?: string;
    notes?: string;
}

export default function HealthRecordsApp() {
    const [selectedRecords, setSelectedRecords] = useState<number[]>([]);
    const [filterOption, setFilterOption] = useState("all");
    const [sortOption, setSortOption] = useState("date-newest");
    const [filteredRecords, setFilteredRecords] = useState<UIRecord[]>([]);
    const [allRecords, setAllRecords] = useState<UIRecord[]>([]);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Transform API records to UI format
    const transformRecords = (apiRecords: UserRecord[]): UIRecord[] => {
        return apiRecords.map((record, index) => ({
            id: index + 1,
            title: record.category || "Health Record",
            date: record.date ? formatDate(record.date) : "N/A",
            doctor: record.doctor,
            type: record.category || "General",
            location: record.facility || "Unknown",
            status: record.versionOf ? "Updated" : "Shared", // Use versionOf to determine status
            url: record.url,
            notes: record.notes
        }));
    };

    // Format date from API to display format
    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
        } catch {
            return dateString;
        }
    };

    // Fetch user records from API using your existing functions
    const fetchUserRecords = async () => {
        try {
            setLoading(true);
            setError(null);

            // Use your existing API function - assuming it now returns UserRecord[]
            const apiRecords = await getUserRecord() as UserRecord[];

            // Transform records array to UI format
            const transformedRecords = transformRecords(apiRecords);
            setAllRecords(transformedRecords);

        } catch (err) {
            console.error("Error fetching user records:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch records");

        } finally {
            setLoading(false);
        }
    };



    const openRecord = (record: UIRecord) => {
        if (record.url) {
            try {
                let cleanUrl = record.url.trim();

                cleanUrl = cleanUrl.replace(/[\u200B-\u200D\uFEFF]/g, '');

                if (cleanUrl.includes('dweb.link/ipfs/')) {
                    console.log("Opening IPFS URL:", cleanUrl);
                    window.open(cleanUrl, '_blank', 'noopener,noreferrer');
                } else if (cleanUrl.includes('ipfs://')) {
                    const hash = cleanUrl.replace('ipfs://', '');
                    const gatewayUrl = `https://dweb.link/ipfs/${hash}`;
                    console.log("Converting IPFS URL:", gatewayUrl);
                    window.open(gatewayUrl, '_blank', 'noopener,noreferrer');
                } else {
                    const decodedUrl = decodeURIComponent(cleanUrl);
                    console.log("Opening decoded URL:", decodedUrl);
                    window.open(decodedUrl, '_blank', 'noopener,noreferrer');
                }
            } catch (error) {
                console.error("Error opening URL:", error);
                window.open(record.url, '_blank', 'noopener,noreferrer');
            }
        } else {
            console.warn("No URL available for this record");
        }
    };

    const toggleDropdown = (type: string) => {
        setOpenDropdown(openDropdown === type ? null : type);
    };

    const toggleSelectRecord = (id: number) => {
        setSelectedRecords((prev) =>
            prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedRecords.length === filteredRecords.length) {
            setSelectedRecords([]);
        } else {
            setSelectedRecords(filteredRecords.map((r) => r.id));
        }
    };

    const filterByType = (type: string) => {
        setFilterOption(type === "all" ? "all" : `type-${type}`);
        setOpenDropdown(null);
    };

    const filterByStatus = (status: string) => {
        setFilterOption(status === "all" ? "all" : `status-${status}`);
        setOpenDropdown(null);
    };

    const handleDateSort = (option: string) => {
        setSortOption(option);
        setOpenDropdown(null);
    };

    const handleClick = () => {
        router.push('/health-record/temporary-link');
    };

    const getUniqueCategories = () => {
        const categories = [...new Set(allRecords.map(r => r.type))];
        return categories.filter(Boolean);
    };

    useEffect(() => {
        fetchUserRecords();
    }, []);

    useEffect(() => {
        let filtered = [...allRecords];

        if (filterOption.startsWith("type-")) {
            const type = filterOption.slice(5);
            filtered = type === "all" ? filtered : filtered.filter((r) => r.type === type);
        } else if (filterOption.startsWith("status-")) {
            const status = filterOption.slice(7);
            filtered = status === "all" ? filtered : filtered.filter((r) => r.status === status);
        }

        filtered.sort((a, b) => {
            // Handle date sorting
            const parseDate = (dateStr: string) => {
                if (dateStr === "N/A") return new Date(0);
                const parts = dateStr.split("/");
                if (parts.length === 3) {
                    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
                }
                return new Date(dateStr);
            };

            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);

            return sortOption === "date-newest"
                ? dateB.getTime() - dateA.getTime()
                : dateA.getTime() - dateB.getTime();
        });

        setFilteredRecords(filtered);
        setSelectedRecords([]);
    }, [filterOption, sortOption, allRecords]);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading health records...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex justify-center p-4">
            <div className="bg-white w-full max-w-md overflow-hidden relative pb-20">

                {/* Header */}
                <div className="p-4 flex justify-between items-center">
                    <ChevronLeft className="text-indigo-600 w-6 h-6"/>
                    <h1 className="text-indigo-600 text-xl font-semibold">Health Record</h1>
                    <div className="flex space-x-2">
                        <button
                            onClick={fetchUserRecords}
                            className="bg-blue-100 rounded-full p-2"
                        >
                            <Search className="w-5 h-5 text-indigo-600"/>
                        </button>
                        <div className="bg-blue-100 rounded-full p-2">
                            <Settings className="w-5 h-5 text-indigo-600"/>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="px-4 mt-2">
                        <div className="bg-red-50 rounded-lg p-3 text-red-800 text-sm">
                            <p className="font-medium">Error loading records:</p>
                            <p>{error}</p>
                            <button
                                onClick={fetchUserRecords}
                                className="mt-2 text-red-600 font-medium underline"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

                {/* Filter Tags */}
                {filterOption !== "all" && (
                    <div className="px-4 mt-2">
                        <div className="bg-indigo-50 rounded-lg p-2 text-indigo-800 text-sm flex justify-between items-center">
                            <span>
                                Showing: {filterOption.startsWith("type-") ? `Type - ${filterOption.slice(5)}` : `Status - ${filterOption.slice(7)}`}
                            </span>
                            <button
                                onClick={() => setFilterOption("all")}
                                className="text-indigo-600 font-medium"
                            >
                                Show All
                            </button>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="px-4 mt-4 flex justify-between items-center">
                    <div className="flex space-x-2">
                        {[
                            {
                                label: "Date",
                                options: [
                                    {label: "Newest First", value: "date-newest"},
                                    {label: "Oldest First", value: "date-oldest"},
                                ],
                                handler: handleDateSort,
                                active: sortOption,
                            },
                            {
                                label: "Type",
                                options: [
                                    {label: "All Types", value: "all"},
                                    ...getUniqueCategories().map(cat => ({label: cat, value: cat}))
                                ],
                                handler: filterByType,
                                active: filterOption,
                                prefix: "type-",
                            },
                            {
                                label: "Status",
                                options: [
                                    {label: "All Status", value: "all"},
                                    {label: "Shared", value: "Shared"},
                                    {label: "Pending Verification", value: "Pending Verification"},
                                ],
                                handler: filterByStatus,
                                active: filterOption,
                                prefix: "status-",
                            },
                        ].map(({label, options, handler, active, prefix = ""}, i) => (
                            <div key={i} className="relative">
                                <button
                                    onClick={() => toggleDropdown(label)}
                                    className={`${(active.startsWith(prefix) && active !== `${prefix}all`) ? "bg-indigo-100" : "bg-gray-100"} hover:bg-gray-200 rounded-full px-3 py-1.5 text-sm flex items-center shadow-sm`}
                                >
                                    {label}
                                    <ChevronDown className="ml-1 w-4 h-4"/>
                                </button>
                                {openDropdown === label && (
                                    <div className="absolute z-10 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-40">
                                        {options.map(({label, value}) => (
                                            <button
                                                key={value}
                                                onClick={() => handler(value)}
                                                className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-sm"
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Select All */}
                    <div className="flex items-center ml-2">
                        <span className="text-sm mr-2 font-medium">Select All</span>
                        <div
                            onClick={toggleSelectAll}
                            className={`w-6 h-6 rounded-full border flex items-center justify-center cursor-pointer ${selectedRecords.length === filteredRecords.length && filteredRecords.length > 0 ? "bg-indigo-600 border-indigo-600" : "bg-white border-gray-300"}`}
                        >
                            {selectedRecords.length === filteredRecords.length && filteredRecords.length > 0 && (
                                <div className="w-3 h-3 rounded-full bg-white"/>
                            )}
                        </div>
                    </div>
                </div>

                {/* Records List */}
                <div className="px-4 py-4 space-y-4">
                    {filteredRecords.length > 0 ? (
                        filteredRecords.map((record) => (
                            <div
                                key={record.id}
                                className="border border-gray-200 rounded-xl p-3 flex items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => openRecord(record)}
                            >
                                <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mr-3">
                                    <span className="text-2xl font-bold">PDF</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold">{record.title}</h3>
                                    <div className="text-sm space-y-0.5">
                                        <p><strong>Date:</strong> {record.date}</p>
                                        {record.doctor && <p><strong>Doctor:</strong> {record.doctor}</p>}
                                        {record.lab && <p><strong>Lab:</strong> {record.lab}</p>}
                                        <p><strong>Type:</strong> {record.type}</p>
                                        <p><strong>Location:</strong> {record.location}</p>
                                        {record.notes && <p><strong>Notes:</strong> {record.notes}</p>}
                                    </div>
                                    {record.status && (
                                        <div className={`mt-1 px-3 py-1 rounded-full text-xs inline-block ${
                                            record.status === "Shared"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }`}>
                                            {record.status}
                                        </div>
                                    )}
                                </div>
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleSelectRecord(record.id);
                                    }}
                                    className={`w-6 h-6 rounded-full border flex items-center justify-center cursor-pointer ${
                                        selectedRecords.includes(record.id)
                                            ? "bg-indigo-600 border-indigo-600"
                                            : "bg-white border-gray-300"
                                    }`}
                                >
                                    {selectedRecords.includes(record.id) && (
                                        <div className="w-3 h-3 rounded-full bg-white"/>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500">
                                {allRecords.length === 0 ? "No health records found" : "No records match your filter criteria"}
                            </p>
                            {filterOption !== "all" && (
                                <button
                                    onClick={() => setFilterOption("all")}
                                    className="mt-2 text-indigo-600 font-medium"
                                >
                                    Show All Records
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Share Button */}
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                    <button
                        disabled={selectedRecords.length === 0}
                        className={`${
                            selectedRecords.length > 0 ? "bg-indigo-600" : "bg-gray-400"
                        } text-white w-full py-3 rounded-full font-bold text-lg shadow-md transition-colors`}
                        onClick={handleClick}
                    >
                        {selectedRecords.length > 0
                            ? `Share ${selectedRecords.length} Record${selectedRecords.length > 1 ? "s" : ""}`
                            : "Select Records to Share"}
                    </button>
                    <AddButton />
                </div>

                <BottomNavigation/>
            </div>
        </div>
    );
}