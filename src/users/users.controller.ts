import { Controller, Get, Post, Body, Query, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserInput, CreateUserOutput } from './dto/create-user.dto';
import { LoginInput, LoginOutput } from './dto/login-user.dto';
import { ConfirmarEmailOutput } from './dto/confirmar-email.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Post('/new')
  async createUser(
    @Body()
    input: CreateUserInput
  ): Promise<CreateUserOutput> {
    return this.usersService.create(input);
  }

  @Post('/login')
  async loginUser(
    @Body()
    input: LoginInput
  ): Promise<LoginOutput> {
    return this.usersService.login(input);
  }

  @Post('/verification')
  async verificarEmail(
    @Query('token', new ParseUUIDPipe())
    token: string,
  ): Promise<ConfirmarEmailOutput> {
    // console.log(token);
    // return this.usersService.login(input);
    return this.usersService.confirmEmailWithToken(token);
  }
}
