import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { loginWithMojo } = useAuth();

    useEffect(() => {
        const mojoAuth = new MojoAuth("701ee29d-271f-4195-9105-fd966c80fcae", {
            source: [{ type: "email", feature: "otp" }],
        });

        mojoAuth.signIn().then(async (response) => {
            if (response.authenticated) {
                setLoading(true);
                try {
                    await loginWithMojo(response.oauth.access_token || response.oauth.id_token);
                } catch (err) {
                    console.error('Login Error:', err);
                    setError(err.response?.data?.message || 'Verification failed. Check your Backend logs.');
                    setLoading(false);
                }
            }
        });
    }, [loginWithMojo]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-full mb-4">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="text-gray-500 mt-2">Sign in to your private group tracker</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-500">Connecting to your account...</p>
                    </div>
                ) : (
                    <div id="mojoauth-passwordless-form"></div>
                )}
            </div>
        </div>
    );
};

export default Login;
