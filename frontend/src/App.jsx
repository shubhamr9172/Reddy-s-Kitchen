import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import GroupSetup from './pages/GroupSetup';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    return children;
};

const AppRoutes = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            {user && <Navbar />}
            <div className="container mx-auto px-4 py-8">
                <Routes>
                    <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
                    <Route path="/" element={
                        <ProtectedRoute>
                            {!user?.groupId ? <Navigate to="/group-setup" /> : <Dashboard />}
                        </ProtectedRoute>
                    } />
                    <Route path="/group-setup" element={
                        <ProtectedRoute>
                            {user?.groupId ? <Navigate to="/" /> : <GroupSetup />}
                        </ProtectedRoute>
                    } />
                </Routes>
            </div>
        </div>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
}

export default App;
