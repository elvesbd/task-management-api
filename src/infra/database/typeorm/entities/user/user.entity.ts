import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

enum UserRole {
  ADMIN = 'Admin',
  USER = 'User',
}

@Entity('users')
@Index('IDX_USER_EMAIL', ['email'], { unique: true })
export class TypeORMUserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 255,
    nullable: false,
  })
  email: string;

  @Column('varchar', {
    length: 255,
    nullable: false,
  })
  password: string;

  @Column('varchar', {
    length: 255,
    nullable: false,
  })
  tenantId: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    nullable: false,
  })
  role: UserRole;
}
