import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import {
  UserViewModel,
  UserVMResponse,
} from '@infra/http/presenters/view-models/user';
import { ApiPath, ApiTag } from '../constants';
import { CreateUserUseCase } from '@core/user/usecases';
import { CreateUserDto } from '@infra/http/presenters/controllers/user/dtos';
import { GetCurrentTenantId } from '@infra/auth/decorators';

@ApiBearerAuth()
@ApiTags(ApiTag)
@Controller(ApiPath)
export class CreateUserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @ApiOperation({
    description: 'Create a new user.',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User data for creation.',
  })
  @ApiCreatedResponse({
    description: 'User created successfully.',
    type: UserVMResponse,
  })
  @ApiNotFoundResponse({
    description: 'Tenant not found.',
  })
  @ApiConflictResponse({
    description: 'User already register.',
  })
  @Post()
  public async createUser(
    @Body() dto: CreateUserDto,
    @GetCurrentTenantId() tenantId: string,
  ): Promise<UserVMResponse> {
    const user = await this.createUserUseCase.execute({ ...dto, tenantId });

    return UserViewModel.toHTTP(user);
  }
}
