// server/src/utils/wrapAsync.ts
import { Request, Response, NextFunction, RequestHandler } from 'express'

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => void | Promise<any>

/**
 * Оборачивает sync/async контроллер в RequestHandler и ловит ошибки.
 * Не заставляет контроллер возвращать Promise<void> — подойдёт и Promise<Response>.
 */
export function wrapAsync(fn: AsyncHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
