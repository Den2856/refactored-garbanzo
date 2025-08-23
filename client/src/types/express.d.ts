import { IUser } from '../../models/user'

declare global {
  namespace Express {
    interface Request {
      // то, что кладёт ваш authMiddleware, как минимум id
      user?: Pick<IUser, 'id' | 'email' | 'name'>
    }
  }
}

// нужно, чтобы TS увидел это объявление
export {}
