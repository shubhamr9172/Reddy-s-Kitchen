import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [copied, setCopied] = useState(false);

    const copyInviteCode = () => {
        navigator.clipboard.writeText(user?.groupId?.inviteCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <nav className="bg-white border-b border-gray-100 py-4 top-0 sticky z-40 backdrop-blur-md bg-white/80">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">GT</div>
                    <span className="font-bold text-gray-900 text-lg hidden sm:block">GroupTracker</span>
                </div>

                <div className="flex items-center gap-4 sm:gap-8">
                    {user?.groupId && (
                        <div className="hidden md:flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                            <span className="text-xs text-gray-400 font-bold uppercase">Invite:</span>
                            <code className="text-sm font-mono font-bold text-blue-600">{user.groupId.inviteCode}</code>
                            <button onClick={copyInviteCode} className="text-gray-400 hover:text-blue-600 transition-colors">
                                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                            </button>
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end mr-2 hidden sm:flex">
                            <span className="text-sm font-bold text-gray-900">{user?.email.split('@')[0]}</span>
                            <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 rounded font-bold uppercase leading-tight">{user?.role}</span>
                        </div>
                        <button
                            onClick={logout}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
