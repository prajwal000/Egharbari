'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface FavoriteButtonProps {
    propertyId: string;
    size?: 'sm' | 'md' | 'lg';
    showText?: boolean;
}

export default function FavoriteButton({ propertyId, size = 'md', showText = false }: FavoriteButtonProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
    };

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    useEffect(() => {
        if (session?.user) {
            checkFavoriteStatus();
        }
    }, [session, propertyId]);

    const checkFavoriteStatus = async () => {
        try {
            const response = await fetch(`/api/favorites/check?propertyId=${propertyId}`);
            const data = await response.json();
            if (response.ok) {
                setIsFavorite(data.isFavorite);
            }
        } catch (error) {
            console.error('Error checking favorite status:', error);
        }
    };

    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!session?.user) {
            router.push('/auth/signin');
            return;
        }

        setIsLoading(true);

        try {
            if (isFavorite) {
                // Remove from favorites
                const response = await fetch(`/api/favorites?propertyId=${propertyId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setIsFavorite(false);
                }
            } else {
                // Add to favorites
                const response = await fetch('/api/favorites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ propertyId }),
                });

                if (response.ok) {
                    setIsFavorite(true);
                }
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggleFavorite}
            disabled={isLoading}
            className={`${sizeClasses[size]} ${showText ? 'px-4 w-auto' : ''} bg-white/90 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
                isFavorite ? 'text-red-500' : 'text-gray-600'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
            {isLoading ? (
                <svg className={`${iconSizes[size]} animate-spin`} fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
                <>
                    <svg
                        className={iconSizes[size]}
                        fill={isFavorite ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                    </svg>
                    {showText && <span className="text-sm font-medium">{isFavorite ? 'Saved' : 'Save'}</span>}
                </>
            )}
        </button>
    );
}




