import { Injectable } from '@nestjs/common';
import { CreateAddressDtoInput, CreateAddressDtoOutput } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { GetAllAddressDtoInput, GetAllAddressDtoOutput } from './dto/get-all-address.dto';

@Injectable()
export class AddressService {

  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async create(input: CreateAddressDtoInput): Promise<CreateAddressDtoOutput> {
    try {
      // verificar si el usuario existe
      const user = await this.userRepository.findOneBy({ id: input.userId });
      if (!user) return { ok: false, msg: 'El usuario no existe' };
      // const address = await this.addressRepository.query(`
      //   INSERT INTO 
      //       address(position, direccion, distrito, sobrenombre, userId)
      //   VALUES(
      //       ST_GeomFromText('POINT(${input.lat} ${input.lng})', 4326),
      //       '${input.direccion}',
      //       '${input.distrito}',
      //       '${input.sobrenombre}',
      //       ${user.id}
      //   )
      // `);
      // create a query builder
      const query = this.addressRepository.createQueryBuilder();
      const address = await query
        .insert()
        .into(Address)
        .values({
          point: () => `ST_GeomFromText('POINT(${input.lat} ${input.lng})', 4326)`,
          direccion: input.direccion,
          distrito: input.distrito,
          sobrenombre: input.sobrenombre,
          user: { id: user.id }
        })
        .returning('*')
        .execute();
      return { ok: true, msg: 'Direccion guardada correctamente', address: address.raw[0] };
    } catch (e) {
      return { ok: false, msg: 'Error en el servidor' };
    }
  }

  async findAllAddress(idUser: string, user: User) {
    try {
      if (user.id !== idUser) return { ok: false, msg: 'No tienes permiso para esta operación' };
      const addresses = await this.addressRepository.find({ where: { user } });
      const direcciones = addresses.map(address => ({
        id: address.id,
        direccion: address.direccion,
        distrito: address.distrito,
        sobrenombre: address.sobrenombre,
        lat: address.point.coordinates[0],
        lng: address.point.coordinates[1],
      }));
      return { ok: true, msg: 'Direcciones obtenidas correctamente', addresses: direcciones };
    } catch (error) {
      return { ok: false, msg: 'Error en el servidor' };
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} address`;
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  remove(id: number) {
    return `This action removes a #${id} address`;
  }
}
