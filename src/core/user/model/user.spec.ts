import { User } from '@core/user/model';
import { UserRole } from '@core/user/enum';
import { UserDataBuilder } from '@test/__mocks__/data-builder/user';

describe('User Model', () => {
  const props = UserDataBuilder.aUser().build();
  const userMock = UserDataBuilder.aUser().withId().build();

  describe('constructor', () => {
    it('should create a new User on success', () => {
      const user = new User(userMock);

      expect(user.id).toBe(userMock.id);
      expect(user.email).toBe(userMock.email);
      expect(user.role).toBe(userMock.role);
      expect(user.password).toBe(userMock.password);
      expect(user.tenantId).toBe(userMock.tenantId);
    });
  });
});
