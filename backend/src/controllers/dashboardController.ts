import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { DashboardService } from '../services/dashboardService';
import { sendSuccess, sendError } from '../utils/apiResponse';

export class DashboardController {
  static async getSummary(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return sendError(res, 'Unauthorized', 401);
      const summary = await DashboardService.getSummary(req.user.id);
      return sendSuccess(res, summary);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch dashboard summary', 400);
    }
  }
}
