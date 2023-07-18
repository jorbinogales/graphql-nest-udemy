import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthResponse } from "./types/auth-response.type";
import { UsersService } from "../users/users.service";
import { LoginInput, SignupInput } from "./dto/inputs";
import  * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/entities/user.entity";
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
  }

  private getJwtToken(userid: string){
    return this.jwtService.sign({
      id: userid
    });
  }

  async signup(signupInput: SignupInput): Promise<AuthResponse>{
    const user = await this.usersService.create(signupInput);
    const token = this.getJwtToken(user.id);

    return {
      token, user
    }
  }

  async login(loginInput: LoginInput): Promise<AuthResponse>{
    const { email, password } = loginInput;
    const user = await this.usersService.findOne(email)
    if(!bcrypt.compareSync(password, user.password)){
      throw new BadRequestException('credentials incorrect')
    }
    const token = this.getJwtToken(user.id);
    return {
      token,
      user
    }
  }

  async validateUser(id: string): Promise<User>{
    const user = await this.usersService.findOneById(id);
    if(!user.isActive){
      throw new UnauthorizedException('user not active')
    }
    delete user.password;
    return user;
  }

  revalidateToken(user: User): AuthResponse {
    const token = this.getJwtToken(user.id);
    return {
      token,
      user
    }
  }
}
