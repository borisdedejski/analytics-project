import { z } from 'zod';

export const TenantScalarFieldEnumSchema = z.enum(['id','name','region','plan','createdAt']);

export default TenantScalarFieldEnumSchema;
