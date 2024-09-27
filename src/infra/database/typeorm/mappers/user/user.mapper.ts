import { User } from '@core/user/model';
import { TypeORMUserEntity } from '@infra/database/typeorm/entities';

export class TypeORMUserMapper {
  private constructor() {
    throw new Error(
      'TypeORMUserMapper is a static class and should not be instantiated.',
    );
  }

  public static toDomain(persistence: TypeORMUserEntity): User {
    return new User(persistence);
  }

  public static toDomainList(persistenceList: TypeORMUserEntity[]): User[] {
    return persistenceList.map((persistence) => new User(persistence));
  }

  public static toPersistence(domain: User): TypeORMUserEntity {
    return {
      id: domain.id,
      role: domain.role,
      email: domain.email,
      password: domain.password,
      tenantId: domain.tenantId,
    };
  }
}
