import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { RiskService } from '../services/riskService';
import { sendSuccess, sendError } from '../utils/apiResponse';

export class RiskController {
  static async predict(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return sendError(res, 'Unauthorized', 401);
      const result = await RiskService.predictAndSave(req.user.id, req.body);
      return sendSuccess(res, result, 'Assessment calculated and saved successfully!', 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to generate assessment', 400);
    }
  }

  static async getHistory(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return sendError(res, 'Unauthorized', 401);

      const options = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
        category: req.query.category as string,
        goal: req.query.goal as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        search: req.query.search as string,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
      };

      const result = await RiskService.getHistory(req.user.id, options);
      return sendSuccess(res, result.assessments, 'History retrieved', 200, result.meta);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch history', 400);
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return sendError(res, 'Unauthorized', 401);
      const assessmentId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const assessment = await RiskService.getById(
        req.user.id,
        assessmentId,
        req.user.role
      );
      return sendSuccess(res, assessment);
    } catch (error: any) {
      const statusCode = error.message.includes('Access denied') ? 403 : error.message.includes('not found') ? 404 : 400;
      return sendError(res, error.message || 'Assessment retrieval failed', statusCode);
    }
  }

  static async deleteById(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return sendError(res, 'Unauthorized', 401);
      const assessmentId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await RiskService.deleteById(
        req.user.id,
        assessmentId,
        req.user.role
      );
      return sendSuccess(res, result, 'Assessment deleted successfully');
    } catch (error: any) {
      const statusCode = error.message.includes('Access denied') ? 403 : error.message.includes('not found') ? 404 : 400;
      return sendError(res, error.message || 'Deletion failed', statusCode);
    }
  }
}
