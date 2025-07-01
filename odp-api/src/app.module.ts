import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AccessTokenMiddleware } from './common/presentation/middlewares/access-token.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { PersonModule } from './person/person.module';
import { LineController } from './line/line.controller';
import { LineService } from './line/line.service';
import { MemberModule } from './member/member.module';
import { DashboardModule } from './dashboard/dashboard.module';

dotenv.config(); // โหลดตัวแปรจากไฟล์ .env ก่อน

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI), // เชื่อมต่อฐานข้อมูล MongoDB
    CommonModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule,
    PersonModule, // ต้อง import PersonModule เพื่อให้ LineService ใช้ PersonRepository ได้
    MemberModule, // ต้อง import MemberModule เพื่อให้ LineService ใช้ MemberRepository ได้
    DashboardModule, // Add dashboard module
  ],
  controllers: [
    LineController,
  ],
  providers: [
    LineService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AccessTokenMiddleware)
      .exclude(
        { path: 'auth/signin', method: RequestMethod.POST },
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'line/webhook', method: RequestMethod.POST },
        { path: 'api/line/webhook', method: RequestMethod.POST },
        // เพิ่ม path สำหรับ health check หรือ public endpoint อื่น ๆ ที่ไม่ต้องใช้ token ได้ที่นี่
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
