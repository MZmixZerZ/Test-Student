import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { MemberEntity } from 'src/member/domain/entities/member.entity';

@Schema({ timestamps: true })
export class Member extends MemberEntity {
    // สามารถเพิ่ม static method หรือ virtual field ได้ที่นี่ถ้าต้องการ
}

export const MemberSchema = SchemaFactory.createForClass(Member);
