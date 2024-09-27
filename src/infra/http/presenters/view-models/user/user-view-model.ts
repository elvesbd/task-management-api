import { User } from '@core/user/model';
import { BaseViewModel } from '@infra/http/presenters/view-models/base.view-model';
import { ApiProperty } from '@nestjs/swagger';

export class UserVMResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
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
