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
      const user = await this.userRepository.findOneBy({ id: input.idUser });
      if (!user) return { ok: false, msg: 'El usuario no existe' };
      const address = this.addressRepository.create(input);
      const newAddress = await this.addressRepository.save(address);
      return { ok: true, msg: 'Direccion guardada correctamente', address: newAddress };
    } catch (e) {
      return { ok: false, msg: 'Error en el servidor' };
    }
  }

  async findAllAddress(idUser: string, user: User): Promise<GetAllAddressDtoOutput> {
    try {
      if (user.id !== idUser) return { ok: false, msg: 'No tienes permiso para esta operación' };
      const addresses = await this.addressRepository.find({ where: { user } });
      return { ok: true, msg: 'Direcciones obtenidas correctamente', addresses };
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
