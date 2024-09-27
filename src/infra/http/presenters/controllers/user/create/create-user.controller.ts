import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiCreatedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import {
  UserViewModel,
  UserVMResponse,
} from '@infra/http/presenters/view-models/user';
import { ApiPath, ApiTag } from '../constants';
import { CreateUserUseCase } from '@core/user/usecases';
import { CreateUserDto } from '@infra/http/presenters/controllers/user/dtos';

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
  @Post('create')
  public async createUser(@Body() dto: CreateUserDto): Promise<UserVMResponse> {
    const user = await this.createUserUseCase.execute(dto);

    return UserViewModel.toHTTP(user);
  }
}
