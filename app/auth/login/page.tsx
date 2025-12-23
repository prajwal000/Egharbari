'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                setError(result.error);
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-md w-full'>
                {/* Logo */}
                <div className='text-center mb-8'>
                    <Link href='/' className='inline-block'>
                        <h1 className='text-3xl font-bold'>
                            <span className='text-gray-900'>e</span>
                            <span className='bg-gradient-to-r from-[#9ac842] to-[#36c2d9] bg-clip-text text-transparent'>
                                GharBari
                            </span>
                        </h1>
                    </Link>
                    <h2 className='mt-4 text-2xl font-bold text-gray-900'>
                        Welcome Back
                    </h2>
                    <p className='mt-2 text-gray-600'>
                        Sign in to access your account
                    </p>
                </div>

                {/* Form Card */}
                <div className='bg-white rounded-2xl shadow-xl p-8'>
                    {error && (
                        <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-xl'>
                            <p className='text-red-600 text-sm font-medium'>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div>
                            <label
                                htmlFor='email'
                                className='block text-sm font-semibold text-gray-700 mb-2'
                            >
                                Email Address
                            </label>
                            <input
                                type='email'
                                id='email'
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9ac842] focus:border-transparent transition-all outline-none'
                                placeholder='your.email@example.com'
                            />
                        </div>

                        <div>
                            <label
                                htmlFor='password'
                                className='block text-sm font-semibold text-gray-700 mb-2'
                            >
                                Password
                            </label>
                            <input
                                type='password'
                                id='password'
                                name='password'
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9ac842] focus:border-transparent transition-all outline-none'
                                placeholder='••••••••'
                            />
                        </div>

                        <button
                            type='submit'
                            disabled={loading}
                            className='w-full py-3 bg-gradient-to-r from-[#9ac842] to-[#36c2d9] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                        >
                            {loading ? (
                                <span className='flex items-center justify-center gap-2'>
                                    <svg className='animate-spin h-5 w-5' viewBox='0 0 24 24'>
                                        <circle
                                            className='opacity-25'
                                            cx='12'
                                            cy='12'
                                            r='10'
                                            stroke='currentColor'
                                            strokeWidth='4'
                                            fill='none'
                                        />
                                        <path
                                            className='opacity-75'
                                            fill='currentColor'
                                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
                                        />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className='mt-6 text-center'>
                        <p className='text-gray-600'>
                            Don&apos;t have an account?{' '}
                            <Link
                                href='/auth/register'
                                className='text-[#9ac842] hover:text-[#36c2d9] font-semibold transition-colors'
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                <div className='mt-6 text-center'>
                    <Link
                        href='/'
                        className='text-gray-500 hover:text-gray-700 text-sm transition-colors'
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

