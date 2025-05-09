import { Module } from '@nestjs/common'
import { CreateAccountController } from './create-account.controller'
import { PrismaService } from 'src/prisma/prisma.service'
import { ListAllAccountController } from './listAll-account.controller'
import { UpdateAccountController } from './update-account.controller'
import { DeleteAccountController } from './delete-account.controller'

@Module({
  controllers: [
    CreateAccountController,
    ListAllAccountController,
    UpdateAccountController,
    DeleteAccountController,
  ],
  providers: [PrismaService],
})
export class UserModule {}
