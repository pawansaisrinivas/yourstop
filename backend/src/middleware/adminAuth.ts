import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

export interface AdminRequest extends Request {
  admin?: {
    id: string;
    email?: string;
  };
}

// Use anon key for validating incoming user sessions.
// Do NOT use the service-role client as the user's session.
const authClient = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export const requireAdmin = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // -----------------------------------------------------
    // Check Authorization header
    // -----------------------------------------------------

    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });

      return;
    }

    const token = authHeader.substring(7).trim();

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Authentication token missing',
      });

      return;
    }

    // -----------------------------------------------------
    // Validate Supabase access token
    // -----------------------------------------------------

    const {
      data: { user },
      error,
    } = await authClient.auth.getUser(token);

    if (error || !user) {
      console.warn(
        '[Admin Auth] Invalid token:',
        error?.message
      );

      res.status(401).json({
        success: false,
        error: 'Invalid or expired session',
      });

      return;
    }

    // -----------------------------------------------------
    // Make sure ADMIN_USER_ID exists
    // -----------------------------------------------------

    if (!env.ADMIN_USER_ID) {
      console.error(
        '[Admin Auth] ADMIN_USER_ID is not configured.'
      );

      res.status(500).json({
        success: false,
        error: 'Admin authentication is not configured',
      });

      return;
    }

    // -----------------------------------------------------
    // SINGLE ADMIN CHECK
    // -----------------------------------------------------

    if (user.id !== env.ADMIN_USER_ID) {
      console.warn(
        `[Admin Auth] Access denied for ${user.email}`
      );

      res.status(403).json({
        success: false,
        error: 'Administrator access required',
      });

      return;
    }

    // -----------------------------------------------------
    // Authorized
    // -----------------------------------------------------

    req.admin = {
      id: user.id,
      email: user.email,
    };

    next();
  } catch (error) {
    console.error('[Admin Auth Error]', error);

    res.status(500).json({
      success: false,
      error: 'Authentication failed',
    });
  }
};