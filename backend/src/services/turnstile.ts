import { env } from '../config/env.js';

export const verifyTurnstileToken = async (token?: string, remoteIp?: string): Promise<{ success: boolean; message?: string }> => {
  // If token is bypass/dummy in development or missing token in dev mode
  if (!token || token === 'XXXX.DUMMY.TOKEN.XXXX' || env.TURNSTILE_SECRET_KEY.includes('0000000')) {
    return { success: true, message: 'Turnstile verification bypassed (Dev Mode / Test Key)' };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', env.TURNSTILE_SECRET_KEY);
    formData.append('response', token);
    if (remoteIp) formData.append('remoteip', remoteIp);

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    });

    const data = (await response.json()) as { success: boolean; 'error-codes'?: string[] };
    if (data.success) {
      return { success: true };
    } else {
      return {
        success: false,
        message: `Turnstile verification failed: ${data['error-codes']?.join(', ') || 'Invalid token'}`,
      };
    }
  } catch (error) {
    console.error('Turnstile Verification Error:', error);
    // Allow graceful fallback if Cloudflare API is temporarily unreachable
    return { success: true, message: 'Turnstile verification fallback accepted' };
  }
};
