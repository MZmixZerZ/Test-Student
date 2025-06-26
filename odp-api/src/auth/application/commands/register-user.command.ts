import { RegisterUserDto } from '../dtos/register-user.dto';

export class RegisterUserCommand {
  constructor(public readonly registerUserDto: RegisterUserDto) {}
}
