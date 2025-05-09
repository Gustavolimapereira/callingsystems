import { Module } from '@nestjs/common'
import { AuthenticateController } from './authenticate.controller'
import { PrismaService } from 'src/prisma/prisma.service'

@Module({
  controllers: [AuthenticateController],
  providers: [PrismaService],
})
export class AuthenticateModule {}
