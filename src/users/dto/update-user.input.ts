import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType, ID } from "@nestjs/graphql";
import { ValidRoles } from "../../auth/enums/valid-roles.enum";
import { IsArray, IsBoolean, IsEmpty, IsEnum, IsNotEmpty, IsOptional, IsUUID } from "class-validator";

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Field(() => [ValidRoles], { nullable: true})
  @IsArray()
  @IsOptional()
  roles?: ValidRoles[];

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
