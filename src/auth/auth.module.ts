import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from "../users/users.module";
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { PassportModule } from "@nestjs/passport";

@Module({
  imports: [
    ConfigModule,
    PassportModule.register(({
      defaultStrategy: 'jwt'
    })),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: '4h'
          }
        }
      }
    }),
    UsersModule
  ],
  providers: [AuthResolver, AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule, JwtModule]
})
export class AuthModule {}
