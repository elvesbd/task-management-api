import { Id } from '@core/shared/value-objects';
import { v7 as uuidv7, validate as validateUUID } from 'uuid';

jest.mock('uuid', () => ({
  v7: jest.fn(),
  validate: jest.requireActual('uuid').validate,
}));

describe('Id Value Object', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate a valid UUID if no value is provided', () => {
    const mockUuid = '019229dc-e8c6-72cc-b599-c938df401967';
    (uuidv7 as jest.Mock).mockReturnValue(mockUuid);

    const id = new Id();

    expect(validateUUID(id.value)).toBe(true);
    expect(id.value).toBe(mockUuid);
    expect(uuidv7).toHaveBeenCalled();
  });

  it('should use the provided value if passed to the constructor', () => {
    const providedUuid = '123e4567-e89b-12d3-a456-426614174000';

    const id = new Id(providedUuid);

    expect(id.value).toBe(providedUuid);
    expect(uuidv7).not.toHaveBeenCalled();
  });
});
