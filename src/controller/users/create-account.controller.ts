import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  avatarUrl: z.string().url().optional(),
  role: z.enum(['diretor', 'supervisor', 'colaborador', 'administrador']),
})

const bodyValidationPipe = new ZodValidationPipe(createAccountBodySchema)
type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
// @UseGuards(JwtAuthGuard)
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(
    // @CurrentUser() userload: UserPayload,
    @Body(bodyValidationPipe) body: CreateAccountBodySchema,
  ) {
    // const userLogin = await this.prisma.user.findUnique({
    //   where: { id: userload.sub },
    // })

    // console.log(userLogin, 'userLogin')

    // if (userLogin?.role !== 'administrador') {
    //   throw new NotFoundException('Usuario não é um administrador do sistema')
    // }

    const { name, email, password, role } = body

    const userWitchSameEmail = await this.prisma.user.findUnique({
      where: { email },
    })

    if (userWitchSameEmail) {
      throw new ConflictException('Email já cadastrado')
    }

    const hashedPassword = await bcrypt.hash(password, 8)

    await this.prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role,
      },
    })

    return { message: 'Conta criada com sucesso!' }
  }
}
