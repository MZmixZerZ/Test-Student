import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AccessLogService } from 'src/common/infrastructure/services/access-log.service';

@Injectable()
export class AccessLogInterceptor implements NestInterceptor {
  constructor(private readonly accessLogService: AccessLogService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    // console.log('request.user', request.user);
    const user = request.user ? request.user.username : 'Anonymous';
    const startTime = Date.now(); // บันทึกเวลาเริ่มต้นในการประมวลผล

    return next.handle().pipe(
      tap(async () => {
        // คำนวณเวลาที่ใช้ในการประมวลผล
        const duration = Date.now() - startTime;
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        Logger.log(
          `[${new Date().toISOString()}] ${user} ${method} ${url} - Status: ${statusCode} - Duration: ${duration}ms`,
        );
        // บันทึกข้อมูลลงในฐานข้อมูล
        await this.accessLogService.createAccessLog(
          user,
          method,
          url,
          statusCode,
          duration,
        );
      }),
    );
  }
}
