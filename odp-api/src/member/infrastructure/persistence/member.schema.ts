import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MemberEntity } from 'src/member/domain/entities/member.entity';

@Schema({ timestamps: true })
export class Member extends MemberEntity {
    @Prop({ type: String, required: true }) // ให้ user กรอกเอง เหมือน n_id ของ person
    memberId: string;

    @Prop({ type: String, required: true })
    idCard: string;

    @Prop({ type: String, required: true })
    organization: string;

    @Prop({ type: String, required: true })
    contactPerson: string;

    @Prop({ type: String, required: true })
    contactPhone: string;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
