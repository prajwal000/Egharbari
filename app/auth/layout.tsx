import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Authentication - eGharBari',
    description: 'Sign in or create an account to access eGharBari',
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className='min-h-screen'>
            {children}
        </div>
    );
}

