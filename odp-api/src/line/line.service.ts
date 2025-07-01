import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { PersonRepository } from '../person/infrastructure/repositories/person.repository';
import { MemberRepository } from '../member/infrastructure/repositories/member.repository';

@Injectable()
export class LineService {
  private readonly REPLY_ENDPOINT = 'https://api.line.me/v2/bot/message/reply';
  private readonly PUSH_ENDPOINT = 'https://api.line.me/v2/bot/message/push';
  private readonly CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  private readonly logger = new Logger(LineService.name);

  constructor(
    private readonly personRepository: PersonRepository,
    private readonly memberRepository: MemberRepository
  ) {
    if (!this.CHANNEL_ACCESS_TOKEN) {
      this.logger.error('LINE_CHANNEL_ACCESS_TOKEN is not configured');
    }
  }

  async handleEvents(events: any[]): Promise<{ status: string; message?: string }> {
    if (!this.CHANNEL_ACCESS_TOKEN) {
      this.logger.error('LINE_CHANNEL_ACCESS_TOKEN is not configured');
      return { status: 'error', message: 'LINE_CHANNEL_ACCESS_TOKEN is not configured' };
    }

    try {
      for (const event of events) {
        await this.processEvent(event);
      }
      return { status: 'ok' };
    } catch (error) {
      this.logger.error('Error handling LINE events:', error instanceof Error ? error.message : 'Unknown error');
      return { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  private async processEvent(event: any): Promise<void> {
    if (event.type === 'message' && event.message.type === 'text') {
      const replyToken = event.replyToken;
      const userMessage = event.message.text.trim();
      const userId = event.source.userId;

      this.logger.log(`Received message from ${userId}: ${userMessage}`);

      // ถ้าข้อความเป็นชื่อ-นามสกุล ให้ค้นหาในฐานข้อมูล
      if (userMessage.includes(' ')) {
        await this.handleNameSearch(replyToken, userMessage);
      } else {
        // ข้อความอื่นๆ
        await this.handleOtherMessage(replyToken, userMessage);
      }
    } else if (event.type === 'follow') {
      // User follows the bot
      await this.handleFollow(event.replyToken);
    } else if (event.type === 'unfollow') {
      // User unfollows the bot
      this.logger.log(`User ${event.source.userId} unfollowed the bot`);
    }
  }

  private async handleNameSearch(replyToken: string, message: string): Promise<void> {
    const [name, ...surnameParts] = message.split(' ');
    const surname = surnameParts.join(' ');
    
    try {
      // ค้นหาในตาราง Person
      const persons = await this.personRepository.findByNameAndSurname(name, surname);
      
      // ค้นหาในตาราง Member โดยใช้ contactPerson
      const members = await this.memberRepository.findByContactPersonName(name, surname);
      
      let responseMessage = '';
      
      // แสดงผลข้อมูล Person
      if (persons.length > 0) {
        const personDetails = persons.map(p => 
          `� ข้อมูลนักเรียน/บุคคล\n` +
          `� ชื่อ: ${p.name} ${p.surname}\n` +
          `� รหัส: ${p.n_id || '-'}\n` +
          `�🎂 วันเกิด: ${p.dob || '-'}\n` +
          `📞 เบอร์โทร: ${p.phone || '-'}\n` +
          `🌍 สัญชาติ: ${p.nationality || '-'}\n` +
          `🏛️ เชื้อชาติ: ${p.citizen || '-'}\n` +
          `🙏 ศาสนา: ${p.religion || '-'}\n` +
          `🏠 ที่อยู่: ${p.address || '-'}`
        ).join('\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n');
        
        responseMessage += `🔍 พบข้อมูลนักเรียน/บุคคล ${persons.length} รายการ\n\n${personDetails}`;
      }
      
      // แสดงผลข้อมูล Member
      if (members.length > 0) {
        if (responseMessage) responseMessage += '\n\n';
        
        const memberDetails = members.map(m => 
          `👥 ข้อมูลสมาชิก\n` +
          `📝 รหัสสมาชิก: ${m.memberid || '-'}\n` +
          `🆔 เลขบัตรประชาชน: ${m.idCard || '-'}\n` +
          `🏢 องค์กร: ${m.organization || '-'}\n` +
          `👤 ผู้ติดต่อ: ${m.contactPerson || '-'}\n` +
          `📞 เบอร์โทรติดต่อ: ${m.contactPhone || '-'}`
        ).join('\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n');
        
        responseMessage += `🔍 พบข้อมูลสมาชิก ${members.length} รายการ\n\n${memberDetails}`;
      }
      
      // ถ้าไม่พบข้อมูลทั้งสองตาราง
      if (persons.length === 0 && members.length === 0) {
        responseMessage = '❌ ไม่พบข้อมูลในระบบ\nกรุณาตรวจสอบชื่อ-นามสกุลอีกครั้ง\n\n💡 สามารถค้นหาได้ทั้ง:\n• ข้อมูลนักเรียน/บุคคล\n• ข้อมูลสมาชิก';
      }
      
      await this.replyMessage(replyToken, responseMessage);
      
    } catch (error) {
      this.logger.error('Error searching person/member:', error instanceof Error ? error.message : 'Unknown error');
      await this.replyMessage(replyToken, '❌ เกิดข้อผิดพลาดในการค้นหาข้อมูล');
    }
  }

  private async handleOtherMessage(replyToken: string, message: string): Promise<void> {
    if (message.toLowerCase() === 'help' || message === 'ช่วยเหลือ') {
      const helpText = `📖 วิธีใช้งาน LINE Bot\n\n` +
        `🔍 การค้นหาข้อมูล:\n` +
        `• พิมพ์ "ชื่อ นามสกุล" เพื่อค้นหาข้อมูล\n` +
        `• ระบบจะค้นหาทั้งข้อมูลนักเรียน/บุคคล และสมาชิก\n\n` +
        `💡 คำสั่งอื่นๆ:\n` +
        `• "help" หรือ "ช่วยเหลือ" - ดูวิธีใช้งาน\n\n` +
        `📝 ตัวอย่าง:\n` +
        `• สมชาย ใจดี\n` +
        `• นางสาว สมหญิง รักดี`;
      await this.replyMessage(replyToken, helpText);
    } else {
      await this.replyMessage(replyToken, `💬 คุณพิมพ์ว่า: "${message}"\n\n🔍 หากต้องการค้นหาข้อมูล กรุณาพิมพ์ "ชื่อ นามสกุล"\n💡 พิมพ์ "help" เพื่อดูวิธีใช้งาน`);
    }
  }

  private async handleFollow(replyToken: string): Promise<void> {
    const welcomeText = `🎉 ยินดีต้อนรับสู่ระบบค้นหาข้อมูล!\n\n` +
      `🔍 ระบบสามารถค้นหาได้:\n` +
      `• ข้อมูลนักเรียน/บุคคล\n` +
      `• ข้อมูลสมาชิก\n\n` +
      `📋 วิธีใช้งาน:\n` +
      `พิมพ์ "ชื่อ นามสกุล" เพื่อค้นหาข้อมูล\n\n` +
      `📝 ตัวอย่าง:\n` +
      `• สมชาย ใจดี\n` +
      `• นางสาว สมหญิง รักดี\n\n` +
      `💡 พิมพ์ "help" เพื่อดูวิธีใช้งานเพิ่มเติม`;
    await this.replyMessage(replyToken, welcomeText);
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
      this.logger.error('Error sending reply to LINE:', (error as any)?.response?.data || (error instanceof Error ? error.message : 'Unknown error'));
    }
  }
}