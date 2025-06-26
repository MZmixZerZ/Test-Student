import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { PersonEntity } from 'src/person/domain/entities/person.entity';

@Schema()
export class Person extends PersonEntity {
  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: String, required: true })
  citizen: string; // เชื้อชาติ

  @Prop({ type: String, required: true })
  nationality: string; // สัญชาติ

  @Prop({ type: String, required: true })
  religion: string; // ศาสนา

  @Prop({ type: String, required: true })
  address: string; // ที่อยู่

  // companyId: { type: Schema.Types.ObjectId, ref: 'Company' }, // หรือเอาออกเลย
}

export const PersonSchema = SchemaFactory.createForClass(Person);
