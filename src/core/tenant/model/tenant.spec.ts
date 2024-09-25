import { Tenant } from '@core/tenant/model';
import { TenantDataBuilder } from '@test/__mocks__/data-builder/tenant';

describe('Tenant Model', () => {
  const props = TenantDataBuilder.anTenant().build();
  const tenantMock = TenantDataBuilder.anTenant().withId().build();

  describe('constructor', () => {
    it('should create a new Tenant on success', () => {
      const tenant = new Tenant(tenantMock);

      expect(tenant.id).toBe(tenantMock.id);
      expect(tenant.name).toBe(tenantMock.name);
      expect(tenant.document).toBe(tenantMock.document);
    });
  });

  describe('create', () => {
    it('should create a Tenant using the static create method', () => {
      const tenant = Tenant.create(props);

      expect(tenant.id).toBeDefined();
      expect(tenant.name).toBe(props.name);
      expect(tenant.document).toBe(props.document);
    });
  });

  describe('update', () => {
    it('should update tenant name on success', () => {
      const tenant = new Tenant(tenantMock);
      const updateProps = TenantDataBuilder.anTenant()
        .withName('Horizon Technologies')
        .build();

      tenant.update(updateProps);

      expect(tenant.id).toBe(tenantMock.id);
      expect(tenant.name).toBe(updateProps.name);
    });

    it('should update tenant document on success', () => {
      const tenant = new Tenant(tenantMock);
      const updateProps = TenantDataBuilder.anTenant()
        .withDocument('16550433000120')
        .build();

      tenant.update(updateProps);

      expect(tenant.id).toBe(tenantMock.id);
      expect(tenant.document).toBe(updateProps.document);
    });

    it('should update tenant name and document on success', () => {
      const tenant = new Tenant(tenantMock);
      const updateProps = TenantDataBuilder.anTenant()
        .withName('Horizon Technologies')
        .withDocument('16550433000120')
        .build();

      tenant.update(updateProps);

      expect(tenant.id).toBe(tenantMock.id);
      expect(tenant.name).toBe(updateProps.name);
      expect(tenant.document).toBe(updateProps.document);
    });
  });
});
