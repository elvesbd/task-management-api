import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Tenant } from '@core/tenant/model';
import { TenantRepository } from '@core/tenant/ports/repository';
import { dataSource } from '@infra/database/typeorm/datasource';
import { TypeORMTenantMapper } from '@infra/database/typeorm/mappers';
import { TypeORMTenantEntity } from '@infra/database/typeorm/entities';

@Injectable()
export class TypeORMTenantRepository implements TenantRepository {
  private repository: Repository<TypeORMTenantEntity>;

  constructor() {
    this.repository = dataSource.getRepository(TypeORMTenantEntity);
  }

  async findByDocument(document: string): Promise<Tenant | null> {
    const tenantEntity = await this.repository.findOne({ where: { document } });
    return tenantEntity ? TypeORMTenantMapper.toDomain(tenantEntity) : null;
  }

  public async save(tenant: Tenant): Promise<void> {
    const newTenant = TypeORMTenantMapper.toPersistence(tenant);
    await this.repository.save(newTenant);
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  public async findAll(): Promise<Tenant[]> {
    const tenants = await this.repository.find();
    return TypeORMTenantMapper.toDomainList(tenants);
  }

  public async findById(id: string): Promise<Tenant | null> {
    const tenantEntity = await this.repository.findOne({ where: { id } });
    return tenantEntity ? TypeORMTenantMapper.toDomain(tenantEntity) : null;
  }
}
