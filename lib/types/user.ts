/**
 * User roles enum - shared between client and server
 */
export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

/**
 * User interface for client-side use (without Mongoose Document)
 */
export interface UserData {
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

