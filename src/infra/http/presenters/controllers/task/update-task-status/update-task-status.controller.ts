import {
  Body,
  Controller,
  Param,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiBody,
} from '@nestjs/swagger';

import { ApiPath, ApiTag } from '../constants';
import { UpdateTaskStatusUseCase } from '@core/task/usecases';
import { UpdateTaskStatusDto } from '../dtos';
import { TaskStatus } from '@core/task/enum';

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
  ): Promise<void> {
    const tenantId = '019235bc-a54b-7117-98ba-9c6a2c4b2e2f';
    await this.updateTaskStatusUseCase.execute({
      id,
      tenantId,
      ...dto,
    });
  }
}
