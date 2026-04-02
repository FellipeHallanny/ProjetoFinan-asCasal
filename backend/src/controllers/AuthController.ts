import { Response } from 'express';
import { BaseController } from './BaseController';
import { AuthService } from '@/services/AuthService';
import { createFamilySchema, joinFamilySchema } from '@/validators/auth.schema';
import { AuthenticatedRequest } from '@/middleware/authMiddleware';

export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async createSpace(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { familyName } = createFamilySchema.parse(req.body);
      const result = await this.authService.createSpace(req.user!.uid, req.user!.email, familyName);
      this.handleSuccess(res, result, 201, 'Family space created successfully');
    } catch (error) {
      this.handleError(error, res, 'AuthController.createSpace');
    }
  }

  async joinSpace(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { inviteCode } = joinFamilySchema.parse(req.body);
      const result = await this.authService.joinSpace(req.user!.uid, req.user!.email, inviteCode);
      this.handleSuccess(res, result, 200, 'Joined family space successfully');
    } catch (error) {
      this.handleError(error, res, 'AuthController.joinSpace');
    }
  }
}
