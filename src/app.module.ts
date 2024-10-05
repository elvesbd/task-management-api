import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { HttpModule } from '@infra/http';
import { AuthModule } from '@infra/auth';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from '@infra/auth/guards';
import { DatabaseModule } from '@infra/database';
import { RolesGuard } from '@infra/auth/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60, // Tempo de vida (Time to live) em segundos
        limit: 10, // Número máximo de requisições por período
      },
    ]),
    DatabaseModule,
    HttpModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
