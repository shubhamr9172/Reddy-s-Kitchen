import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { Users, UserPlus } from 'lucide-react';

const GroupSetup = () => {
    const [groupName, setGroupName] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { setUser } = useAuth();

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/groups', { name: groupName });
            // Update local user state with new groupId and role
            const userRes = await api.get('/auth/me');
            setUser(userRes.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create group');
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/groups/join', { inviteCode });
            const userRes = await api.get('/auth/me');
            setUser(userRes.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to join group');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900">Almost There!</h1>
                <p className="text-gray-500 mt-2">Create your own private group or join an existing one.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Create Group */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Users size={24} />
                        </div>
                        <h2 className="text-xl font-semibold">Create Group</h2>
                    </div>
                    <p className="text-gray-500 mb-6 text-sm">Become an Admin and start tracking activities with up to 10 members.</p>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <input
                            type="text"
                            placeholder="e.g. My Family, Project X"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            required
                        />
                        <button
                            disabled={loading}
                            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
                        >
                            Create New Group
                        </button>
                    </form>
                </div>

                {/* Join Group */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                            <UserPlus size={24} />
                        </div>
                        <h2 className="text-xl font-semibold">Join via Invite</h2>
                    </div>
                    <p className="text-gray-500 mb-6 text-sm">Enter the 6-character invite code shared by your group admin.</p>
                    <form onSubmit={handleJoin} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Invite Code (e.g. AB12CD)"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 uppercase"
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value)}
                            required
                            maxLength="6"
                        />
                        <button
                            disabled={loading}
                            className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition-all disabled:opacity-50"
                        >
                            Join Group
                        </button>
                    </form>
                </div>
            </div>

            {error && (
                <div className="mt-8 p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
                    {error}
                </div>
            )}
        </div>
    );
};

export default GroupSetup;
