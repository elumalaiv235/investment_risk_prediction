import { Router } from 'express';
import { ProfileController } from '../controllers/profileController';
import { authenticate } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { updateProfileSchema } from '../validators/profileValidator';

const router = Router();

router.use(authenticate);

router.get('/', ProfileController.getProfile);
router.put('/', validate(updateProfileSchema), ProfileController.updateProfile);

export default router;
