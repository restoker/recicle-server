import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CommonsModule } from './commons/commons.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ResendModule } from 'nestjs-resend';
import { RolesModule } from './roles/roles.module';
import { JwtModule } from './jwt/jwt.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true, envFilePath: '.env', cache: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // synchronize: true,
    }),
    UsersModule,
    CommonsModule,
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY!,
    }),
    ResendModule.forRoot({
      apiKey: process.env.RESEND_API!,
    }),
    RolesModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
