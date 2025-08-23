import { Router, Request, Response } from 'express';
import { Charger, ICharger } from '../models/charger';

const router = Router();

// GET /api/chargers
router.get('/', async (_req: Request, res: Response) => {
  try {
    const chargers: ICharger[] = await Charger.find().sort({ createdAt: 1 });
    // console.log('📦 chargers from DB:', chargers)
    res.json(chargers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
