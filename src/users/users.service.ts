import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateUserInput, CreateUserOutput } from './dto/create-user.dto';
import { UserProfileInput, UserProfileOutput } from './dto/user-profile.dto';
import { ResendService } from 'nestjs-resend';
import { Verification } from './entities/verification.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { Rol } from 'src/roles/entities/role.entity';
import { GetUsersOutput } from './dto/get-users.dto';
import { LoginInput, LoginOutput } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
    private readonly resendService: ResendService,
    private readonly dataSource: DataSource,
    private readonly jwtServices: JwtService,
    // private readonly filesServices: FilesService,
  ) { }

  async create(input: CreateUserInput): Promise<CreateUserOutput> {
    try {
      // console.log(process.env.RESEND_API);
      // verificar si el usuario ya existe
      const existe = await this.userRepository.findOneBy({ email: input.email });
      if (existe) {
        if (!existe.verified) {
          const verificationEmail = await this.generateEmailVerificationToken(input.email);
          const confirmLink = `${process.env.MY_URL}/users/verification?token=${verificationEmail?.token}`;
          await this.resendService.send({
            from: 'indrive <onboarding@resend.dev>',
            to: input.email,
            subject: 'wellcome to indrive',
            html: `<p>click here <a href='${confirmLink}'>Confirm your account here</a></p>`
          });
          return { ok: false, msg: 'Se volvío a enviar un email con el link de activacion a tu correo' };
        }
        return { ok: false, msg: 'El usuario ya existe' };
      }
      // verificar si el teléfono existe
      const phoneExiste = await this.userRepository.findOneBy({ telefono: input.telefono });

      if (phoneExiste) return { ok: false, msg: 'El teléfono ya existe' };

      const newUser = this.userRepository.create({
        email: input.email,
        nombre: input.nombre,
        password: input.password,
        telefono: input.telefono,
      });

      const token = crypto.randomUUID();
      const expires = new Date(new Date().getTime() + 3600 * 1000);
      const confirmLink = `${process.env.MY_URL}/users/verification?token=${token}`;
      // const confirmLink = `${domain}/verification?token=${token}`;
      // console.log(confirmLink);
      const verificationToken = this.verificationRepository.create({
        token,
        expires,
        email: input.email,
      });

      const defaultRol = await this.rolRepository.findBy({ name: 'client' });
      if (!defaultRol) return { ok: false, msg: 'Debe agregar los roles' };
      newUser.roles = defaultRol;
      const p1 = await this.userRepository.save(newUser);
      const p3 = await this.verificationRepository.save(verificationToken);
      const p2 = await this.resendService.send({
        from: 'indrive <onboarding@resend.dev>',
        to: input.email,
        subject: 'wellcome to indrive',
        html: `<p>click here <a href='${confirmLink}'>Confirm your account here</a></p>`
      });
      // const p4 = await this.rolRepository.create()
      // this.dataSource.createEntityManager();
      await this.dataSource.manager.transaction(async () => {
        Promise.all([p1, p2, p3]).then((values) => {
          // console.log(values);
          return { ok: true, msg: 'Se envio un Link de verificación a su correo' };
        })
          .catch((reason) => {
            return { ok: false, msg: 'Ocurrio un error al crear el usuario' };
          });
      })
      return { ok: true, msg: 'Se envio un Link de verificación a su correo' };
    } catch (e) {
      // console.log(e);
      return { ok: false, msg: 'Error en el servidor' };
    }
  }

  async findById(input: UserProfileInput): Promise<UserProfileOutput> {
    const { userId } = input;
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['roles']
      });
      if (!user) return { ok: false, msg: 'Usuario no encontrado' };
      return {
        ok: true,
        msg: 'Usuario encontrado',
        user,
      };
    } catch (e) {
      console.log(e);
      return { ok: false, msg: 'Error on server', error: 'User Not Found' };
    }
  }

  async getAllUsers(): Promise<GetUsersOutput> {
    try {
      const users = await this.userRepository.find({
        relations: ['roles'],
      });

      // console.log(users);
      return {
        ok: true,
        msg: 'Usuarios encontrado',
        users,
      };
    } catch (e) {
      console.log(e);
      return { ok: false, msg: 'Error on server', error: 'Users Not Found' };
    }
  }

  async login(input: LoginInput): Promise<LoginOutput> {
    try {
      const existe = await this.userRepository.findOne({
        where: { email: input.email },
        relations: ['roles'],
      });
      if (!existe) return { ok: false, msg: 'Usuario o Password incorrectos' };
      // verificar el password
      // console.log(existe);
      const password = await existe.checkPassword(input.password);
      if (!password) return { ok: false, msg: 'Usuario o password incorrectos' };
      const payload = { id: existe.id, nombre: existe.nombre };
      const token = this.jwtServices.sign(payload);
      existe.password = '';
      return { ok: true, msg: `Hola ${existe.nombre}, Bienvenido nuevamente`, token, user: existe };
    } catch (e) {
      return { ok: false, msg: 'Error on server', error: 'Error en el servidor' };
    }
  }

  async getVerificationTokenByEmail(email: string) {
    try {
      const verificationToken = await this.verificationRepository.findOneBy({ email });
      return verificationToken;
    } catch (error) {
      return null;
    }
  }

  async generateEmailVerificationToken(email: string) {
    try {
      const token = crypto.randomUUID();
      const expires = new Date(new Date().getTime() + 3600 * 1000);

      const existingToken = await this.getVerificationTokenByEmail(email);

      if (existingToken) {
        await this.verificationRepository.delete({ id: existingToken.id });
      }

      const emailToken = this.verificationRepository.create({
        expires,
        email,
        token,
      });

      const verificationToken = await this.verificationRepository.save(emailToken);

      return verificationToken;
    } catch (e) {
      return null;
    }
  }

  async confirmEmailWithToken(token: string) {
    try {
      // verificar si el token existe
      const existeToken = await this.verificationRepository.findOneBy({ token });
      if (!existeToken) return { ok: false, msg: 'El token no existe' };
      const hasExpired = new Date(existeToken.expires) < new Date();
      if (hasExpired) return { ok: false, msg: 'El token a expirado' };
      // verificar si el usuario existe
      const usuario = await this.userRepository.findOneBy({ email: existeToken.email });
      if (!usuario) return { ok: false, msg: 'El usuario no existe' };
      await this.verificationRepository.delete({ email: usuario.email });
      await this.userRepository.save({
        id: usuario.id,
        verificated: true,
        email: existeToken.email,
      })
      return { ok: true, msg: 'Su correo fue validado' };
    } catch (e) {
      return { ok: false, msg: 'Error en el servidor, intentolo mas tarde' };
    }
  }
}
