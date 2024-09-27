import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiCreatedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import {
  TaskViewModel,
  TaskVMResponse,
} from '@infra/http/presenters/view-models/task';
import { ApiPath, ApiTag } from '../constants';
import { CreateTaskUseCase } from '@core/task/usecases';
import { CreateTaskDto } from '@infra/http/presenters/controllers/task/dtos';

@ApiTags(ApiTag)
@Controller(ApiPath)
export class CreateTaskController {
  constructor(private readonly createTaskUseCase: CreateTaskUseCase) {}

  @ApiOperation({
    description: 'Create a new task.',
  })
  @ApiBody({
    type: CreateTaskDto,
    description: 'Task data for creation.',
  })
  @ApiCreatedResponse({
    description: 'Task created successfully.',
    type: TaskVMResponse,
  })
  @ApiNotFoundResponse({
    description: 'Tenant not found.',
  })
  @Post()
  public async createTask(@Body() dto: CreateTaskDto): Promise<TaskVMResponse> {
    const task = await this.createTaskUseCase.execute(dto);

    return TaskViewModel.toHTTP(task);
  }
}
