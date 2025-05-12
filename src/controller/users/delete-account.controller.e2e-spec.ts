import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import * as bcrypt from 'bcrypt'
import request from 'supertest'

describe('Delete conta (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[DELETE] /accounts/:id', async () => {
    const password = '12345236'

    const user = await prisma.user.create({
      data: {
        name: 'Usuário de Teste',
        email: 'teste@hotmail.com',
        passwordHash: await bcrypt.hash(password, 8),
        role: 'administrador', // ou 'administrador', 'diretor', etc.
        avatarUrl: null,
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    const responseLogin = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        email: 'teste@hotmail.com',
        password: '12345236',
      })

    expect(responseLogin.statusCode).toBe(201)

    const response = await request(app.getHttpServer())
      .delete(`/accounts/${user.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)
  })
})
