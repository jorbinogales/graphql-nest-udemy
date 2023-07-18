import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { User } from "../../users/entities/user.entity";
import { JwtPayload } from "../interface/jwt-payload.interface";
import { AuthService } from "../auth.service";
@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy){
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    })
  }

  async validate(payload: JwtPayload): Promise<User>{
    const { id } = payload;
    return await this.authService.validateUser(id);
  }
}