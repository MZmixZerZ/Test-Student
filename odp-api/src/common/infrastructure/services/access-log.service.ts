import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccessLog } from '../persistence/access-log.schema';

@Injectable()
export class AccessLogService {
  constructor(
    @InjectModel('AccessLog')
    private readonly accessLogModel: Model<AccessLog>,
  ) {}

  async createAccessLog(
    user: string,
    method: string,
    url: string,
    statusCode: number,
    duration: number,
  ) {
    const newLog = new this.accessLogModel({
      user,
      method,
      url,
      statusCode,
      duration,
    });
    await newLog.save();
  }
}
