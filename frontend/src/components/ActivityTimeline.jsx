import React from 'react';
import { PlusCircle, Edit3, UserPlus, Clock } from 'lucide-react';

const ActivityTimeline = ({ logs }) => {
    const getIcon = (type) => {
        switch (type) {
            case 'EntryCreate': return <PlusCircle size={16} className="text-blue-500" />;
            case 'EntryUpdate': return <Edit3 size={16} className="text-amber-500" />;
            case 'MemberJoin': return <UserPlus size={16} className="text-green-500" />;
            default: return <Clock size={16} className="text-gray-400" />;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm overflow-hidden">
            {logs.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-4">No activity yet</p>
            ) : (
                <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-100 before:to-transparent">
                    {logs.map((log) => (
                        <div key={log._id} className="relative flex items-center gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-50 border border-white flex items-center justify-center shadow-sm z-10">
                                {getIcon(log.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 font-medium truncate">{log.description}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] text-blue-600 font-bold uppercase">{log.userId?.email.split('@')[0]}</span>
                                    <span className="text-[10px] text-gray-400">•</span>
                                    <span className="text-[10px] text-gray-400">{formatDate(log.timestamp)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ActivityTimeline;
