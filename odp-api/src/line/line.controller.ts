import { Controller, Post, Body, HttpCode, Logger, Headers } from '@nestjs/common';
import { LineService } from './line.service';
import * as crypto from 'crypto';

@Controller('line')
export class LineController {
  private readonly logger = new Logger(LineController.name);
  private readonly CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;

  constructor(private readonly lineService: LineService) {}

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Body() body: any,
    @Headers('x-line-signature') signature: string
  ) {
    this.logger.log('LINE Webhook received');
    
    // Verify LINE signature for security
    if (this.CHANNEL_SECRET && signature) {
      const hash = crypto
        .createHmac('sha256', this.CHANNEL_SECRET)
        .update(JSON.stringify(body))
        .digest('base64');
      
      if (signature !== hash) {
        this.logger.error('Invalid LINE signature');
        return { status: 'error', message: 'Invalid signature' };
      }
    }

    if (!body || !body.events || body.events.length === 0) {
      this.logger.log('No events to process');
      return { status: 'no events' };
    }

    try {
      const result = await this.lineService.handleEvents(body.events);
      this.logger.log(`Processed ${body.events.length} events successfully`);
      return result;
    } catch (error) {
      this.logger.error('Error processing LINE webhook:', error instanceof Error ? error.message : 'Unknown error');
      return { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}