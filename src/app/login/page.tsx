'use client';

import { useState,useEffect } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter,useSearchParams } from 'next/navigation';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const searchParams = useSearchParams();

    useEffect(() => {
        
        const message = searchParams.get('message');
        if (message) {
            setSuccessMessage(message);
            const url = new URL(window.location.href);
            url.searchParams.delete('message');
            window.history.replaceState({}, '', url.toString());
        }
    }, [searchParams])

    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        if (result?.ok) {
            router.push('/');
        }

        if (result?.error) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="px-8 py-6 mx-auto mt-4 text-left bg-white shadow-lg md:w-1/3 lg:w-1/3 sm:w-1/3">
                <h1 className="text-3xl font-bold text-center">Login</h1>
                 {/* Success message */}
                {successMessage && (
                    <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                        {successMessage}
                    </div>
                )}
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mt-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            data-testid="login-email-input"
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                        data-testid="login-password-input"
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-between mt-6">
                        <button  data-testid="login-submit-button" className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800" type="submit">
                            Login
                        </button>
                        <Link href="/register" className="text-sm text-blue-500 hover:underline">
                            Register
                        </Link>
                    </div>
                </form>
                
            </div>
        </div>
    );
};

export default LoginPage;