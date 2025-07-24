import { Controller, Get, Post, Body, Query, ParseUUIDPipe, Param, Put, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserInput, CreateUserOutput } from './dto/create-user.dto';
import { LoginInput, LoginOutput } from './dto/login-user.dto';
import { ConfirmarEmailOutput } from './dto/confirmar-email.dto';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from './entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserInput, UpdateUserOutput } from './dto/update-user.dto';
import { UpdateRolInput, UpdateRolOutput } from './dto/update-rol.dto';

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

  @Get(":userId")
  async me(
    @AuthUser()
    user: User,
    @Param('userId', new ParseUUIDPipe())
    userId: string,
  ) {
    // console.log(id);
    // console.log(user);
    return this.usersService.findById({ userId });
  }

  @Put('update/:id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() input: UpdateUserInput,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|gif)' }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ): Promise<UpdateUserOutput> {
    return this.usersService.updateWithImage(id, input, file);
  }


  @Patch('asignrol/:id')
  updateRol(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body()
    input: UpdateRolInput,
  ): Promise<UpdateRolOutput> {
    return this.usersService.updateRol(input, id);
  }

}
