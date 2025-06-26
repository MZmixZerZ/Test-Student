// import { Schema, Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';

@Schema()
export class AccessLog {
  @Expose()
  @Prop({ type: String, required: true })
  user: string;

  @Expose()
  @Prop({ type: String, required: true })
  method: string;

  @Expose()
  @Prop({ type: String, required: true })
  url: string;

  @Expose()
  @Prop({ type: Number, required: true })
  statusCode: number;

  @Expose()
  @Prop({ type: Number, required: true })
  duration: number;

  @Expose()
  @Prop({ type: Date, default: Date.now })
  timestamp: Date;
}

export const AccessLogSchema = SchemaFactory.createForClass(AccessLog);
