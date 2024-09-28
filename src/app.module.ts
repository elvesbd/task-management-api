import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from '@infra/database';
import { HttpModule } from '@infra/http';
import { AuthModule } from '@infra/auth';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from '@infra/auth/guards';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    HttpModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
