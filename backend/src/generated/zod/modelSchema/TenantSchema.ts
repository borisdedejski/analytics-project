import { z } from 'zod';
import { UserWithRelationsSchema, UserPartialWithRelationsSchema, UserOptionalDefaultsWithRelationsSchema } from './UserSchema'
import type { UserWithRelations, UserPartialWithRelations, UserOptionalDefaultsWithRelations } from './UserSchema'
import { EventWithRelationsSchema, EventPartialWithRelationsSchema, EventOptionalDefaultsWithRelationsSchema } from './EventSchema'
import type { EventWithRelations, EventPartialWithRelations, EventOptionalDefaultsWithRelations } from './EventSchema'
import { MetricWithRelationsSchema, MetricPartialWithRelationsSchema, MetricOptionalDefaultsWithRelationsSchema } from './MetricSchema'
import type { MetricWithRelations, MetricPartialWithRelations, MetricOptionalDefaultsWithRelations } from './MetricSchema'

/////////////////////////////////////////
// TENANT SCHEMA
/////////////////////////////////////////

export const TenantSchema = z.object({
  id: z.string(),
  name: z.string(),
  region: z.string(),
  plan: z.string(),
  createdAt: z.coerce.date(),
})

export type Tenant = z.infer<typeof TenantSchema>

/////////////////////////////////////////
// TENANT PARTIAL SCHEMA
/////////////////////////////////////////

export const TenantPartialSchema = TenantSchema.partial()

export type TenantPartial = z.infer<typeof TenantPartialSchema>

/////////////////////////////////////////
// TENANT OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const TenantOptionalDefaultsSchema = TenantSchema.merge(z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
}))

export type TenantOptionalDefaults = z.infer<typeof TenantOptionalDefaultsSchema>

/////////////////////////////////////////
// TENANT RELATION SCHEMA
/////////////////////////////////////////

export type TenantRelations = {
  users: UserWithRelations[];
  events: EventWithRelations[];
  metrics: MetricWithRelations[];
};

export type TenantWithRelations = z.infer<typeof TenantSchema> & TenantRelations

export const TenantWithRelationsSchema: z.ZodType<TenantWithRelations> = TenantSchema.merge(z.object({
  users: z.lazy(() => UserWithRelationsSchema).array(),
  events: z.lazy(() => EventWithRelationsSchema).array(),
  metrics: z.lazy(() => MetricWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// TENANT OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type TenantOptionalDefaultsRelations = {
  users: UserOptionalDefaultsWithRelations[];
  events: EventOptionalDefaultsWithRelations[];
  metrics: MetricOptionalDefaultsWithRelations[];
};

export type TenantOptionalDefaultsWithRelations = z.infer<typeof TenantOptionalDefaultsSchema> & TenantOptionalDefaultsRelations

export const TenantOptionalDefaultsWithRelationsSchema: z.ZodType<TenantOptionalDefaultsWithRelations> = TenantOptionalDefaultsSchema.merge(z.object({
  users: z.lazy(() => UserOptionalDefaultsWithRelationsSchema).array(),
  events: z.lazy(() => EventOptionalDefaultsWithRelationsSchema).array(),
  metrics: z.lazy(() => MetricOptionalDefaultsWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// TENANT PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type TenantPartialRelations = {
  users?: UserPartialWithRelations[];
  events?: EventPartialWithRelations[];
  metrics?: MetricPartialWithRelations[];
};

export type TenantPartialWithRelations = z.infer<typeof TenantPartialSchema> & TenantPartialRelations

export const TenantPartialWithRelationsSchema: z.ZodType<TenantPartialWithRelations> = TenantPartialSchema.merge(z.object({
  users: z.lazy(() => UserPartialWithRelationsSchema).array(),
  events: z.lazy(() => EventPartialWithRelationsSchema).array(),
  metrics: z.lazy(() => MetricPartialWithRelationsSchema).array(),
})).partial()

export type TenantOptionalDefaultsWithPartialRelations = z.infer<typeof TenantOptionalDefaultsSchema> & TenantPartialRelations

export const TenantOptionalDefaultsWithPartialRelationsSchema: z.ZodType<TenantOptionalDefaultsWithPartialRelations> = TenantOptionalDefaultsSchema.merge(z.object({
  users: z.lazy(() => UserPartialWithRelationsSchema).array(),
  events: z.lazy(() => EventPartialWithRelationsSchema).array(),
  metrics: z.lazy(() => MetricPartialWithRelationsSchema).array(),
}).partial())

export type TenantWithPartialRelations = z.infer<typeof TenantSchema> & TenantPartialRelations

export const TenantWithPartialRelationsSchema: z.ZodType<TenantWithPartialRelations> = TenantSchema.merge(z.object({
  users: z.lazy(() => UserPartialWithRelationsSchema).array(),
  events: z.lazy(() => EventPartialWithRelationsSchema).array(),
  metrics: z.lazy(() => MetricPartialWithRelationsSchema).array(),
}).partial())

export default TenantSchema;
