import { UserRole } from '@/lib/models/User';
import 'next-auth';
import { DefaultSession, DefaultUser } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            id: string;
            role: UserRole;
            isActive: boolean;
        } & DefaultSession['user'];
    }

    interface User extends DefaultUser {
        id: string;
        role: UserRole;
        isActive: boolean;
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends DefaultJWT {
        id: string;
        role: UserRole;
        isActive: boolean;
    }
}



