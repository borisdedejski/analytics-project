import { z } from 'zod';

export const EventScalarFieldEnumSchema = z.enum(['id','tenantId','userId','sessionId','eventType','timestamp','metadata']);

export default EventScalarFieldEnumSchema;
