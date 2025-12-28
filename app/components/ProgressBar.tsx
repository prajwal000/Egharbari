'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Configure NProgress
NProgress.configure({ 
    showSpinner: false,
    trickleSpeed: 200,
    minimum: 0.08,
    easing: 'ease',
    speed: 500
});

export default function ProgressBar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Start progress bar when route changes
        NProgress.start();
        
        // Complete progress bar after a short delay
        const timeout = setTimeout(() => {
            NProgress.done();
        }, 100);

        return () => {
            clearTimeout(timeout);
            NProgress.done();
        };
    }, [pathname, searchParams]);

    return null;
}

