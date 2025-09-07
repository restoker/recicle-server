import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDtoInput } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User, UserRole } from 'src/users/entities/user.entity';
// import { GetAllAddressDtoInput } from './dto/get-all-address.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @Role([UserRole.client])
  @Post('/new')
  create(@Body() createAddressDto: CreateAddressDtoInput) {
    return this.addressService.create(createAddressDto);
  }

  @Role([UserRole.client])
  @Get('/all/:idUser')
  findAllAdress(
    @AuthUser() user: User,
    @Param('idUser', new ParseUUIDPipe()) idUser: string
  ) {
    console.log(user);
    return this.addressService.findAllAddress(idUser);
  }

  @Role([UserRole.admin, UserRole.superadmin])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(+id, updateAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressService.remove(+id);
  }
}
