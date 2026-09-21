import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { ProfileService } from '../services/profileService';
import { sendSuccess, sendError } from '../utils/apiResponse';

export class ProfileController {
  static async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return sendError(res, 'Unauthorized', 401);
      const data = await ProfileService.getProfile(req.user.id);
      return sendSuccess(res, data);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch profile', 400);
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return sendError(res, 'Unauthorized', 401);
      const updated = await ProfileService.updateProfile(req.user.id, req.body);
      return sendSuccess(res, updated, 'Profile updated successfully!');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to update profile', 400);
    }
  }
}
