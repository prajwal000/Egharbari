/**
 * Email validation utilities to prevent spam and fake emails
 */

// List of disposable/temporary email domains to block
const disposableEmailDomains = [
    'tempmail.com',
    'throwaway.email',
    'guerrillamail.com',
    'mailinator.com',
    '10minutemail.com',
    'trashmail.com',
    'temp-mail.org',
    'fakeinbox.com',
    'maildrop.cc',
    'yopmail.com',
    'getnada.com',
    'tempmailaddress.com',
    'emailondeck.com',
    'sharklasers.com',
    'guerrillamail.info',
    'grr.la',
    'spam4.me',
    'mailnesia.com',
    'mintemail.com',
];

/**
 * Check if email domain is disposable/temporary
 */
export function isDisposableEmail(email: string): boolean {
    const domain = email.toLowerCase().split('@')[1];
    return disposableEmailDomains.includes(domain);
}

/**
 * Validate email format and domain
 */
export function validateEmail(email: string): { valid: boolean; message?: string } {
    // Check email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, message: 'Invalid email format' };
    }

    // Check for disposable email
    if (isDisposableEmail(email)) {
        return { valid: false, message: 'Temporary/disposable email addresses are not allowed. Please use a valid email address.' };
    }

    // Check for common patterns that indicate fake emails
    const suspiciousPatterns = [
        /test@test\./i,
        /example@/i,
        /fake@/i,
        /spam@/i,
        /abuse@/i,
        /noreply@/i,
    ];

    for (const pattern of suspiciousPatterns) {
        if (pattern.test(email)) {
            return { valid: false, message: 'Please use a valid email address' };
        }
    }

    return { valid: true };
}

/**
 * Rate limiting storage for email submissions
 */
const submissionTimestamps: Map<string, number[]> = new Map();

/**
 * Check if an email/IP has exceeded rate limit
 * @param identifier - Email or IP address
 * @param maxSubmissions - Maximum submissions allowed
 * @param timeWindow - Time window in milliseconds (default: 1 hour)
 */
export function checkRateLimit(
    identifier: string,
    maxSubmissions: number = 3,
    timeWindow: number = 3600000
): { allowed: boolean; message?: string; retryAfter?: number } {
    const now = Date.now();
    const timestamps = submissionTimestamps.get(identifier) || [];

    // Remove old timestamps outside the time window
    const recentTimestamps = timestamps.filter(ts => now - ts < timeWindow);

    if (recentTimestamps.length >= maxSubmissions) {
        const oldestTimestamp = Math.min(...recentTimestamps);
        const retryAfter = Math.ceil((oldestTimestamp + timeWindow - now) / 1000 / 60); // minutes

        return {
            allowed: false,
            message: `Too many submissions. Please try again in ${retryAfter} minutes.`,
            retryAfter,
        };
    }

    // Update timestamps
    recentTimestamps.push(now);
    submissionTimestamps.set(identifier, recentTimestamps);

    return { allowed: true };
}

/**
 * Generate a simple verification token for client-side verification
 */
export function generateVerificationToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Verify if the submission is from a human (basic bot detection)
 */
export function verifyHumanSubmission(data: {
    startTime: number;
    endTime: number;
    verificationAnswer?: string;
}): { verified: boolean; message?: string } {
    // Check if form was filled too quickly (likely a bot)
    const fillTime = data.endTime - data.startTime;
    const minimumTime = 3000; // 3 seconds
    const maximumTime = 3600000; // 1 hour

    if (fillTime < minimumTime) {
        return { verified: false, message: 'Form submitted too quickly. Please try again.' };
    }

    if (fillTime > maximumTime) {
        return { verified: false, message: 'Session expired. Please refresh and try again.' };
    }

    return { verified: true };
}

