import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiParam,
  ApiOperation,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { UserRole } from '@core/user/enum';
import { ApiPath, ApiTag } from '../constants';
import { DeleteTaskUseCase } from '@core/task/usecases';
import { GetCurrentTenantId, Roles } from '@infra/auth/decorators';

@Roles(UserRole.ADMIN)
@ApiBearerAuth()
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
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async deleteTask(
    @Param('id') id: string,
    @GetCurrentTenantId() tenantId: string,
  ): Promise<void> {
    await this.deleteTaskUseCase.execute({ id, tenantId });
  }
}
