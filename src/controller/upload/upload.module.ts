import { Module } from '@nestjs/common'
import { UploadAvatarController } from './upload-avatar.controller'
import { UserModule } from '../users/user.module'

@Module({
  controllers: [UploadAvatarController],
  imports: [UserModule],
  providers: [],
})
export class UploadModule {}
