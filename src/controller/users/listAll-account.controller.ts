import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  UseGuards,
} from '@nestjs/common'
import { CurrentUser } from 'src/auth/current-user-decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserPayload } from 'src/auth/jwt.strategy'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/accounts')
@UseGuards(JwtAuthGuard)
export class ListAllAccountController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() userLoad: UserPayload) {
    const userLogin = await this.prisma.user.findUnique({
      where: { id: userLoad.sub },
    })

    if (userLogin?.role !== 'administrador') {
      throw new NotFoundException('Usuario não é um administrador do sistema')
    }

    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        sector: true,
        avatarUrl: true,
      },
    })

    return { users }
  }
}
