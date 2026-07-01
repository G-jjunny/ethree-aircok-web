import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CoreValuesController } from './core-values.controller';
import { CoreValuesService } from './core-values.service';

@Module({
  imports: [PrismaModule],
  controllers: [CoreValuesController],
  providers: [CoreValuesService],
})
export class CoreValuesModule {}
