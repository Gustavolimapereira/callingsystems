import { Module } from '@nestjs/common'
import { CreateSectorController } from './create-sector.controller'
import { PrismaService } from 'src/prisma/prisma.service'

@Module({
  controllers: [CreateSectorController],
  providers: [PrismaService],
  exports: [],
})
export class SectorModule {}
