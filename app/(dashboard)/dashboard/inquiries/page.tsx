'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { InquiryData, InquiryStatus, InquiryType } from '@/lib/types/inquiry';

export default function UserInquiriesPage() {
    const [inquiries, setInquiries] = useState<InquiryData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInquiry, setSelectedInquiry] = useState<InquiryData | null>(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [sendingReply, setSendingReply] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

    const fetchInquiries = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            params.set('page', pagination.page.toString());

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
    }, [pagination.page]);

    useEffect(() => {
        fetchInquiries();
    }, [fetchInquiries]);

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

    const getStatusLabel = (status: InquiryStatus) => {
        switch (status) {
            case InquiryStatus.PENDING:
                return 'Waiting for Response';
            case InquiryStatus.IN_PROGRESS:
                return 'In Progress';
            case InquiryStatus.RESOLVED:
                return 'Resolved';
            case InquiryStatus.CLOSED:
                return 'Closed';
            default:
                return status;
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
                    <h1 className="text-2xl font-bold text-gray-900">My Inquiries</h1>
                    <p className="text-gray-600">Track your inquiries and communicate with our team</p>
                </div>
                <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#9ac842] to-[#36c2d9] text-white font-semibold rounded-xl hover:opacity-90 transition-all"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Inquiry
                </Link>
            </div>

            {inquiries.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <svg className="w-20 h-20 mx-auto mb-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Inquiries Yet</h3>
                    <p className="text-gray-600 mb-6">Have questions? Send us an inquiry and we&apos;ll get back to you.</p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#9ac842] to-[#36c2d9] text-white font-semibold rounded-xl hover:opacity-90 transition-all"
                    >
                        Contact Us
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Inquiries List */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100">
                            <h2 className="font-semibold text-gray-900">All Inquiries ({pagination.total})</h2>
                        </div>
                        <div className="divide-y divide-gray-100 max-h-[350px] sm:max-h-[400px] lg:max-h-[500px] overflow-y-auto">
                            {inquiries.map((inquiry) => (
                                <div
                                    key={inquiry._id}
                                    onClick={() => setSelectedInquiry(inquiry)}
                                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                                        selectedInquiry?._id === inquiry._id ? 'bg-blue-50 border-l-4 border-[#9ac842]' : ''
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Property Image (if property inquiry) */}
                                        {inquiry.property && (
                                            <div className="w-16 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                                {inquiry.property.images?.[0] ? (
                                                    <Image
                                                        src={inquiry.property.images[0].url}
                                                        alt={inquiry.property.name}
                                                        width={64}
                                                        height={48}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 truncate mb-1">
                                                        {inquiry.property ? inquiry.property.name : inquiry.subject}
                                                    </h3>
                                                    {inquiry.property && (
                                                        <p className="text-xs text-gray-500 mb-1">{inquiry.property.propertyId}</p>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-500 whitespace-nowrap">
                                                    {new Date(inquiry.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-500 line-clamp-2 mb-2">{inquiry.message}</p>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                                                    {getStatusLabel(inquiry.status)}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(inquiry.type)}`}>
                                                    {inquiry.type}
                                                </span>
                                                {inquiry.replies.length > 0 && (
                                                    <span className="flex items-center gap-1 text-xs text-gray-500">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                        </svg>
                                                        {inquiry.replies.length}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
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

                    {/* Inquiry Detail & Conversation */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {selectedInquiry ? (
                            <div className="h-full flex flex-col">
                                {/* Property Info (if property inquiry) */}
                                {selectedInquiry.property && (
                                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                                        <Link
                                            href={`/properties/${selectedInquiry.property.slug || selectedInquiry.property._id}`}
                                            className="flex items-center gap-3 hover:bg-gray-100 -m-2 p-2 rounded-lg transition-colors"
                                        >
                                            <div className="w-20 h-14 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                                {selectedInquiry.property.images?.[0] && (
                                                    <Image
                                                        src={selectedInquiry.property.images[0].url}
                                                        alt={selectedInquiry.property.name}
                                                        width={80}
                                                        height={56}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{selectedInquiry.property.name}</p>
                                                <p className="text-xs text-gray-500">{selectedInquiry.property.propertyId} • {selectedInquiry.property.location?.district}</p>
                                            </div>
                                            <svg className="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </Link>
                                    </div>
                                )}

                                {/* Detail Header */}
                                <div className="p-4 border-b border-gray-100">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h2 className="text-lg font-bold text-gray-900">{selectedInquiry.property ? 'Your Inquiry' : selectedInquiry.subject}</h2>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {new Date(selectedInquiry.createdAt).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedInquiry.status)}`}>
                                            {getStatusLabel(selectedInquiry.status)}
                                        </span>
                                    </div>
                                </div>

                                {/* Conversation */}
                                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 max-h-[250px] sm:max-h-[300px] lg:max-h-[350px]">
                                    {/* Original Message */}
                                    <div className="bg-gray-100 rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-sm font-bold text-white">
                                                You
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm">You</p>
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
                                                    {reply.isAdmin ? '👑' : 'You'}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 text-sm">
                                                        {reply.isAdmin ? 'eGharBari Support' : 'You'}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{new Date(reply.createdAt).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <p className="text-gray-700 whitespace-pre-wrap">{reply.message}</p>
                                        </div>
                                    ))}

                                    {selectedInquiry.replies.length === 0 && (
                                        <div className="text-center py-6 text-gray-500">
                                            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-sm">Waiting for response from our team...</p>
                                        </div>
                                    )}
                                </div>

                                {/* Reply Input */}
                                {selectedInquiry.status !== InquiryStatus.CLOSED && (
                                    <div className="p-3 sm:p-4 border-t border-gray-100">
                                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                            <textarea
                                                value={replyMessage}
                                                onChange={(e) => setReplyMessage(e.target.value)}
                                                placeholder="Add additional information..."
                                                rows={2}
                                                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none resize-none text-sm sm:text-base"
                                            />
                                            <button
                                                onClick={handleSendReply}
                                                disabled={!replyMessage.trim() || sendingReply}
                                                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#9ac842] to-[#36c2d9] text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed sm:self-end flex items-center justify-center gap-2"
                                            >
                                                {sendingReply ? (
                                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : (
                                                    <>
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                        </svg>
                                                        <span className="sm:hidden">Send</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {selectedInquiry.status === InquiryStatus.CLOSED && (
                                    <div className="p-4 border-t border-gray-100 bg-gray-50 text-center text-gray-500">
                                        <p className="text-sm">This inquiry has been closed. Please create a new inquiry if you need further assistance.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500 p-6 sm:p-8 min-h-[300px] sm:min-h-[400px]">
                                <div className="text-center">
                                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                    </svg>
                                    <p>Select an inquiry to view the conversation</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

