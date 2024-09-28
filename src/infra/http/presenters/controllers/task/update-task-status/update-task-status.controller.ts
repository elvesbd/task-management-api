import {
  Body,
  Put,
  Param,
  HttpCode,
  Controller,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiParam,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { ApiPath, ApiTag } from '../constants';
import { UpdateTaskStatusDto } from '../dtos';
import { TaskStatus } from '@core/task/enum';
import { GetCurrentTenantId } from '@infra/auth/decorators';
import { UpdateTaskStatusUseCase } from '@core/task/usecases';

@ApiBearerAuth()
@ApiTags(ApiTag)
@Controller(ApiPath)
export class UpdateTaskStatusController {
  constructor(
    private readonly updateTaskStatusUseCase: UpdateTaskStatusUseCase,
  ) {}

  @ApiOperation({
    description: 'Update the status of an existing task.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the task to update the status.',
    type: String,
  })
  @ApiBody({
    type: UpdateTaskStatusDto,
    enum: TaskStatus,
    description: 'DTO containing tenantId and the new status for the task.',
  })
  @ApiOkResponse({
    description: 'Task status updated successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Tenant or Task not found.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id/status')
  public async updateTaskStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTaskStatusDto,
    @GetCurrentTenantId() tenantId: string,
  ): Promise<void> {
    await this.updateTaskStatusUseCase.execute({
      ...dto,
      id,
      tenantId,
    });
  }
}
