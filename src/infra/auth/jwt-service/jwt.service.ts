import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Payload } from '@core/authentication/ports/token';

@Injectable()
export class JWTService {
  constructor(private readonly jwtService: JwtService) {}

  public signAsync(payload: Payload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
