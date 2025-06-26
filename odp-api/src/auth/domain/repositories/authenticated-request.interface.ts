import { Request } from 'express';
import { RequestUserDto } from 'src/common/presentation/dtos/request-user.dto';

export interface AuthenticatedRequest extends Request {
  user: RequestUserDto;
}