/**
 * Inquiry status enum - shared between client and server
 */
export enum InquiryStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    RESOLVED = 'resolved',
    CLOSED = 'closed',
}

/**
 * Inquiry type enum
 */
export enum InquiryType {
    GENERAL = 'general',
    PROPERTY = 'property',
    SUPPORT = 'support',
    FEEDBACK = 'feedback',
}

/**
 * Reply interface for client-side
 */
export interface ReplyData {
    _id: string;
    message: string;
    isAdmin: boolean;
    createdAt: string;
}

/**
 * Inquiry interface for client-side
 */
export interface InquiryData {
    _id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    type: InquiryType;
    status: InquiryStatus;
    propertyId?: string;
    userId?: string;
    replies: ReplyData[];
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}

