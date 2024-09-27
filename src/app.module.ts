import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from '@infra/database';
import { HttpModule } from '@infra/http';
import { AuthModule } from '@infra/auth';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    HttpModule,
    AuthModule,
  ],
})
export class AppModule {}
