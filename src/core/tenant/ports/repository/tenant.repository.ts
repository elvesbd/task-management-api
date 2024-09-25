import { Tenant } from '@core/tenant/model';

export abstract class TenantRepository {
  abstract save(tenant: Tenant): Promise<void>;
  abstract findByDocument(document: string): Promise<Tenant | null>;
}
