import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// Extend the Request interface to include the user property
declare module 'express' {
  export interface Request {
    user?: any;
  }
}
import * as jwt from 'jsonwebtoken';
import { UserContextService } from 'src/common/infrastructure/services/user-context.service';

@Injectable()
export class AccessTokenMiddleware implements NestMiddleware {
  constructor(private userContextService: UserContextService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      next();
    } else {
      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Token missing');
      }

      try {
        // ใช้ secret key ที่ใช้ในการเซ็น Access Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // ผสานข้อมูลผู้ใช้ที่ถอดรหัสแล้วเข้าสู่ Request
        this.userContextService.setUser(decoded);
        next();
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }
    }
  }
}
