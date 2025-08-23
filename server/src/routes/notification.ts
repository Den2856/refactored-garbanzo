import { Router } from 'express'
import { wrapAsync } from '../utils/wrapAsync'
import { requireAdmin, requireAuth } from '../middleware/authMiddleware'
import { getPrefs, setPrefs, stream, emit, pull, push } from '../controllers/notification'

export const notificationRouter = Router()

notificationRouter.get('/prefs',   requireAuth, wrapAsync(getPrefs))
notificationRouter.patch('/prefs', requireAuth, wrapAsync(setPrefs))
notificationRouter.get('/stream',  requireAuth, wrapAsync(stream))
notificationRouter.post('/emit',   requireAuth, requireAdmin, wrapAsync(emit))
notificationRouter.get('/pull',    requireAuth, wrapAsync(pull))
notificationRouter.post('/push',   requireAuth, wrapAsync(push))


export default notificationRouter
