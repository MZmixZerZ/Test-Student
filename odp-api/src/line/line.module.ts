import { Module } from '@nestjs/common';
import { LineService } from './line.service';
import { LineController } from './line.controller';
import { PersonModule } from '../person/person.module';

@Module({
  imports: [PersonModule],
  providers: [LineService],
  controllers: [LineController],
})
export class LineModule {}