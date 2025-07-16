import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { UsersModule } from 'src/users/users.module';
import { CONFIG_OPTIONS } from 'src/commons/common.contants';
import { JwtModuleOptions } from './jwt.interface';

@Global()
@Module({})
export class JwtModule {
    static forRoot(options: JwtModuleOptions): DynamicModule {
        return {
            imports: [UsersModule],
            module: JwtModule,
            providers: [
                {
                    provide: CONFIG_OPTIONS,
                    useValue: options
                },
                JwtService,
            ],
            exports: [JwtService],
        }
    }
}
