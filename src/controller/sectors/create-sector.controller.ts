import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common'
import { CurrentUser } from 'src/auth/current-user-decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserPayload } from 'src/auth/jwt.strategy'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const createSectorBodySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(createSectorBodySchema)
type CreateSectorBodySchema = z.infer<typeof createSectorBodySchema>

@Controller('/sectors')
@UseGuards(JwtAuthGuard)
export class CreateSectorController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() userload: UserPayload,
    @Body(bodyValidationPipe) body: CreateSectorBodySchema,
  ) {
    const userLogin = await this.prisma.user.findUnique({
      where: { id: userload.sub },
    })

    if (userLogin?.role !== 'administrador') {
      throw new NotFoundException('Usuario não é um administrador do sistema')
    }

    const { name, description } = body

    const sectorWitchSameName = await this.prisma.sector.findUnique({
      where: { name },
    })

    if (sectorWitchSameName) {
      throw new ConflictException('Setor já cadastrado')
    }

    await this.prisma.sector.create({
      data: {
        name,
        description,
      },
    })
  }
}
