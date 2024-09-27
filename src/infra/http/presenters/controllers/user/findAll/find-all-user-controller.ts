import { Body, Controller, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { ApiPath, ApiTag } from '../constants';
import { FindAllUserUseCase } from '@core/user/usecases';
import { UserViewModel } from '@infra/http/presenters/view-models/user';

@ApiTags(ApiTag)
@Controller(ApiPath)
export class FindAllUsersController {
  constructor(private readonly findAllUserUseCase: FindAllUserUseCase) {}

  @ApiOperation({
    description: 'Retrieve all users for a specific tenant.',
  })
  @ApiNotFoundResponse({
    description: 'Tenant not found or no users found for the tenant.',
  })
  @ApiOkResponse({
    description: 'Users retrieved successfully.',
    type: [UserViewModel],
  })
  @Get()
  public async findAllUsers(
    @Body() dto: { tenantId: string },
  ): Promise<UserViewModel[]> {
    const { tenantId } = dto;
    const users = await this.findAllUserUseCase.execute(tenantId);

    return UserViewModel.toHTTPList(users);
  }
}
