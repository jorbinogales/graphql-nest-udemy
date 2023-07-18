import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "../../users/entities/user.entity";

@ObjectType()
export class AuthResponse {

  @Field(() => String)
  token: String;

  @Field(() => User)
  user: User;
}