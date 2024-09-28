import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JWTService } from './jwt-service/jwt.service';
import { BcryptService } from './bcrypt/bcrypt.service';
import { SignToken } from '@core/authentication/ports/token';
import { AtStrategy } from '@infra/auth/strategies/at.strategy';
import { PasswordEncryption } from '@core/authentication/ports/encryption';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: {
          expiresIn: '3600s', //30m
        },
      }),
    }),
  ],
  providers: [
    AtStrategy,
    {
      provide: PasswordEncryption,
      useClass: BcryptService,
    },
    {
      provide: SignToken,
      useClass: JWTService,
    },
  ],
  exports: [PasswordEncryption, SignToken],
})
export class AuthModule {}
