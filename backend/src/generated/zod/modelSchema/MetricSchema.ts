import { z } from 'zod';
import { TenantWithRelationsSchema, TenantPartialWithRelationsSchema, TenantOptionalDefaultsWithRelationsSchema } from './TenantSchema'
import type { TenantWithRelations, TenantPartialWithRelations, TenantOptionalDefaultsWithRelations } from './TenantSchema'

/////////////////////////////////////////
// METRIC SCHEMA
/////////////////////////////////////////

export const MetricSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  serviceName: z.string(),
  metricName: z.string(),
  timestamp: z.coerce.date(),
  value: z.number(),
})

export type Metric = z.infer<typeof MetricSchema>

/////////////////////////////////////////
// METRIC PARTIAL SCHEMA
/////////////////////////////////////////

export const MetricPartialSchema = MetricSchema.partial()

export type MetricPartial = z.infer<typeof MetricPartialSchema>

/////////////////////////////////////////
// METRIC OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const MetricOptionalDefaultsSchema = MetricSchema.merge(z.object({
  id: z.string().optional(),
  timestamp: z.coerce.date().optional(),
}))

export type MetricOptionalDefaults = z.infer<typeof MetricOptionalDefaultsSchema>

/////////////////////////////////////////
// METRIC RELATION SCHEMA
/////////////////////////////////////////

export type MetricRelations = {
  tenant: TenantWithRelations;
};

export type MetricWithRelations = z.infer<typeof MetricSchema> & MetricRelations

export const MetricWithRelationsSchema: z.ZodType<MetricWithRelations> = MetricSchema.merge(z.object({
  tenant: z.lazy(() => TenantWithRelationsSchema),
}))

/////////////////////////////////////////
// METRIC OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type MetricOptionalDefaultsRelations = {
  tenant: TenantOptionalDefaultsWithRelations;
};

export type MetricOptionalDefaultsWithRelations = z.infer<typeof MetricOptionalDefaultsSchema> & MetricOptionalDefaultsRelations

export const MetricOptionalDefaultsWithRelationsSchema: z.ZodType<MetricOptionalDefaultsWithRelations> = MetricOptionalDefaultsSchema.merge(z.object({
  tenant: z.lazy(() => TenantOptionalDefaultsWithRelationsSchema),
}))

/////////////////////////////////////////
// METRIC PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type MetricPartialRelations = {
  tenant?: TenantPartialWithRelations;
};

export type MetricPartialWithRelations = z.infer<typeof MetricPartialSchema> & MetricPartialRelations

export const MetricPartialWithRelationsSchema: z.ZodType<MetricPartialWithRelations> = MetricPartialSchema.merge(z.object({
  tenant: z.lazy(() => TenantPartialWithRelationsSchema),
})).partial()

export type MetricOptionalDefaultsWithPartialRelations = z.infer<typeof MetricOptionalDefaultsSchema> & MetricPartialRelations

export const MetricOptionalDefaultsWithPartialRelationsSchema: z.ZodType<MetricOptionalDefaultsWithPartialRelations> = MetricOptionalDefaultsSchema.merge(z.object({
  tenant: z.lazy(() => TenantPartialWithRelationsSchema),
}).partial())

export type MetricWithPartialRelations = z.infer<typeof MetricSchema> & MetricPartialRelations

export const MetricWithPartialRelationsSchema: z.ZodType<MetricWithPartialRelations> = MetricSchema.merge(z.object({
  tenant: z.lazy(() => TenantPartialWithRelationsSchema),
}).partial())

export default MetricSchema;
