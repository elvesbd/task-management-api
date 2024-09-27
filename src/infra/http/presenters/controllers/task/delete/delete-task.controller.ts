import { Body, Controller, Delete, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiParam,
  ApiOperation,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ApiPath, ApiTag } from '../constants';
import { DeleteTaskUseCase } from '@core/task/usecases';

@ApiTags(ApiTag)
@Controller(ApiPath)
export class DeleteTaskController {
  constructor(private readonly deleteTaskUseCase: DeleteTaskUseCase) {}

  @ApiOperation({
    description: 'Delete a task by ID.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the task to delete.',
    type: String,
  })
  @ApiNotFoundResponse({
    description: 'Task or tenant not found.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized to perform this operation.',
  })
  @Delete(':id')
  public async deleteTask(
    @Param('id') id: string,
    @Body() body: { tenantId: string },
  ): Promise<void> {
    const input = {
      id,
      tenantId: body.tenantId,
    };

    await this.deleteTaskUseCase.execute(input);
  }
}
