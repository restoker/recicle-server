import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// import { Observable } from 'rxjs';
import { JwtService } from 'src/jwt/jwt.service';
import { UsersService } from 'src/users/users.service';
import { AllowedRoles } from './role.decorator';

// https://medium.com/@chandantechie/role-based-access-control-rbac-in-nestjs-a5963bcd70bd

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtServices: JwtService,
    private readonly userServices: UsersService,
  ) { }
  // canActivate(
  //   context: ExecutionContext,
  // ): boolean | Promise<boolean> | Observable<boolean> {
  //   return true;
  // }
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<AllowedRoles[]>('roles', ctx.getHandler());
    if (!roles) return true;
    try {
      // const gqlContext = GqlExecutionContext.create(context).getContext();
      const request = ctx.switchToHttp().getRequest();
      // const user = request['user'];
      // console.log(user);
      // console.log(gqlContext);
      // const token = request.token || request.req.connectionParams['x-jwt'];
      const token = request.headers['x-jwt'];
      // console.log(token);
      if (token) {
        const decoded = this.jwtServices.verify(String(token));
        if (!decoded) return false;
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          // console.log(decoded['id']);
          const sendData = {
            userId: decoded['id']
          }
          const { user } = await this.userServices.findById(sendData);
          // console.log(user);
          if (!user) return false;
          request['user'] = user;
          if (roles.includes('any')) return true;
          // console.log(user.roles);
          const intersections = user.roles.filter(e => roles.indexOf(e.name as AllowedRoles) !== -1);
          // console.log(intersections);
          if (intersections.length > 0) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
    // return roles.includes(user.role[0]);
  }
}
