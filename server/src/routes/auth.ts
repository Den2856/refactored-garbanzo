// server/src/routes/auth.ts
import { Router } from 'express'
import { register, login, me } from '../controllers/auth'
import { requireAuth } from '../middleware/authMiddleware'
import { wrapAsync } from '../utils/wrapAsync'

const router = Router()

router.post('/register', wrapAsync(register))
router.post('/login', wrapAsync(login))
router.get('/me', requireAuth, wrapAsync(me))

export default router
