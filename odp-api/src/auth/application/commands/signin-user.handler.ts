import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignInUserCommand } from './signin-user.command';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { UserRepositoryInterface } from 'src/auth/domain/repositories/user.repository.interface';
import { AuthService } from 'src/auth/domain/services/auth.service';

@CommandHandler(SignInUserCommand)
export class SignInUserHandler implements ICommandHandler<SignInUserCommand> {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepositoryInterface,
    private readonly authService: AuthService,
  ) {}

  async execute(command: SignInUserCommand): Promise<string> {
    const { username, password } = command;

    const user = await this.userRepository.findByUsername(username);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const passwordValid = await this.authService.comparePassword(
      password,
      user.password,
    );
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return this.authService.generateJwtToken(user);
  }
}
