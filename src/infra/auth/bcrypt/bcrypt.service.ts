import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { PasswordEncryption } from '@core/authentication/ports/encryption';

@Injectable()
export class BcryptService implements PasswordEncryption {
  constructor() {}

  public hash(plainText: string, salt = 10): Promise<string> {
    return bcrypt.hash(plainText, salt);
  }

  public compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
