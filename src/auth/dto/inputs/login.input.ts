import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";
@InputType()
export class LoginInput{

  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsString()
  password; string;
}