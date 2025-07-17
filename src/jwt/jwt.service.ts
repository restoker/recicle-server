import { Inject, Injectable } from '@nestjs/common';
import { JwtModuleOptions } from './jwt.interface';
import { CONFIG_OPTIONS } from 'src/commons/common.contants';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
    constructor(
        @Inject(CONFIG_OPTIONS)
        private readonly options: JwtModuleOptions,
    ) { }

    sign(payload: object): string {
        // console.log(payload);
        return jwt.sign(
            payload,
            this.options.privateKey,
            { expiresIn: '4hr' }
        );
    }

    verify(token: string) {
        try {
            const decoded = jwt.verify(token, this.options.privateKey);
            console.log(decoded);
            return decoded;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return false;
            }
            throw error
        }
    }
}
