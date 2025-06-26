import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResetPasswordCommand } from './reset-password.command';
import { Inject, NotFoundException } from '@nestjs/common';
import { UserRepositoryInterface } from 'src/auth/domain/repositories/user.repository.interface';
import { AuthService } from 'src/auth/domain/services/auth.service';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler
  implements ICommandHandler<ResetPasswordCommand>
{
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepositoryInterface,
    private readonly authService: AuthService,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<void> {
    const { username, newPassword } = command;

    // หา user จาก username ที่ระบุ
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    // Hash รหัสผ่านใหม่
    user.password = await this.authService.hashPassword(newPassword);

    // บันทึกการเปลี่ยนแปลง
    await this.userRepository.update(user);
  }
}
