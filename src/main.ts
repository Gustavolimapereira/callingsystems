import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { Env } from './env'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.enableCors()

  const configService = app.get<ConfigService<Env, true>>(ConfigService)
  const port = configService.get('PORT', { infer: true })

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/avatars',
  })

  console.log('servidor rodando na porta:', port)
  await app.listen(port, '0.0.0.0')
}
bootstrap()
