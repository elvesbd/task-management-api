import { Controller, Get } from '@nestjs/common';
import { ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiPath, ApiTag } from './constant';
import { Public } from '@infra/auth/decorators';

class AppHealth {
  @ApiProperty()
  status: string;
  @ApiProperty()
  message: string;
  @ApiProperty()
  pid: number;
  @ApiProperty()
  memoryUsage: NodeJS.MemoryUsage;
}

@Public()
@ApiTags(ApiTag)
@Controller(ApiPath)
export class AppHealthController {
  @ApiResponse({
    status: 200,
    description: 'Returns application health information.',
    type: AppHealth,
  })
  @Get()
  checkAppHealth(): AppHealth {
    const memoryUsage = process.memoryUsage();
    return {
      status: 'ok',
      message: 'Application is running smoothly.',
      pid: process.pid,
      memoryUsage,
    };
  }
}
