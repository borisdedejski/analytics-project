import { z } from 'zod';

export const MetricScalarFieldEnumSchema = z.enum(['id','tenantId','serviceName','metricName','timestamp','value']);

export default MetricScalarFieldEnumSchema;
