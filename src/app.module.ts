import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { envSchema } from './env'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { AuthenticateController } from './controller/authenticate/authenticate.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [AuthenticateController],
  providers: [PrismaService],
})
export class AppModule {}
