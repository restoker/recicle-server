import { PartialType } from '@nestjs/mapped-types';
import { CreateAddressDtoInput } from './create-address.dto';

export class UpdateAddressDto extends PartialType(CreateAddressDtoInput) { }
