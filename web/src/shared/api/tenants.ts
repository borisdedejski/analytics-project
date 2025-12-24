import { apiClient } from './client';
import { Tenant, TenantSchema } from '@/types/tenant';
import { z } from 'zod';

const TenantsArraySchema = z.array(TenantSchema);

export const tenantsApi = {
  getTenants: async (): Promise<Tenant[]> => {
    const data = await apiClient.get<Tenant[]>('/tenants');
    return TenantsArraySchema.parse(data);
  },

  getTenant: async (tenantId: string): Promise<Tenant> => {
    const data = await apiClient.get<Tenant>(`/tenants/${tenantId}`);
    return TenantSchema.parse(data);
  },
};

