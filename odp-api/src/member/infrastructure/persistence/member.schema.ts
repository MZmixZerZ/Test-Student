import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { MemberEntity } from 'src/member/domain/entities/member.entity';

@Schema()
export class Member extends MemberEntity {}

export const MemberSchema = SchemaFactory.createForClass(Member);
