import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterUserCommand } from './../../../auth/application/commands/register-user.command';
import { SignInUserCommand } from './../../../auth/application/commands/signin-user.command';
import { RegisterUserDto } from './../../../auth/application/dtos/register-user.dto';
import { SignInDto } from './../../../auth/application/dtos/signin.dto';

@ApiTags('auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<{ accessToken: string }> {
    const command = new RegisterUserCommand(registerUserDto);
    const accessToken = await this.commandBus.execute(command);
    return { accessToken };
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in a user' })
  @ApiResponse({ status: 200, description: 'User successfully signed in' })
  async signin(@Body() signInDto: SignInDto): Promise<{ accessToken: string }> {
    const command = new SignInUserCommand(
      signInDto.username,
      signInDto.password,
    );
    const accessToken = await this.commandBus.execute(command);
    return { accessToken };
  }
}
