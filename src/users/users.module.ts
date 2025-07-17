import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import { TwoFactorToken } from './entities/twoFactorToken.entity';
import { Rol } from 'src/roles/entities/role.entity';
import { PasswordResetToken } from './entities/passwordResetToken.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Verification, TwoFactorToken, Rol, PasswordResetToken])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule { }
