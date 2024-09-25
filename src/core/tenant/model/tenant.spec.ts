import { Tenant } from '@core/tenant/model';
import { TenantDataBuilder } from '@test/__mocks__/data-builder/tenant';

describe('Tenant Model', () => {
  const props = TenantDataBuilder.anTenant().build();
  const tenant = TenantDataBuilder.anTenant().withId().build();
  console.log('props', props);

  describe('constructor', () => {
    it('should create a new Tenant on success', () => {
      const result = new Tenant(tenant);

      expect(result.id).toBe(tenant.id);
      expect(result.name).toBe(tenant.name);
      expect(result.document).toBe(tenant.document);
    });
  });

  describe('create', () => {
    it('should create a Tenant using the static create method', () => {
      const result = Tenant.create(props);

      expect(result.id).toBeDefined();
      expect(result.name).toBe(props.name);
      expect(result.document).toBe(props.document);
    });
  });
});
