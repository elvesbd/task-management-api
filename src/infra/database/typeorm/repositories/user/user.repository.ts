import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { User } from '@core/user/model';
import { UserRepository } from '@core/user/ports/repository';
import { dataSource } from '@infra/database/typeorm/datasource';
import { TypeORMUserMapper } from '@infra/database/typeorm/mappers';
import { TypeORMUserEntity } from '@infra/database/typeorm/entities';

@Injectable()
export class TypeORMUserRepository implements UserRepository {
  private repository: Repository<TypeORMUserEntity>;

  constructor() {
    this.repository = dataSource.getRepository(TypeORMUserEntity);
  }

  public async save(user: User): Promise<void> {
    const newUser = TypeORMUserMapper.toPersistence(user);
    await this.repository.save(newUser);
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  public async findAll(tenantId: string): Promise<User[]> {
    const users = await this.repository.find({ where: { tenantId } });
    return TypeORMUserMapper.toDomainList(users);
  }

  public async findByEmail(email: string): Promise<User | null> {
    const userEntity = await this.repository.findOne({ where: { email } });
    return userEntity ? TypeORMUserMapper.toDomain(userEntity) : null;
  }

  public async findByIdAndTenantId(
    id: string,
    tenantId: string,
  ): Promise<User | null> {
    const userEntity = await this.repository.findOne({
      where: { id, tenantId },
    });
    return userEntity ? TypeORMUserMapper.toDomain(userEntity) : null;
  }
}
