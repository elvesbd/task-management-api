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

  describe('create', () => {
    it('should create a User using the static create method', () => {
      const user = User.create(props);

      expect(user.id).toBeDefined();
      expect(user.email).toBe(props.email);
      expect(user.role).toBe(props.role);
      expect(user.password).toBe(props.password);
      expect(user.tenantId).toBe(props.tenantId);
    });
  });

  describe('update', () => {
    it('should update user email on success', () => {
      const user = new User(userMock);
      const updateProps = UserDataBuilder.aUser()
        .withEmail('newemail@example.com')
        .build();

      user.update(updateProps);

      expect(user.id).toBe(userMock.id);
      expect(user.email).toBe(updateProps.email);
    });
  });
});
