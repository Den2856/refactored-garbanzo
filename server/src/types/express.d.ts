// src/types/express/index.d.ts
import type { IUser } from '../../models/user'

declare global {
  namespace Express {
    interface Request {
      /**
       * Заполняется в authMiddleware → payload.id
       */
      userId?: string
    }
  }
}

export {}
