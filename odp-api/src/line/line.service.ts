import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { PersonRepository } from '../person/infrastructure/repositories/person.repository';

@Injectable()
export class LineService {
  private readonly REPLY_ENDPOINT = 'https://api.line.me/v2/bot/message/reply';
  private readonly CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  private readonly logger = new Logger(LineService.name);

  constructor(
    private readonly personRepository: PersonRepository
  ) {
    this.logger.log('DEBUG ENV LINE_CHANNEL_ACCESS_TOKEN:', process.env.LINE_CHANNEL_ACCESS_TOKEN);
  }

  async handleEvents(events: any[]) {
    if (!this.CHANNEL_ACCESS_TOKEN) {
      this.logger.error('LINE_CHANNEL_ACCESS_TOKEN is not set');
      return { status: 'error', message: 'LINE_CHANNEL_ACCESS_TOKEN is not set' };
    }

    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        const replyToken = event.replyToken;
        const userMessage = event.message.text.trim();

        this.logger.log(`Received message: ${userMessage}`);

        // ถ้าข้อความเป็นชื่อ-นามสกุล ให้ค้นหาในฐานข้อมูล
        if (userMessage.includes(' ')) {
          const [name, surname] = userMessage.split(' ');
          const persons = await this.personRepository.findByNameAndSurname(name, surname);
          if (persons.length > 0) {
            // สร้างข้อความรายละเอียดแต่ละคน
            const details = persons.map(p => 
              `ชื่อจริง: ${p.name}\n` +
              `นามสกุล: ${p.surname}\n` +
              `วันเกิด: ${p.dob || '-'}\n` +
              `เบอร์โทร: ${p.phone || '-'}\n` +
              `สัญชาติ: ${p.nationality || '-'}\n` +
              `เชื้อชาติ: ${p.citizen || '-'}\n` +
              `ศาสนา: ${p.religion || '-'}\n` +
              `ที่อยู่: ${p.address || '-'}\n` +
              `----------------------`
            ).join('\n');
            await this.replyMessage(replyToken, `พบข้อมูลนักเรียน:\n${details}`);
          } else {
            await this.replyMessage(replyToken, 'ไม่พบข้อมูลในระบบ');
          }
        } else {
          await this.replyMessage(replyToken, `คุณพิมพ์ว่า: ${userMessage}`);
        }
      }
    }
    return { status: 'ok' };
  }

  private async replyMessage(replyToken: string, text: string) {
    try {
      await axios.post(
        this.REPLY_ENDPOINT,
        {
          replyToken,
          messages: [{ type: 'text', text }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.CHANNEL_ACCESS_TOKEN}`,
          },
        },
      );
      this.logger.log('Reply sent to LINE successfully');
    } catch (error) {
      this.logger.error('Error sending reply to LINE:', error?.response?.data || error.message);
    }
  }
}