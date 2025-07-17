import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from 'src/jwt/jwt.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
    imports: [UsersModule, JwtModule],
    providers: [{
        provide: APP_GUARD,
        useClass: AuthGuard,
    }],
    exports: [],
})
export class AuthModule { }
