import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { CurrentUser } from 'src/auth/current-user-decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserPayload } from 'src/auth/jwt.strategy'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { deleteFile } from 'src/utils/avatar-delete-file'
import { AvatarUploadInterceptor } from 'src/utils/avatar-upload.interceptor'
import { z } from 'zod'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: z.enum(['diretor', 'supervisor', 'colaborador', 'administrador']),
})

const bodyValidationPipe = new ZodValidationPipe(createAccountBodySchema)
type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
@UseGuards(JwtAuthGuard)
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UseInterceptors(AvatarUploadInterceptor)
  async handle(
    @CurrentUser() userload: UserPayload,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateAccountBodySchema,
  ) {
    const userLogin = await this.prisma.user.findUnique({
      where: { id: userload.sub },
    })

    if (userLogin?.role !== 'administrador') {
      throw new NotFoundException('Usuário não é um administrador do sistema')
    }

    const parsed = createAccountBodySchema.safeParse(body)
    if (!parsed.success) {
      throw new BadRequestException({
        message: 'Falha na validação teste',
        statusCode: 400,
        errors: {
          name: 'ZodValidationError',
          details: parsed.error.errors,
        },
      })
    }

    const userWitchSameEmail = await this.prisma.user.findUnique({
      where: { email },
    })

    if (userWitchSameEmail) {
      if (file) {
        await deleteFile(`uploads/avatars/${file.filename}`)
      }

      throw new ConflictException('Email já cadastrado')
    }

    const hashedPassword = await bcrypt.hash(password, 8)
    const avatarUrl = file ? `/uploads/avatars/${file.filename}` : null

    await this.prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role,
        avatarUrl,
      },
    })
  }
}
