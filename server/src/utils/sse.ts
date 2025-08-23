import { Response } from 'express'

type Client = { userId: string; res: Response }

class SseBroker {
  private clients = new Map<string, Set<Response>>() // userId -> set(res)

  add(userId: string, res: Response) {
    if (!this.clients.has(userId)) this.clients.set(userId, new Set())
    this.clients.get(userId)!.add(res)
  }

  remove(userId: string, res: Response) {
    this.clients.get(userId)?.delete(res)
    if (this.clients.get(userId)?.size === 0) this.clients.delete(userId)
  }

  send(userId: string, event: string, data: any) {
    const set = this.clients.get(userId)
    if (!set) return
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
    for (const res of set) res.write(payload)
  }
}

export const sse = new SseBroker()

export function sseHeaders() {
  return {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  }
}
