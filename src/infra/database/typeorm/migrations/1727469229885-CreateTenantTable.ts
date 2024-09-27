import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTenantTable1727469229885 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
			CREATE TABLE tenants (
					id CHAR(36) NOT NULL,
					name VARCHAR(255) NOT NULL,
					document VARCHAR(255) NOT NULL,
					PRIMARY KEY (id),
					UNIQUE INDEX IDX_TENANT_DOCUMENT (document)
			);
	`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
			DROP TABLE tenants;
	`);
  }
}
