import { User } from '@core/user/model';
import { BaseViewModel } from '@infra/http/presenters/view-models/base.view-model';

type CreateUserVMResponse = {
  id: string;
};

export class CreateUserViewModel implements BaseViewModel {
  public static toHTTP(model: User): CreateUserVMResponse {
    return {
      id: model.id,
    };
  }
}
