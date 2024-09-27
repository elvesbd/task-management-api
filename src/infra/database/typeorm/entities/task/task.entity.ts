import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

enum TaskStatus {
  PENDING = 'Pendente',
  COMPLETED = 'Concluída',
  INPROGRESS = 'Em Progresso',
}

@Entity('tasks')
@Index('IDX_TASK_TENANT_ID', ['tenantId', 'id'], { unique: true })
export class TypeORMTaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 255,
    nullable: false,
  })
  title: string;

  @Column('timestamp', {
    nullable: false,
  })
  deadline: Date;

  @Column('varchar', {
    length: 255,
    nullable: false,
  })
  tenantId: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    nullable: true,
  })
  status: TaskStatus;

  @Column('text', {
    nullable: false,
  })
  description: string;
}
