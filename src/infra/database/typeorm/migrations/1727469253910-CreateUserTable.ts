import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1727469253910 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
				CREATE TABLE users (
						id CHAR(36) NOT NULL,
						email VARCHAR(255) NOT NULL,
						password VARCHAR(255) NOT NULL,
						tenantId CHAR(36) NOT NULL,
						role ENUM('Admin', 'User') NOT NULL,
						PRIMARY KEY (id),
						UNIQUE INDEX IDX_USER_TENANT_ID (tenantId, id)
				);
		`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
			DROP TABLE users;
	`);
  }
}
