import { Global, Module } from '@nestjs/common';
import { AccessLogService } from './infrastructure/services/access-log.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AccessLogSchema } from './infrastructure/persistence/access-log.schema';
import { UserContextService } from './infrastructure/services/user-context.service';
import * as dotenv from 'dotenv';

dotenv.config(); // โหลดตัวแปรจากไฟล์ .env ก่อน

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'AccessLog', schema: AccessLogSchema }]),
  ],
  providers: [AccessLogService, UserContextService],
  exports: [AccessLogService, UserContextService],
})
export class CommonModule {}
