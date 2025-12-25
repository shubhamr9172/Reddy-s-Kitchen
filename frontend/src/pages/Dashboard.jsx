import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import EntryCard from '../components/EntryCard';
import ActivityTimeline from '../components/ActivityTimeline';
import { Plus, RefreshCcw, LayoutDashboard, History } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [entries, setEntries] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newEntry, setNewEntry] = useState({ title: '', description: '' });
    const [activeTab, setActiveTab] = useState('tracker'); // 'tracker' or 'activity'

    const fetchData = async () => {
        try {
            const [entriesRes, logsRes] = await Promise.all([
                api.get('/tracker'),
                api.get('/activity')
            ]);
            setEntries(entriesRes.data);
            setLogs(logsRes.data);
        } catch (err) {
            console.error('Failed to fetch dashboard data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Poll for updates every 30 seconds
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleCreateEntry = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tracker', newEntry);
            setNewEntry({ title: '', description: '' });
            setShowModal(false);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create entry');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <RefreshCcw className="animate-spin text-blue-600" size={32} />
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Group Tracker</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Tracking updates for <span className="font-semibold text-gray-700">{user?.groupId?.name}</span>
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                    <Plus size={20} />
                    New Entry
                </button>
            </div>

            {/* Tabs (Mobile only toggle) */}
            <div className="flex md:hidden border-b border-gray-200 mb-6 font-medium">
                <button
                    onClick={() => setActiveTab('tracker')}
                    className={`flex-1 py-3 text-center ${activeTab === 'tracker' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                >
                    Tracker
                </button>
                <button
                    onClick={() => setActiveTab('activity')}
                    className={`flex-1 py-3 text-center ${activeTab === 'activity' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                >
                    Timeline
                </button>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content (Tracker Entries) */}
                <div className={`lg:col-span-2 space-y-4 ${activeTab !== 'tracker' && 'hidden md:block'}`}>
                    <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        <LayoutDashboard size={16} />
                        <span>Active Entries</span>
                    </div>
                    {entries.length === 0 ? (
                        <div className="bg-white border-2 border-dashed border-gray-100 rounded-3xl p-12 text-center">
                            <p className="text-gray-400">No entries yet. Start by adding one!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {entries.map((entry) => (
                                <EntryCard key={entry._id} entry={entry} onUpdate={fetchData} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar (Activity Timeline) */}
                <div className={`${activeTab !== 'activity' && 'hidden md:block'}`}>
                    <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        <History size={16} />
                        <span>Activity Timeline</span>
                    </div>
                    <ActivityTimeline logs={logs} />
                </div>
            </div>

            {/* Create Entry Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white w-full max-w-lg rounded-2xl p-8 shadow-2xl scale-in">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Entry</h2>
                        <form onSubmit={handleCreateEntry} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="What are you tracking?"
                                    value={newEntry.title}
                                    onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                                <textarea
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                                    placeholder="Add some details..."
                                    value={newEntry.description}
                                    onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-gray-100 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
