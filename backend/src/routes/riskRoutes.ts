import { Router } from 'express';
import { RiskController } from '../controllers/riskController';
import { authenticate } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { riskAssessmentSchema } from '../validators/riskValidator';

const router = Router();

router.use(authenticate);

router.post('/predict', validate(riskAssessmentSchema), RiskController.predict);
router.get('/history', RiskController.getHistory);
router.get('/:id', RiskController.getById);
router.delete('/:id', RiskController.deleteById);

export default router;
