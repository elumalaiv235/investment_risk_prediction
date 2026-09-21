import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { AdminService } from '../services/adminService';
import { sendSuccess, sendError } from '../utils/apiResponse';

export class AdminController {
  static async getStats(req: AuthenticatedRequest, res: Response) {
    try {
      const stats = await AdminService.getStats();
      return sendSuccess(res, stats);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch admin statistics', 400);
    }
  }

  static async getUsers(req: AuthenticatedRequest, res: Response) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

      const result = await AdminService.getUsers(page, limit);
      return sendSuccess(res, result.users, 'Users retrieved', 200, result.meta);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch users', 400);
    }
  }

  static async updateUserRole(req: AuthenticatedRequest, res: Response) {
    try {
      const { role } = req.body;
      const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
      const updated = await AdminService.updateUserRole(userId, role);
      return sendSuccess(res, updated, `User role updated to ${role}`);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to update user role', 400);
    }
  }
}
