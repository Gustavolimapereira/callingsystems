// src/controller/upload/upload-avatar.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Req,
  UseGuards,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path' // ajuste conforme seu guard
import { UsersService } from '../users/users.service'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'

@Controller('upload-avatar')
export class UploadAvatarController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard) // Use o guard apropriado para autenticação
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9)
          const ext = extname(file.originalname)
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`)
        },
      }),
    }),
  )
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: RequestWithUser, // ou crie um tipo `RequestWithUser`
  ) {
    const userId = request.user.sub // ID extraído do JWT

    const result = await this.usersService.updateAvatar(userId, file.filename)
    return { message: 'Avatar atualizado com sucesso', user: result }
  }
}
