import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'

export function AvatarUploadInterceptor() {
  return FileInterceptor('avatar', {
    storage: diskStorage({
      destination: './uploads/avatars',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        const ext = extname(file.originalname)
        callback(null, `avatar-${uniqueSuffix}${ext}`)
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        return cb(new Error('Apenas arquivos de imagem são permitidos!'), false)
      }
      cb(null, true)
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  })
}
