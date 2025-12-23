'use client';

import { useState, useEffect, useCallback } from 'react';
import { InquiryData, InquiryStatus, InquiryType } from '@/lib/types/inquiry';

export default function AdminInquiriesPage() {
    const [inquiries, setInquiries] = useState<InquiryData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInquiry, setSelectedInquiry] = useState<InquiryData | null>(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [sendingReply, setSendingReply] = useState(false);
    const [filter, setFilter] = useState({ status: '', type: '' });
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

    const fetchInquiries = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            params.set('page', pagination.page.toString());
            if (filter.status) params.set('status', filter.status);
            if (filter.type) params.set('type', filter.type);

            const response = await fetch(`/api/inquiries?${params}`);
            const data = await response.json();

            if (response.ok) {
                setInquiries(data.inquiries);
                setPagination(prev => ({ ...prev, ...data.pagination }));
            }
        } catch (error) {
            console.error('Failed to fetch inquiries:', error);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, filter.status, filter.type]);

    useEffect(() => {
        fetchInquiries();
    }, [fetchInquiries]);

    const handleStatusChange = async (id: string, status: InquiryStatus) => {
        try {
            const response = await fetch(`/api/inquiries/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });

            if (response.ok) {
                fetchInquiries();
                if (selectedInquiry?._id === id) {
                    setSelectedInquiry(prev => prev ? { ...prev, status } : null);
                }
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const handleSendReply = async () => {
        if (!selectedInquiry || !replyMessage.trim()) return;

        setSendingReply(true);
        try {
            const response = await fetch(`/api/inquiries/${selectedInquiry._id}/reply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: replyMessage }),
            });

            if (response.ok) {
                const data = await response.json();
                setSelectedInquiry(data.inquiry);
                setReplyMessage('');
                fetchInquiries();
            }
        } catch (error) {
            console.error('Failed to send reply:', error);
        } finally {
            setSendingReply(false);
        }
    };

    const handleMarkAsRead = async (inquiry: InquiryData) => {
        if (inquiry.isRead) return;

        try {
            await fetch(`/api/inquiries/${inquiry._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isRead: true }),
            });
            fetchInquiries();
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const openInquiry = (inquiry: InquiryData) => {
        setSelectedInquiry(inquiry);
        handleMarkAsRead(inquiry);
    };

    const getStatusColor = (status: InquiryStatus) => {
        switch (status) {
            case InquiryStatus.PENDING:
                return 'bg-yellow-100 text-yellow-700';
            case InquiryStatus.IN_PROGRESS:
                return 'bg-blue-100 text-blue-700';
            case InquiryStatus.RESOLVED:
                return 'bg-green-100 text-green-700';
            case InquiryStatus.CLOSED:
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getTypeColor = (type: InquiryType) => {
        switch (type) {
            case InquiryType.GENERAL:
                return 'bg-purple-100 text-purple-700';
            case InquiryType.PROPERTY:
                return 'bg-indigo-100 text-indigo-700';
            case InquiryType.SUPPORT:
                return 'bg-orange-100 text-orange-700';
            case InquiryType.FEEDBACK:
                return 'bg-pink-100 text-pink-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9ac842]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
                    <p className="text-gray-600">Manage and respond to customer inquiries</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                        {inquiries.filter(i => !i.isRead).length} Unread
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {pagination.total} Total
                    </span>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex flex-wrap gap-4">
                    <select
                        value={filter.status}
                        onChange={(e) => {
                            setFilter(prev => ({ ...prev, status: e.target.value }));
                            setPagination(prev => ({ ...prev, page: 1 }));
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none"
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>
                    <select
                        value={filter.type}
                        onChange={(e) => {
                            setFilter(prev => ({ ...prev, type: e.target.value }));
                            setPagination(prev => ({ ...prev, page: 1 }));
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none"
                    >
                        <option value="">All Types</option>
                        <option value="general">General</option>
                        <option value="property">Property</option>
                        <option value="support">Support</option>
                        <option value="feedback">Feedback</option>
                    </select>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Inquiries List */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                        {inquiries.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <p>No inquiries found</p>
                            </div>
                        ) : (
                            inquiries.map((inquiry) => (
                                <div
                                    key={inquiry._id}
                                    onClick={() => openInquiry(inquiry)}
                                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                                        selectedInquiry?._id === inquiry._id ? 'bg-blue-50 border-l-4 border-[#9ac842]' : ''
                                    } ${!inquiry.isRead ? 'bg-yellow-50/50' : ''}`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                {!inquiry.isRead && (
                                                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                                                )}
                                                <h3 className="font-semibold text-gray-900 truncate">
                                                    {inquiry.subject}
                                                </h3>
                                            </div>
                                            <p className="text-sm text-gray-600 truncate">{inquiry.name} • {inquiry.email}</p>
                                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{inquiry.message}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                                                    {inquiry.status.replace('_', ' ')}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(inquiry.type)}`}>
                                                    {inquiry.type}
                                                </span>
                                                {inquiry.replies.length > 0 && (
                                                    <span className="text-xs text-gray-500">
                                                        {inquiry.replies.length} replies
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500 whitespace-nowrap">
                                            {new Date(inquiry.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                disabled={pagination.page === 1}
                                className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-600">
                                Page {pagination.page} of {pagination.pages}
                            </span>
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                disabled={pagination.page === pagination.pages}
                                className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>

                {/* Inquiry Detail & Reply */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {selectedInquiry ? (
                        <div className="h-full flex flex-col">
                            {/* Detail Header */}
                            <div className="p-4 border-b border-gray-100">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">{selectedInquiry.subject}</h2>
                                        <p className="text-sm text-gray-600 mt-1">
                                            From: {selectedInquiry.name} ({selectedInquiry.email})
                                        </p>
                                        {selectedInquiry.phone && (
                                            <p className="text-sm text-gray-500">Phone: {selectedInquiry.phone}</p>
                                        )}
                                    </div>
                                    <select
                                        value={selectedInquiry.status}
                                        onChange={(e) => handleStatusChange(selectedInquiry._id, e.target.value as InquiryStatus)}
                                        className={`px-3 py-1 rounded-lg text-sm font-medium border-0 ${getStatusColor(selectedInquiry.status)}`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[350px]">
                                {/* Original Message */}
                                <div className="bg-gray-100 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                                            {selectedInquiry.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">{selectedInquiry.name}</p>
                                            <p className="text-xs text-gray-500">{new Date(selectedInquiry.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 whitespace-pre-wrap">{selectedInquiry.message}</p>
                                </div>

                                {/* Replies */}
                                {selectedInquiry.replies.map((reply) => (
                                    <div
                                        key={reply._id}
                                        className={`rounded-xl p-4 ${
                                            reply.isAdmin 
                                                ? 'bg-gradient-to-r from-[#9ac842]/10 to-[#36c2d9]/10 ml-4' 
                                                : 'bg-gray-100 mr-4'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                                                reply.isAdmin ? 'bg-gradient-to-r from-[#9ac842] to-[#36c2d9]' : 'bg-gray-400'
                                            }`}>
                                                {reply.isAdmin ? 'A' : selectedInquiry.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm">
                                                    {reply.isAdmin ? 'Admin' : selectedInquiry.name}
                                                </p>
                                                <p className="text-xs text-gray-500">{new Date(reply.createdAt).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 whitespace-pre-wrap">{reply.message}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Reply Input */}
                            <div className="p-4 border-t border-gray-100">
                                <div className="flex gap-3">
                                    <textarea
                                        value={replyMessage}
                                        onChange={(e) => setReplyMessage(e.target.value)}
                                        placeholder="Type your reply..."
                                        rows={3}
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none resize-none"
                                    />
                                    <button
                                        onClick={handleSendReply}
                                        disabled={!replyMessage.trim() || sendingReply}
                                        className="px-6 py-3 bg-gradient-to-r from-[#9ac842] to-[#36c2d9] text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed self-end"
                                    >
                                        {sendingReply ? (
                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500 p-8">
                            <div className="text-center">
                                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                <p>Select an inquiry to view details and reply</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

