import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Member extends Document {
    @Prop({ required: true })
    memberId: string;

    @Prop({ required: true })
    idCard: string;

    @Prop({ required: true })
    organization: string;

    @Prop({ required: true })
    contactPerson: string;

    @Prop({ required: true })
    contactPhone: string;

    // สามารถเพิ่ม static method หรือ virtual field ได้ที่นี่ถ้าต้องการ
}

export const MemberSchema = SchemaFactory.createForClass(Member);
