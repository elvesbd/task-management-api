import { Tenant } from '@core/tenant/model';
import { TypeORMTenantEntity } from '@infra/database/typeorm/entities';

export class TypeORMTenantMapper {
  private constructor() {
    throw new Error(
      'TypeORMTenantMapper is a static class and should not be instantiated.',
    );
  }

  public static toDomain(persistence: TypeORMTenantEntity): Tenant {
    return new Tenant({
      id: persistence.id,
      name: persistence.name,
      document: persistence.document,
    });
  }

  public static toDomainList(persistenceList: TypeORMTenantEntity[]): Tenant[] {
    return persistenceList.map((persistence) => this.toDomain(persistence));
  }

  public static toPersistence(domain: Tenant): TypeORMTenantEntity {
    return {
      id: domain.id,
      name: domain.name,
      document: domain.document,
    };
  }
}
