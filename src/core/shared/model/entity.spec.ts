import { Entity } from '@core/shared/model/entity';

describe('Entity', () => {
  it('should create an entity with a provided ID', () => {
    const providedId = '123e4567-e89b-12d3-a456-426614174000';

    const entityProps = { id: providedId };
    const entity = new Entity(entityProps);

    expect(entity.id).toBe(providedId);
  });
});
