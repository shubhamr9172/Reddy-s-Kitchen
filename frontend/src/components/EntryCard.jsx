import React, { useState } from 'react';
import api from '../api/api';
import { Clock, User, CheckCircle2, Circle, Loader2 } from 'lucide-react';

const EntryCard = ({ entry, onUpdate }) => {
    const [loading, setLoading] = useState(false);

    const handleStatusChange = async (newStatus) => {
        setLoading(true);
        try {
            await api.patch(`/tracker/${entry._id}`, { status: newStatus });
            onUpdate();
        } catch (err) {
            alert('Failed to update status');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = () => {
        if (loading) return <Loader2 className="animate-spin text-blue-500" size={20} />;
        if (entry.status === 'Done') return <CheckCircle2 className="text-green-500" size={20} />;
        if (entry.status === 'In Progress') return <Clock className="text-amber-500" size={20} />;
        return <Circle className="text-gray-300" size={20} />;
    };

    const statusColors = {
        'Open': 'bg-gray-50 text-gray-600',
        'In Progress': 'bg-amber-50 text-amber-700',
        'Done': 'bg-green-50 text-green-700',
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon()}
                        <h3 className={`font-bold text-lg ${entry.status === 'Done' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                            {entry.title}
                        </h3>
                    </div>
                    {entry.description && (
                        <p className="text-gray-500 text-sm mb-4 leading-relaxed">{entry.description}</p>
                    )}
                </div>

                <div className="flex flex-col items-end gap-2">
                    <select
                        value={entry.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        disabled={loading}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 outline-none cursor-pointer ${statusColors[entry.status]}`}
                    >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 pt-4 border-t border-gray-50 text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                    <User size={14} />
                    <span>Created by: <b className="text-gray-600">{entry.createdBy?.email}</b></span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>Last updated: <b className="text-gray-600">{new Date(entry.updatedAt).toLocaleDateString()}</b></span>
                </div>
            </div>
        </div>
    );
};

export default EntryCard;
