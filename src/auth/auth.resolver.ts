import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { User } from "../users/entities/user.entity";
import { LoginInput, SignupInput } from "./dto/inputs";
import { AuthResponse } from "./types/auth-response.type";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { CurrentUser } from "./decorators/user.decorator";
import { ValidRoles } from "./enums/valid-roles.enum";

@Resolver(() => AuthResponse)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation( () => AuthResponse, {
    name: 'signup'
  })
  async signup(
    @Args('signupInput') signupInput: SignupInput
  ): Promise<AuthResponse>{
    return await this.authService.signup(signupInput)
  }


  @Mutation( () => AuthResponse, {
    name: 'login'
  })
  async login(
    @Args('loginInput') loginInput: LoginInput
  ): Promise<AuthResponse>{
    return this.authService.login(loginInput)
  }
  //
  //

  @UseGuards(JwtAuthGuard)
  @Query( () => AuthResponse, {
    name: 'revalidate'
  })
  revalidateToken(
    @CurrentUser([ValidRoles.admin]) user: User
  ): AuthResponse{
    return this.authService.revalidateToken(user);
  }
}
