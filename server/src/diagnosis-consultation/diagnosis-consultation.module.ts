import { Module } from '@nestjs/common';
import { DiagnosisConsultationController } from './diagnosis-consultation.controller';
import { DiagnosisConsultationService } from './diagnosis-consultation.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DiagnosisConsultationController],
  providers: [DiagnosisConsultationService],
})
export class DiagnosisConsultationModule {}
