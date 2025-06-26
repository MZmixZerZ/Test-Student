import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { LineService } from './line.service';

@Controller('line')
export class LineController {
  constructor(private readonly lineService: LineService) {}

  @Post('webhook')
  @HttpCode(200) // ให้แน่ใจว่าตอบกลับ 200 OK เสมอ
  async handleWebhook(@Body() body: any) {
    console.log('LINE Webhook received:', JSON.stringify(body)); // สำหรับ debug log
    if (!body || !body.events) {
      return { status: 'no events' };
    }
    await this.lineService.handleEvents(body.events);
    return { status: 'ok' };
  }
}