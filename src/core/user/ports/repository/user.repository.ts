import { User } from '@core/user/model';

export abstract class UserRepository {
  abstract save(user: User): Promise<void>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByIdAndTenantId(
    id: string,
    tenantId: string,
  ): Promise<User | null>;
}
