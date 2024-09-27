import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import * as path from 'node:path';
import { ConfigService } from '@nestjs/config';
config();

const configService = new ConfigService();

export const dataSource = new DataSource({
  type: 'mysql',
  host: configService.getOrThrow('MYSQL_HOST'),
  port: parseInt(configService.getOrThrow('MYSQL_PORT')),
  database: configService.getOrThrow('MYSQL_DB'),
  username: configService.getOrThrow('MYSQL_USER'),
  password: configService.getOrThrow('MYSQL_PASSWORD'),
  entities: [path.join(__dirname, '..', 'typeorm/entities', '*.{ts,js}')],
  migrations: [path.join(__dirname, '..', 'typeorm/migrations', '*.{ts,js}')],
  synchronize: false,
  logging: false,
});
