import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tenants')
@Index('IDX_TENANT_DOCUMENT', ['document'], { unique: true })
export class TypeORMTenantEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 255,
    nullable: false,
  })
  name: string;

  @Column('varchar', {
    length: 255,
    nullable: false,
  })
  document: string;
}
