import { Module } from '@nestjs/common';
import { LineService } from './line.service';
import { LineController } from './line.controller';
import { PersonModule } from '../person/person.module';
import { MemberModule } from '../member/member.module';

@Module({
  imports: [PersonModule, MemberModule],
  providers: [LineService],
  controllers: [LineController],
})
export class LineModule {}