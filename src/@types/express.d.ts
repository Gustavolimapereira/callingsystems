import { Request } from 'express'

declare global {
  interface RequestWithUser extends Request {
    user: {
      sub: string
      email: string
    }
  }
}

export {} // <- para tornar isso um módulo válido
