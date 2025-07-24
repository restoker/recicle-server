import { Injectable } from '@nestjs/common';
import { CreateRoleInput, CreateRoleOutput } from './dto/create-role.dto';
// import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './entities/role.entity';

@Injectable()
export class RolesService {

  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) { }


  async create(input: CreateRoleInput): Promise<CreateRoleOutput> {
    try {
      // verificar  si el rol existe
      const rol = await this.rolRepository.findOneBy({ name: input.name });
      if (rol) return { ok: false, msg: `El Rol: ${input.name} ya existe` };
      const newRol = this.rolRepository.create({
        name: input.name,
        route: input.route,
        image: input.image,
      });
      await this.rolRepository.save(newRol);
      return { ok: true, msg: `Rol ${input.name} creado` };
    } catch (e) {
      return { ok: false, msg: 'Error en el servidor' };
    }
  }
  // findAll() {
  //   return `This action returns all roles`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} role`;
  // }

  // update(id: number, updateRoleDto: UpdateRoleDto) {
  //   return `This action updates a #${id} role`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} role`;
  // }
}
