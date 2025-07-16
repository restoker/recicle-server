import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { UsersService } from 'src/users/users.service';
import { NextFunction } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtServices: JwtService,
    private readonly userServices: UsersService,
  ) { }

  async use(req: any, res: any, next: () => void) {
    // const authToken = request.headers['authorization'].split(' ')[1];
    // if ('authorization' in req.headers) {
    // console.log(req);
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      try {
        const decoded = this.jwtServices.verify(String(token));
        // console.log(decoded);
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          // console.log(decoded['id']);
          const sendData = {
            userId: decoded['id']
          }
          const { user, ok } = await this.userServices.findById(sendData);
          // console.log(user);
          if (ok) {
            req['user'] = user;
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    next();
  }
}

export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(req.headers);
  next();
}