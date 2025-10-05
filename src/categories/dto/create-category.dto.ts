import { PickType } from "@nestjs/mapped-types";
import { Category } from "../entities/category.entity";
import { CoreOutput } from "src/commons/dtos/core-output.dto";

export class CreateCategoryDtoInput extends PickType(Category, ['name', 'description', 'image']) { }


export class CreateCategoryDtoOutput extends CoreOutput {

}