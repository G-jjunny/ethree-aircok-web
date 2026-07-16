import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UploadModule } from '../upload/upload.module';
import { AirDevicesController } from './air-devices.controller';
import { AirDevicesService } from './air-devices.service';

@Module({
  imports: [PrismaModule, UploadModule],
  controllers: [AirDevicesController],
  providers: [AirDevicesService],
})
export class AirDevicesModule {}
