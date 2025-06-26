import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AccessLogInterceptor } from './common/presentation/interceptors/access-log.interceptor';
import { AccessLogService } from './common/infrastructure/services/access-log.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:4200', // หรือ ['http://localhost:4200']
    credentials: true,
  });
  const accessLogService = app.get(AccessLogService);
  app.useGlobalInterceptors(new AccessLogInterceptor(accessLogService)); // ตั้งค่า Interceptor แบบ global

  // ตั้งค่า Global Prefix
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // ตั้งค่า Validation Pipe แบบ global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // ลบคีย์ที่ไม่ถูกต้องออกจาก DTO
      forbidNonWhitelisted: false, // ถ้ามีคีย์ที่ไม่ถูกต้อง ให้แสดงข้อผิดพลาด
      transform: true, // แปลงข้อมูลเป็นประเภทที่กำหนดใน DTO
    }),
  );

  // ตั้งค่า Swagger
  const config = new DocumentBuilder()
    .setTitle('BE Service API')
    .setDescription('API documentation for the BE service')
    .setVersion('1.0')
    .addBearerAuth() // สำหรับใช้ JWT ในการยืนยันตัวตน
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}
bootstrap();
