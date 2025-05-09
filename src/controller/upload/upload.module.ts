import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { UploadAvatarController } from './upload-avatar.controller'

@Module({
  controllers: [UploadAvatarController],
  providers: [PrismaService],
})
export class UploadModule {}
