"use client"
import { useState, useEffect } from 'react';
import { ChevronLeft, Search, Settings, Plus, Home, MessageCircle, User, FileText, ChevronDown } from 'lucide-react';

export default function HealthRecordsApp() {
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [filterOption, setFilterOption] = useState('all');
    const [sortOption, setSortOption] = useState('date-newest');
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null);

    const initialRecords = [
        {
            id: 1,
            title: "General Check-up",
            date: "05/05/2025",
            doctor: "Thomas Johson",
            type: "Periodic Check-up",
            location: "Thu Duc Hospital",
            status: "Shared"
        },
        {
            id: 2,
            title: "Blood Test",
            date: "20/04/2025",
            lab: "Medic Lab",
            type: "Test",
            location: "Gia Dinh Hospital",
            status: "Pending Verification"
        },
        {
            id: 3,
            title: "Cardiology Exam",
            date: "05/05/2025",
            doctor: "Thomas Johson",
            type: "Specialist",
            location: "Gia Dinh Hospital",
            status: "Shared"
        }
    ];

    const toggleSelectRecord = (id) => {
        if (selectedRecords.includes(id)) {
            setSelectedRecords(selectedRecords.filter(recordId => recordId !== id));
        } else {
            setSelectedRecords([...selectedRecords, id]);
        }
    };

    const toggleSelectAll = () => {
        if (selectedRecords.length === filteredRecords.length) {
            setSelectedRecords([]);
        } else {
            setSelectedRecords(filteredRecords.map(record => record.id));
        }
    };

    const toggleDropdown = (dropdown) => {
        if (openDropdown === dropdown) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(dropdown);
        }
    };

    useEffect(() => {
        let filtered = [...initialRecords];

        if (filterOption.startsWith('type-')) {
            const typeValue = filterOption.replace('type-', '');
            if (typeValue !== 'all') {
                filtered = filtered.filter(record => record.type === typeValue);
            }
        }

        // Apply status filter
        else if (filterOption.startsWith('status-')) {
            const statusValue = filterOption.replace('status-', '');
            if (statusValue !== 'all') {
                filtered = filtered.filter(record => record.status === statusValue);
            }
        }

        // Apply sorting
        switch(sortOption) {
            case 'date-newest':
                filtered.sort((a, b) => {
                    const dateA = a.date.split('/').reverse().join('');
                    const dateB = b.date.split('/').reverse().join('');
                    return dateB.localeCompare(dateA);
                });
                break;
            case 'date-oldest':
                filtered.sort((a, b) => {
                    const dateA = a.date.split('/').reverse().join('');
                    const dateB = b.date.split('/').reverse().join('');
                    return dateA.localeCompare(dateB);
                });
                break;
            default:
                // Default to newest first
                filtered.sort((a, b) => {
                    const dateA = a.date.split('/').reverse().join('');
                    const dateB = b.date.split('/').reverse().join('');
                    return dateB.localeCompare(dateA);
                });
        }

        setFilteredRecords(filtered);
        setSelectedRecords([]);
    }, [filterOption, sortOption]);

    const handleDateSort = (option) => {
        setSortOption(option);
        setOpenDropdown(null);
    };

    const filterByType = (type) => {
        setFilterOption(type === 'all' ? 'all' : `type-${type}`);
        setOpenDropdown(null);
    };

    const filterByStatus = (status) => {
        setFilterOption(status === 'all' ? 'all' : `status-${status}`);
        setOpenDropdown(null);
    };

    return (
        <div className="0 min-h-screen flex justify-center p-4">
            <div className="bg-white w-full max-w-md overflow-hidden relative pb-20">


                {/* Header */}
                <div className="p-4 flex justify-between items-center">
                    <ChevronLeft className="text-indigo-600 w-6 h-6" />
                    <h1 className="text-indigo-600 text-2xl font-bold">Health Record</h1>
                    <div className="flex space-x-2">
                        <div className="bg-blue-100 rounded-full p-2">
                            <Search className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="bg-blue-100 rounded-full p-2">
                            <Settings className="w-5 h-5 text-indigo-600" />
                        </div>
                    </div>
                </div>

                {/* Filter Selection Information */}
                {filterOption !== 'all' && (
                    <div className="px-4 mb-2">
                        <div className="bg-indigo-50 rounded-lg p-2 text-indigo-800 text-sm flex justify-between items-center">
                            <span>
                                Showing: {filterOption.startsWith('type-') ?
                                `Type - ${filterOption.replace('type-', '')}` :
                                `Status - ${filterOption.replace('status-', '')}`}
                            </span>
                            <button
                                className="text-indigo-600 font-medium"
                                onClick={() => setFilterOption('all')}
                            >
                                Show All
                            </button>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="px-4 flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <span className="text-gray-700 mr-2 font-medium">Sort By</span>
                        <div className="flex space-x-2 relative">
                            {/* Date Filter */}
                            <div className="relative">
                                <button
                                    className="bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-1.5 text-sm flex items-center shadow-sm"
                                    onClick={() => toggleDropdown('date')}
                                >
                                    <span className="font-medium">Date</span>
                                    <ChevronDown className="ml-1 w-4 h-4" />
                                </button>
                                {openDropdown === 'date' && (
                                    <div className="absolute z-10 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-40">
                                        <button
                                            className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-sm"
                                            onClick={() => handleDateSort('date-newest')}
                                        >
                                            Newest First
                                        </button>
                                        <button
                                            className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-sm"
                                            onClick={() => handleDateSort('date-oldest')}
                                        >
                                            Oldest First
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Data Type Filter */}
                            <div className="relative">
                                <button
                                    className={`${filterOption.startsWith('type-') && filterOption !== 'type-all' ? 'bg-indigo-100' : 'bg-gray-100'} hover:bg-gray-200 rounded-full px-4 py-1.5 text-sm flex items-center shadow-sm`}
                                    onClick={() => toggleDropdown('type')}
                                >
                                    <span className="font-medium">Data Type</span>
                                    <ChevronDown className="ml-1 w-4 h-4" />
                                </button>
                                {openDropdown === 'type' && (
                                    <div className="absolute z-10 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-40">
                                        <button
                                            className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-sm"
                                            onClick={() => filterByType('all')}
                                        >
                                            All Types
                                        </button>
                                        <button
                                            className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-sm"
                                            onClick={() => filterByType('Periodic Check-up')}
                                        >
                                            Periodic Check-up
                                        </button>
                                        <button
                                            className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-sm"
                                            onClick={() => filterByType('Test')}
                                        >
                                            Test
                                        </button>
                                        <button
                                            className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-sm"
                                            onClick={() => filterByType('Specialist')}
                                        >
                                            Specialist
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Status Filter */}
                            <div className="relative">
                                <button
                                    className={`${filterOption.startsWith('status-') && filterOption !== 'status-all' ? 'bg-indigo-100' : 'bg-gray-100'} hover:bg-gray-200 rounded-full px-4 py-1.5 text-sm flex items-center shadow-sm`}
                                    onClick={() => toggleDropdown('status')}
                                >
                                    <span className="font-medium">Status</span>
                                    <ChevronDown className="ml-1 w-4 h-4" />
                                </button>
                                {openDropdown === 'status' && (
                                    <div className="absolute right-0 z-10 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-40">
                                        <button
                                            className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-sm"
                                            onClick={() => filterByStatus('all')}
                                        >
                                            All Status
                                        </button>
                                        <button
                                            className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-sm"
                                            onClick={() => filterByStatus('Shared')}
                                        >
                                            Shared
                                        </button>
                                        <button
                                            className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-sm"
                                            onClick={() => filterByStatus('Pending Verification')}
                                        >
                                            Pending Verification
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <span className="text-sm mr-2 font-medium">Select All</span>
                        <div
                            className={`w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer ${selectedRecords.length === filteredRecords.length && filteredRecords.length > 0 ? 'bg-indigo-600 border-indigo-600' : 'bg-white'}`}
                            onClick={toggleSelectAll}
                        >
                            {selectedRecords.length === filteredRecords.length && filteredRecords.length > 0 && <div className="w-3 h-3 rounded-full bg-white"></div>}
                        </div>
                    </div>
                </div>

                {/* Records List */}
                <div className="px-4 py-2 space-y-4">
                    {filteredRecords.length > 0 ? (
                        filteredRecords.map(record => (
                            <div key={record.id} className="border border-gray-200 rounded-xl p-3 flex items-center shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mr-3">
                                    <span className="text-2xl font-bold">PDF</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold">{record.title}</h3>
                                    <div className="text-sm">
                                        <p><span className="font-semibold">Date:</span> {record.date}</p>
                                        {record.doctor && <p><span className="font-semibold">Doctor:</span> {record.doctor}</p>}
                                        {record.lab && <p><span className="font-semibold">Lab:</span> {record.lab}</p>}
                                        <p><span className="font-semibold">Type:</span> {record.type}</p>
                                        <p><span className="font-semibold">Location:</span> {record.location}</p>
                                    </div>
                                    {record.status && (
                                        <div className={`mt-1 px-3 py-1 rounded-full text-xs inline-block ${
                                            record.status === "Shared" ? "bg-green-100 text-green-700" :
                                                record.status === "Pending Verification" ? "bg-yellow-100 text-yellow-700" : ""
                                        }`}>
                                            {record.status}
                                        </div>
                                    )}
                                </div>
                                <div
                                    className={`w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer ${selectedRecords.includes(record.id) ? 'bg-indigo-600 border-indigo-600' : 'bg-white'}`}
                                    onClick={() => toggleSelectRecord(record.id)}
                                >
                                    {selectedRecords.includes(record.id) && <div className="w-3 h-3 rounded-full bg-white"></div>}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500">No records match your filter criteria</p>
                            <button
                                className="mt-2 text-indigo-600 font-medium"
                                onClick={() => setFilterOption('all')}
                            >
                                Show All Records
                            </button>
                        </div>
                    )}
                </div>

                {/* Share Button */}
                <div className="px-4 py-6">
                    <button
                        className={`${selectedRecords.length > 0 ? 'bg-indigo-600' : 'bg-gray-400'} text-white w-full py-3 rounded-full font-bold text-lg shadow-md transition-colors`}
                        disabled={selectedRecords.length === 0}
                    >
                        {selectedRecords.length > 0 ? `Share ${selectedRecords.length} Record${selectedRecords.length > 1 ? 's' : ''}` : 'Select Records to Share'}
                    </button>
                </div>

                {/* Add Button */}
                <div className="absolute right-8 bottom-24">
                    <button className="bg-indigo-600 rounded-full p-3 shadow-lg hover:bg-indigo-700 transition-colors">
                        <Plus className="text-white w-8 h-8" />
                    </button>
                </div>

                {/* Navigation Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-indigo-600 rounded-t-3xl p-4">
                    <div className="flex justify-around">
                        <Home className="text-white w-6 h-6" />
                        <MessageCircle className="text-white w-6 h-6" />
                        <User className="text-white w-6 h-6" />
                        <FileText className="text-white w-6 h-6" />
                    </div>
                </div>
            </div>
        </div>
    );
}