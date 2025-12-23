'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
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

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone || undefined,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            // Redirect to login with success message
            router.push('/auth/login?registered=true');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
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
                        Create Account
                    </h2>
                    <p className='mt-2 text-gray-600'>
                        Join us to find your dream property
                    </p>
                </div>

                {/* Form Card */}
                <div className='bg-white rounded-2xl shadow-xl p-8'>
                    {error && (
                        <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-xl'>
                            <p className='text-red-600 text-sm font-medium'>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className='space-y-5'>
                        <div>
                            <label
                                htmlFor='name'
                                className='block text-sm font-semibold text-gray-700 mb-2'
                            >
                                Full Name *
                            </label>
                            <input
                                type='text'
                                id='name'
                                name='name'
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9ac842] focus:border-transparent transition-all outline-none'
                                placeholder='Enter your full name'
                            />
                        </div>

                        <div>
                            <label
                                htmlFor='email'
                                className='block text-sm font-semibold text-gray-700 mb-2'
                            >
                                Email Address *
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
                                htmlFor='phone'
                                className='block text-sm font-semibold text-gray-700 mb-2'
                            >
                                Phone Number (Optional)
                            </label>
                            <input
                                type='tel'
                                id='phone'
                                name='phone'
                                value={formData.phone}
                                onChange={handleChange}
                                className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9ac842] focus:border-transparent transition-all outline-none'
                                placeholder='+977 9801234567'
                            />
                        </div>

                        <div>
                            <label
                                htmlFor='password'
                                className='block text-sm font-semibold text-gray-700 mb-2'
                            >
                                Password *
                            </label>
                            <input
                                type='password'
                                id='password'
                                name='password'
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={8}
                                className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9ac842] focus:border-transparent transition-all outline-none'
                                placeholder='Min. 8 characters'
                            />
                        </div>

                        <div>
                            <label
                                htmlFor='confirmPassword'
                                className='block text-sm font-semibold text-gray-700 mb-2'
                            >
                                Confirm Password *
                            </label>
                            <input
                                type='password'
                                id='confirmPassword'
                                name='confirmPassword'
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9ac842] focus:border-transparent transition-all outline-none'
                                placeholder='Confirm your password'
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
                                    Creating account...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className='mt-6 text-center'>
                        <p className='text-gray-600'>
                            Already have an account?{' '}
                            <Link
                                href='/auth/login'
                                className='text-[#9ac842] hover:text-[#36c2d9] font-semibold transition-colors'
                            >
                                Sign in
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

