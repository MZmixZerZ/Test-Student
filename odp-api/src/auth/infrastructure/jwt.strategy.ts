import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'changeme', // ควรตั้งค่า JWT_SECRET ใน .env
    });
  }

  async validate(payload: any) {
    // payload คือข้อมูลที่ sign ใน jwtService.sign()
    return { ...payload };
  }
}