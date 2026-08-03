import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

// ============================================================================
// TYPES
// ============================================================================

export interface AdminRequest extends Request {
  admin?: {
    id: string;
    email?: string;
  };
}

// ============================================================================
// SUPABASE AUTH CLIENT
// ============================================================================

if (!env.SUPABASE_URL) {
  throw new Error(
    '[Admin Auth] SUPABASE_URL environment variable is missing.'
  );
}

if (!env.SUPABASE_ANON_KEY) {
  throw new Error(
    '[Admin Auth] SUPABASE_ANON_KEY environment variable is missing.'
  );
}

const authClient = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);

// ============================================================================
// ADMIN AUTHENTICATION MIDDLEWARE
// ============================================================================

export const requireAdmin = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // ========================================================================
    // 1. READ AUTHORIZATION HEADER
    // ========================================================================

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.warn(
        '[Admin Auth] Authorization header missing.'
      );

      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });

      return;
    }

    if (!authHeader.startsWith('Bearer ')) {
      console.warn(
        '[Admin Auth] Invalid Authorization header format.'
      );

      res.status(401).json({
        success: false,
        error: 'Invalid authentication format',
      });

      return;
    }

    // ========================================================================
    // 2. EXTRACT ACCESS TOKEN
    // ========================================================================

    const token = authHeader.slice(7).trim();

    if (!token) {
      console.warn(
        '[Admin Auth] Bearer token is empty.'
      );

      res.status(401).json({
        success: false,
        error: 'Authentication token missing',
      });

      return;
    }

    // Do NOT print the token itself.
    console.log(
      '[Admin Auth] Received Supabase access token.'
    );

    // ========================================================================
    // 3. VERIFY TOKEN WITH SUPABASE
    // ========================================================================

    const {
      data,
      error,
    } = await authClient.auth.getUser(token);

    if (error) {
      console.error(
        '[Admin Auth] Supabase token verification failed:',
        error.message
      );

      res.status(401).json({
        success: false,
        error: 'Invalid or expired session',
      });

      return;
    }

    const user = data.user;

    if (!user) {
      console.warn(
        '[Admin Auth] Supabase returned no user.'
      );

      res.status(401).json({
        success: false,
        error: 'Invalid or expired session',
      });

      return;
    }

    console.log(
      '[Admin Auth] Supabase user authenticated:',
      user.email
    );

    // ========================================================================
    // 4. CHECK ADMIN CONFIGURATION
    // ========================================================================

    const adminUserId = env.ADMIN_USER_ID?.trim();

    if (!adminUserId) {
      console.error(
        '[Admin Auth] ADMIN_USER_ID is not configured.'
      );

      res.status(500).json({
        success: false,
        error: 'Admin authentication is not configured',
      });

      return;
    }

    // ========================================================================
    // 5. VERIFY ADMIN USER
    // ========================================================================

    if (user.id !== adminUserId) {
      console.warn(
        '[Admin Auth] Non-admin user attempted to access admin API:',
        user.email
      );

      res.status(403).json({
        success: false,
        error: 'Administrator access required',
      });

      return;
    }

    // ========================================================================
    // 6. AUTHORIZED
    // ========================================================================

    req.admin = {
      id: user.id,
      email: user.email,
    };

    console.log(
      '[Admin Auth] Administrator authorized:',
      user.email
    );

    next();
  } catch (error) {
    console.error(
      '[Admin Auth] Unexpected authentication error:',
      error
    );

    res.status(500).json({
      success: false,
      error: 'Authentication failed',
    });
  }
};
