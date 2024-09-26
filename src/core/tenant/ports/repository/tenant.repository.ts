import { Tenant } from '@core/tenant/model';

export abstract class TenantRepository {
  abstract findAll(): Promise<Tenant[]>;
  abstract delete(id: string): Promise<void>;
  abstract save(tenant: Tenant): Promise<void>;
  abstract findById(id: string): Promise<Tenant>;
  abstract findByDocument(document: string): Promise<Tenant | null>;
}
