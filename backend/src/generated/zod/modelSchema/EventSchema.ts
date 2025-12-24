import { z } from 'zod';
import { JsonValueSchema } from '../inputTypeSchemas/JsonValueSchema'
import type { JsonValueType } from '../inputTypeSchemas/JsonValueSchema';
import { TenantWithRelationsSchema, TenantPartialWithRelationsSchema, TenantOptionalDefaultsWithRelationsSchema } from './TenantSchema'
import type { TenantWithRelations, TenantPartialWithRelations, TenantOptionalDefaultsWithRelations } from './TenantSchema'
import { UserWithRelationsSchema, UserPartialWithRelationsSchema, UserOptionalDefaultsWithRelationsSchema } from './UserSchema'
import type { UserWithRelations, UserPartialWithRelations, UserOptionalDefaultsWithRelations } from './UserSchema'

/////////////////////////////////////////
// EVENT SCHEMA
/////////////////////////////////////////

export const EventSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  userId: z.string().nullable(),
  sessionId: z.string(),
  eventType: z.string(),
  timestamp: z.coerce.date(),
  metadata: JsonValueSchema.nullable(),
})

export type Event = z.infer<typeof EventSchema>

/////////////////////////////////////////
// EVENT PARTIAL SCHEMA
/////////////////////////////////////////

export const EventPartialSchema = EventSchema.partial()

export type EventPartial = z.infer<typeof EventPartialSchema>

/////////////////////////////////////////
// EVENT OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const EventOptionalDefaultsSchema = EventSchema.merge(z.object({
  id: z.string().optional(),
  timestamp: z.coerce.date().optional(),
}))

export type EventOptionalDefaults = z.infer<typeof EventOptionalDefaultsSchema>

/////////////////////////////////////////
// EVENT RELATION SCHEMA
/////////////////////////////////////////

export type EventRelations = {
  tenant: TenantWithRelations;
  user?: UserWithRelations | null;
};

export type EventWithRelations = Omit<z.infer<typeof EventSchema>, "metadata"> & {
  metadata?: JsonValueType | null;
} & EventRelations

export const EventWithRelationsSchema: z.ZodType<EventWithRelations> = EventSchema.merge(z.object({
  tenant: z.lazy(() => TenantWithRelationsSchema),
  user: z.lazy(() => UserWithRelationsSchema).nullable(),
}))

/////////////////////////////////////////
// EVENT OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type EventOptionalDefaultsRelations = {
  tenant: TenantOptionalDefaultsWithRelations;
  user?: UserOptionalDefaultsWithRelations | null;
};

export type EventOptionalDefaultsWithRelations = Omit<z.infer<typeof EventOptionalDefaultsSchema>, "metadata"> & {
  metadata?: JsonValueType | null;
} & EventOptionalDefaultsRelations

export const EventOptionalDefaultsWithRelationsSchema: z.ZodType<EventOptionalDefaultsWithRelations> = EventOptionalDefaultsSchema.merge(z.object({
  tenant: z.lazy(() => TenantOptionalDefaultsWithRelationsSchema),
  user: z.lazy(() => UserOptionalDefaultsWithRelationsSchema).nullable(),
}))

/////////////////////////////////////////
// EVENT PARTIAL RELATION SCHEMA
/////////////////////////////////////////

export type EventPartialRelations = {
  tenant?: TenantPartialWithRelations;
  user?: UserPartialWithRelations | null;
};

export type EventPartialWithRelations = Omit<z.infer<typeof EventPartialSchema>, "metadata"> & {
  metadata?: JsonValueType | null;
} & EventPartialRelations

export const EventPartialWithRelationsSchema: z.ZodType<EventPartialWithRelations> = EventPartialSchema.merge(z.object({
  tenant: z.lazy(() => TenantPartialWithRelationsSchema),
  user: z.lazy(() => UserPartialWithRelationsSchema).nullable(),
})).partial()

export type EventOptionalDefaultsWithPartialRelations = Omit<z.infer<typeof EventOptionalDefaultsSchema>, "metadata"> & {
  metadata?: JsonValueType | null;
} & EventPartialRelations

export const EventOptionalDefaultsWithPartialRelationsSchema: z.ZodType<EventOptionalDefaultsWithPartialRelations> = EventOptionalDefaultsSchema.merge(z.object({
  tenant: z.lazy(() => TenantPartialWithRelationsSchema),
  user: z.lazy(() => UserPartialWithRelationsSchema).nullable(),
}).partial())

export type EventWithPartialRelations = Omit<z.infer<typeof EventSchema>, "metadata"> & {
  metadata?: JsonValueType | null;
} & EventPartialRelations

export const EventWithPartialRelationsSchema: z.ZodType<EventWithPartialRelations> = EventSchema.merge(z.object({
  tenant: z.lazy(() => TenantPartialWithRelationsSchema),
  user: z.lazy(() => UserPartialWithRelationsSchema).nullable(),
}).partial())

export default EventSchema;
