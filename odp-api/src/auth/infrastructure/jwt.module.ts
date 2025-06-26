import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    NestJwtModule.register({
      secret: process.env.JWT_SECRET || 'changeme', // ควรตั้งค่า JWT_SECRET ใน .env
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [JwtStrategy],
  exports: [NestJwtModule],
})
export class JwtModule {}