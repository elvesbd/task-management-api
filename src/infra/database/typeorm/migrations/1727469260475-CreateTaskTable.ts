import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaskTable1727469260475 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
				CREATE TABLE tasks (
						id CHAR(36) NOT NULL,
						title VARCHAR(255) NOT NULL,
						deadline TIMESTAMP NOT NULL,
						tenantId CHAR(36) NOT NULL,
						status ENUM('Pendente', 'Concluída', 'Em Progresso') DEFAULT NULL,
						description TEXT NOT NULL,
						PRIMARY KEY (id),
						UNIQUE INDEX IDX_TASK_TENANT_ID (tenantId, id)
				);
		`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
			DROP TABLE tasks;
	`);
  }
}
