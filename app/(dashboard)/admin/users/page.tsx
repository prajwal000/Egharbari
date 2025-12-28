'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserRole } from '@/lib/types/user';

interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
    role: UserRole;
    isActive: boolean;
    avatar?: string;
    createdAt: string;
    updatedAt: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState({ total: 0, totalAdmins: 0, totalUsers: 0 });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ role: '', search: '' });
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [deleting, setDeleting] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const fetchUsers = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            params.set('page', pagination.page.toString());
            params.set('limit', '10');
            if (filter.role) params.set('role', filter.role);
            if (filter.search) params.set('search', filter.search);

            const response = await fetch(`/api/users?${params}`);
            const data = await response.json();

            if (response.ok) {
                setUsers(data.users);
                setPagination(prev => ({ ...prev, ...data.pagination }));
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, filter]);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/users/stats');
            const data = await response.json();
            if (response.ok) {
                setStats(data);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        fetchStats();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        setDeleting(id);
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchUsers();
                fetchStats();
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to delete user');
            }
        } catch (error) {
            console.error('Failed to delete user:', error);
            alert('Failed to delete user');
        } finally {
            setDeleting(null);
        }
    };

    const handleRoleChange = async (id: string, newRole: UserRole) => {
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole }),
            });

            if (response.ok) {
                fetchUsers();
                fetchStats();
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to update user role');
            }
        } catch (error) {
            console.error('Failed to update user role:', error);
            alert('Failed to update user role');
        }
    };

    if (loading) {
        return (
            <div className='flex items-center justify-center h-64'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#9ac842]'></div>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div>
                <h1 className='text-2xl font-bold text-gray-900'>User Management</h1>
                <p className='text-gray-600'>Manage all registered users</p>
            </div>

            {/* Stats Cards */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-blue-100 text-sm font-medium'>Total Users</p>
                            <p className='text-3xl font-bold mt-2'>{stats.total}</p>
                        </div>
                        <div className='text-4xl opacity-80'>👥</div>
                    </div>
                </div>
                <div className='bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-purple-100 text-sm font-medium'>Administrators</p>
                            <p className='text-3xl font-bold mt-2'>{stats.totalAdmins}</p>
                        </div>
                        <div className='text-4xl opacity-80'>👑</div>
                    </div>
                </div>
                <div className='bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-green-100 text-sm font-medium'>Regular Users</p>
                            <p className='text-3xl font-bold mt-2'>{stats.totalUsers}</p>
                        </div>
                        <div className='text-4xl opacity-80'>👤</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className='bg-white rounded-xl shadow-sm p-4'>
                <div className='flex flex-col sm:flex-row gap-4'>
                    <div className='flex-1'>
                        <input
                            type='text'
                            placeholder='Search by name or email...'
                            value={filter.search}
                            onChange={(e) => {
                                setFilter(prev => ({ ...prev, search: e.target.value }));
                                setPagination(prev => ({ ...prev, page: 1 }));
                            }}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none'
                        />
                    </div>
                    <select
                        value={filter.role}
                        onChange={(e) => {
                            setFilter(prev => ({ ...prev, role: e.target.value }));
                            setPagination(prev => ({ ...prev, page: 1 }));
                        }}
                        className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none'
                    >
                        <option value=''>All Roles</option>
                        <option value='admin'>Admin</option>
                        <option value='user'>User</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead className='bg-gray-50 border-b border-gray-200'>
                            <tr>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    User
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    Contact
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    Role
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    Status
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    Joined
                                </th>
                                <th className='px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-200'>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className='px-6 py-12 text-center text-gray-500'>
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} className='hover:bg-gray-50'>
                                        <td className='px-6 py-4'>
                                            <div className='flex items-center gap-3'>
                                                <div className='w-10 h-10 rounded-full bg-gradient-to-br from-[#9ac842] to-[#36c2d9] flex items-center justify-center text-white font-bold'>
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className='font-semibold text-gray-900'>{user.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='text-sm'>
                                                <p className='text-gray-900'>{user.email}</p>
                                                <p className='text-gray-600 flex items-center gap-1 mt-1'>
                                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                                                    </svg>
                                                    {user.phone}
                                                </p>
                                            </div>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value as UserRole)}
                                                className={`px-3 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer ${
                                                    user.role === 'admin'
                                                        ? 'bg-purple-100 text-purple-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                }`}
                                            >
                                                <option value='user'>User</option>
                                                <option value='admin'>Admin</option>
                                            </select>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                user.isActive
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}>
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className='px-6 py-4 text-sm text-gray-600'>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='flex items-center justify-end gap-2'>
                                                <button
                                                    onClick={() => setSelectedUser(user)}
                                                    className='p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors'
                                                    title='View Details'
                                                >
                                                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    disabled={deleting === user._id}
                                                    className='p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50'
                                                    title='Delete'
                                                >
                                                    {deleting === user._id ? (
                                                        <svg className='w-5 h-5 animate-spin' fill='none' viewBox='0 0 24 24'>
                                                            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                                            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                                        </svg>
                                                    ) : (
                                                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className='px-6 py-4 border-t border-gray-200 flex items-center justify-between'>
                        <div className='text-sm text-gray-600'>
                            Showing {((pagination.page - 1) * 10) + 1} to {Math.min(pagination.page * 10, pagination.total)} of {pagination.total} users
                        </div>
                        <div className='flex items-center gap-2'>
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                disabled={pagination.page === 1}
                                className='px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors'
                            >
                                Previous
                            </button>
                            <span className='text-sm text-gray-600'>
                                Page {pagination.page} of {pagination.pages}
                            </span>
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                disabled={pagination.page === pagination.pages}
                                className='px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors'
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* User Detail Modal */}
            {selectedUser && (
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4' onClick={() => setSelectedUser(null)}>
                    <div className='bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto' onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div className='sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between'>
                            <h2 className='text-xl font-bold text-gray-900'>User Profile</h2>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                            >
                                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                                </svg>
                            </button>
                        </div>

                        <div className='p-6'>
                            {/* Avatar Section */}
                            <div className='flex flex-col items-center mb-6'>
                                <div className='w-24 h-24 rounded-full bg-gradient-to-br from-[#9ac842] to-[#36c2d9] flex items-center justify-center text-white font-bold text-3xl mb-3'>
                                    {selectedUser.name.charAt(0).toUpperCase()}
                                </div>
                                <h3 className='text-xl font-bold text-gray-900'>{selectedUser.name}</h3>
                                <p className='text-gray-600'>{selectedUser.email}</p>
                                
                                {/* Status Badge */}
                                <div className='flex items-center gap-2 mt-2'>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        selectedUser.role === 'admin'
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {selectedUser.role.toUpperCase()}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        selectedUser.isActive
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                    }`}>
                                        {selectedUser.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>

                            {/* User Details Grid */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                {/* Personal Information */}
                                <div className='bg-gray-50 rounded-xl p-4'>
                                    <h4 className='text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2'>
                                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                                        </svg>
                                        Personal Information
                                    </h4>
                                    <div className='space-y-3'>
                                        <div>
                                            <label className='text-xs text-gray-500 uppercase tracking-wider'>Full Name</label>
                                            <p className='font-semibold text-gray-900 mt-1'>{selectedUser.name}</p>
                                        </div>
                                        <div>
                                            <label className='text-xs text-gray-500 uppercase tracking-wider'>Email Address</label>
                                            <p className='font-semibold text-gray-900 mt-1 break-all'>{selectedUser.email}</p>
                                        </div>
                                        <div>
                                            <label className='text-xs text-gray-500 uppercase tracking-wider'>Phone Number</label>
                                            <p className='font-semibold text-gray-900 mt-1'>{selectedUser.phone || 'Not provided'}</p>
                                        </div>
                                        <div>
                                            <label className='text-xs text-gray-500 uppercase tracking-wider'>Address</label>
                                            <p className='font-semibold text-gray-900 mt-1'>{selectedUser.address || 'Not provided'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Account Information */}
                                <div className='bg-gray-50 rounded-xl p-4'>
                                    <h4 className='text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2'>
                                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                                        </svg>
                                        Account Information
                                    </h4>
                                    <div className='space-y-3'>
                                        <div>
                                            <label className='text-xs text-gray-500 uppercase tracking-wider'>User ID</label>
                                            <p className='font-mono text-sm text-gray-900 mt-1 break-all'>{selectedUser._id}</p>
                                        </div>
                                        <div>
                                            <label className='text-xs text-gray-500 uppercase tracking-wider'>Role</label>
                                            <p className='font-semibold text-gray-900 mt-1 capitalize'>{selectedUser.role}</p>
                                        </div>
                                        <div>
                                            <label className='text-xs text-gray-500 uppercase tracking-wider'>Account Status</label>
                                            <p className='font-semibold text-gray-900 mt-1'>
                                                {selectedUser.isActive ? (
                                                    <span className='text-green-600'>✓ Active</span>
                                                ) : (
                                                    <span className='text-red-600'>✗ Inactive</span>
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <label className='text-xs text-gray-500 uppercase tracking-wider'>Member Since</label>
                                            <p className='font-semibold text-gray-900 mt-1'>
                                                {new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div>
                                            <label className='text-xs text-gray-500 uppercase tracking-wider'>Last Updated</label>
                                            <p className='font-semibold text-gray-900 mt-1'>
                                                {new Date(selectedUser.updatedAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className='mt-6 flex items-center justify-end gap-3 pt-6 border-t border-gray-200'>
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className='px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

