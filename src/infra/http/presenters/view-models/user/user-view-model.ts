import { User } from '@core/user/model';
import { BaseViewModel } from '@infra/http/presenters/view-models/base.view-model';
import { ApiProperty } from '@nestjs/swagger';

export class UserVMResponse {
  @ApiProperty({
    example: '01890c8c-aa4c-7a0c-95ab-12b5049b3f4a',
    description: 'O UUID do usuário.',
  })
  id: string;

  @ApiProperty({
    example: 'Admin',
    description: 'O papel (role) do usuário dentro do sistema.',
  })
  role: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'O endereço de e-mail do usuário.',
  })
  email: string;

  @ApiProperty({
    example: '01890c8c-aa4c-7a0c-95ab-12b5049b3f4a',
    description: 'O UUID do inquilino ao qual o usuário pertence.',
  })
  tenantId: string;
}

export class UserViewModel implements BaseViewModel {
  public static toHTTP(model: User): UserVMResponse {
    return {
      id: model.id,
      role: model.role,
      email: model.email,
      tenantId: model.tenantId,
    };
  }

  public static toHTTPList(users: User[]): UserVMResponse[] {
    return users.map((user) => ({
      id: user.id,
      role: user.role,
      email: user.email,
      tenantId: user.tenantId,
    }));
  }
}
