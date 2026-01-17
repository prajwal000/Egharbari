'use client';

import { useState, useEffect } from 'react';

interface HumanVerificationProps {
    onVerify: (verified: boolean) => void;
}

export default function HumanVerification({ onVerify }: HumanVerificationProps) {
    const [isVerified, setIsVerified] = useState(false);

    const handleVerify = () => {
        setIsVerified(true);
        onVerify(true);
    };

    return (
        <div className="p-4 border-2 border-gray-200 rounded-xl bg-gray-50">
            <label className="flex items-center gap-3 cursor-pointer group">
                <input
                    type="checkbox"
                    checked={isVerified}
                    onChange={handleVerify}
                    className="w-5 h-5 text-[#9ac842] border-gray-300 rounded focus:ring-[#9ac842] focus:ring-2 cursor-pointer"
                    required
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 select-none">
                    I&apos;m not a robot - I verify that I&apos;m a human submitting this inquiry
                </span>
            </label>
            <p className="text-xs text-gray-500 mt-2 ml-8">
                This helps us prevent spam and ensure genuine inquiries
            </p>
        </div>
    );
}

