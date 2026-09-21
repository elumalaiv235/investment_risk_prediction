import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/tokenUtils';
import { prisma } from '../config/db';
import { sendError } from '../utils/apiResponse';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    preferredCurrency?: string | null;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    // Check cookies
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Check Authorization header
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendError(res, 'Authentication required. Please log in.', 401);
    }

    const payload = verifyToken(token);
    if (!payload) {
      return sendError(res, 'Session expired or invalid. Please log in again.', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { profile: true },
    });

    if (!user) {
      return sendError(res, 'User account no longer exists.', 401);
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      preferredCurrency: user.profile?.preferredCurrency || 'USD',
    };

    next();
  } catch (error) {
    return sendError(res, 'Authentication failed', 401);
  }
};

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return sendError(res, 'Access denied. Administrator privileges required.', 403);
  }
  next();
};
