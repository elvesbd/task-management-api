import { Controller, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { ApiPath, ApiTag } from '../constants';
import { FindAllUserUseCase } from '@core/user/usecases';
import {
  UserViewModel,
  UserVMResponse,
} from '@infra/http/presenters/view-models/user';
import { GetCurrentTenantId } from '@infra/auth/decorators';

@ApiBearerAuth()
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
    type: [UserVMResponse],
  })
  @Get()
  public async findAllUsers(
    @GetCurrentTenantId() tenantId: string,
  ): Promise<UserVMResponse[]> {
    const users = await this.findAllUserUseCase.execute(tenantId);

    return UserViewModel.toHTTPList(users);
  }
}
