// src/@types/express.d.ts
import { Request } from 'express'

export interface RequestWithUser extends Request {
  user: {
    sub: string
    email: string // ou outros dados que vêm do JWT
    // role?: 'admin' | 'user' etc.
  }
}
