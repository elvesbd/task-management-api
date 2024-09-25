import { Entity } from '@core/shared/model/entity';

describe('Entity', () => {
  it('should create an entity with a provided ID', () => {
    const providedId = '123e4567-e89b-12d3-a456-426614174000';

    const entityProps = { id: providedId };
    const entity = new Entity(entityProps);

    expect(entity.id).toBe(providedId);
  });

  it('should create an entity and generate a new ID if none is provided', () => {
    const entityProps = {};
    const entity = new Entity(entityProps);

    const generatedId = entity.id;
    expect(generatedId).toBeDefined();
    expect(generatedId).toHaveLength(36);
  });

  it('should handle other properties while managing the ID', () => {
    const providedId = '123e4567-e89b-12d3-a456-426614174000';
    const entityProps = { id: providedId, otherProp: 'example' };

    const entity = new Entity(entityProps);

    expect(entity.id).toBe(providedId);
    expect(entityProps.otherProp).toBe('example');
  });
});
