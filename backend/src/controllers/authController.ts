import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { ENV } from '../config/env';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);

      // Set HTTP-only secure cookie
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: ENV.NODE_ENV === 'production',
        sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return sendSuccess(
        res,
        result,
        'Registration successful! Welcome to RiskWise.',
        201
      );
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        return sendError(res, error.message, 409);
      }
      return sendError(res, error.message || 'Registration failed', 400);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);

      const maxAge = req.body.rememberMe
        ? 30 * 24 * 60 * 60 * 1000 // 30 days
        : 7 * 24 * 60 * 60 * 1000; // 7 days

      res.cookie('token', result.token, {
        httpOnly: true,
        secure: ENV.NODE_ENV === 'production',
        sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge,
      });

      return sendSuccess(res, result, 'Logged in successfully!');
    } catch (error: any) {
      return sendError(res, error.message || 'Invalid credentials', 401);
    }
  }

  static async logout(req: Request, res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
      sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    return sendSuccess(res, null, 'Logged out successfully');
  }

  static async me(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return sendError(res, 'Unauthorized', 401);
      }

      const user = await AuthService.getMe(req.user.id);
      return sendSuccess(res, { user });
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch user', 400);
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    // Educational simulated password reset response
    return sendSuccess(
      res,
      { resetToken: 'demo-reset-token-' + Date.now() },
      `If an account with ${email} exists, password reset instructions have been dispatched.`
    );
  }

  static async resetPassword(req: Request, res: Response) {
    return sendSuccess(
      res,
      null,
      'Password updated successfully. You can now log in with your new password.'
    );
  }
}
