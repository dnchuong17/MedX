"use client";
import { useState, useEffect } from "react";
import {
    ChevronLeft,
    Search,
    Settings,
    Plus,

    ChevronDown,
} from "lucide-react";
import BottomNavigation from "@/components/navbar";
import {useRouter} from "next/navigation";
export default function HealthRecordsApp() {
    const [selectedRecords, setSelectedRecords] = useState<number[]>([]);
    const [filterOption, setFilterOption] = useState("all");
    const [sortOption, setSortOption] = useState("date-newest");
    const [filteredRecords, setFilteredRecords] = useState<any[]>([]);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const router = useRouter()

    const initialRecords = [
        {
            id: 1,
            title: "General Check-up",
            date: "05/05/2025",
            doctor: "Thomas Johson",
            type: "Periodic Check-up",
            location: "Thu Duc Hospital",
            status: "Shared",
        },
        {
            id: 2,
            title: "Blood Test",
            date: "20/04/2025",
            lab: "Medic Lab",
            type: "Test",
            location: "Gia Dinh Hospital",
            status: "Pending Verification",
        },
        {
            id: 3,
            title: "Cardiology Exam",
            date: "05/05/2025",
            doctor: "Thomas Johson",
            type: "Specialist",
            location: "Gia Dinh Hospital",
            status: "Shared",
        },
    ];

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
        router.push('/health-record/temporary-link')
    }

    useEffect(() => {
        let filtered = [...initialRecords];

        if (filterOption.startsWith("type-")) {
            const type = filterOption.slice(5);
            filtered = type === "all" ? filtered : filtered.filter((r) => r.type === type);
        } else if (filterOption.startsWith("status-")) {
            const status = filterOption.slice(7);
            filtered = status === "all" ? filtered : filtered.filter((r) => r.status === status);
        }

        filtered.sort((a, b) => {
            const dateA = a.date.split("/").reverse().join("");
            const dateB = b.date.split("/").reverse().join("");
            return sortOption === "date-newest"
                ? dateB.localeCompare(dateA)
                : dateA.localeCompare(dateB);
        });

        setFilteredRecords(filtered);
        setSelectedRecords([]);
    }, [filterOption, sortOption]);

    return (
        <div className="min-h-screen flex justify-center p-4 ">
            <div className="bg-white w-full max-w-md overflow-hidden relative pb-20 ">

                {/* Header */}
                <div className="p-4 flex justify-between items-center ">
                    <ChevronLeft className="text-indigo-600 w-6 h-6" />
                    <h1 className="text-indigo-600 text-xl font-semibold">Health Record</h1>
                    <div className="flex space-x-2">
                        <div className="bg-blue-100 rounded-full p-2">
                            <Search className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="bg-blue-100 rounded-full p-2">
                            <Settings className="w-5 h-5 text-indigo-600" />
                        </div>
                    </div>
                </div>

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
                                    { label: "Newest First", value: "date-newest" },
                                    { label: "Oldest First", value: "date-oldest" },
                                ],
                                handler: handleDateSort,
                                active: sortOption,
                            },
                            {
                                label: " Type",
                                options: [
                                    { label: "All Types", value: "all" },
                                    { label: "Periodic Check-up", value: "Periodic Check-up" },
                                    { label: "Test", value: "Test" },
                                    { label: "Specialist", value: "Specialist" },
                                ],
                                handler: filterByType,
                                active: filterOption,
                                prefix: "type-",
                            },
                            {
                                label: "Status",
                                options: [
                                    { label: "All Status", value: "all" },
                                    { label: "Shared", value: "Shared" },
                                    { label: "Pending Verification", value: "Pending Verification" },
                                ],
                                handler: filterByStatus,
                                active: filterOption,
                                prefix: "status-",
                            },
                        ].map(({ label, options, handler, active, prefix = "" }, i) => (
                            <div key={i} className="relative">
                                <button
                                    onClick={() => toggleDropdown(label)}
                                    className={`${(active.startsWith(prefix) && active !== `${prefix}all`) ? "bg-indigo-100" : "bg-gray-100"} hover:bg-gray-200 rounded-full px-3 py-1.5 text-sm flex items-center shadow-sm`}
                                >
                                    {label}
                                    <ChevronDown className="ml-1 w-4 h-4" />
                                </button>
                                {openDropdown === label && (
                                    <div className="absolute z-10 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-40">
                                        {options.map(({ label, value }) => (
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
                                <div className="w-3 h-3 rounded-full bg-white" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Records List */}
                <div className="px-4 py-4 space-y-4">
                    {filteredRecords.length > 0 ? (
                        filteredRecords.map((record) => (
                            <div key={record.id} className="border border-gray-200 rounded-xl p-3 flex items-center shadow-sm hover:shadow-md transition-shadow">
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
                                    onClick={() => toggleSelectRecord(record.id)}
                                    className={`w-6 h-6 rounded-full border flex items-center justify-center cursor-pointer ${
                                        selectedRecords.includes(record.id)
                                            ? "bg-indigo-600 border-indigo-600"
                                            : "bg-white border-gray-300"
                                    }`}
                                >
                                    {selectedRecords.includes(record.id) && (
                                        <div className="w-3 h-3 rounded-full bg-white" />
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500">No records match your filter criteria</p>
                            <button
                                onClick={() => setFilterOption("all")}
                                className="mt-2 text-indigo-600 font-medium"
                            >
                                Show All Records
                            </button>
                        </div>
                    )}
                </div>

                {/* Share Button */}
                <div className="px-4 py-6">
                    <button
                        disabled={selectedRecords.length === 0}
                        className={`${
                            selectedRecords.length > 0 ? "bg-indigo-600" : "bg-gray-400"
                        } text-white w-full py-3 rounded-full font-bold text-lg shadow-md transition-colors`}
                    >
                        {selectedRecords.length > 0
                            ? `Share ${selectedRecords.length} Record${selectedRecords.length > 1 ? "s" : ""}`
                            : "Select Records to Share"}
                    </button>
                </div>

                {/* Add Button */}
                <div className="absolute right-8 bottom-24">
                    <button
                        onClick={handleClick}
                        className="bg-indigo-600 rounded-full p-3 shadow-lg hover:bg-indigo-700 transition-colors">
                        <Plus className="text-white w-8 h-8" />
                    </button>
                </div>

                <BottomNavigation />
            </div>
        </div>
    );
}
