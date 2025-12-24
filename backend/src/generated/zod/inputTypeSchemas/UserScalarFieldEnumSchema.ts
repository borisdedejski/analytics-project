import { z } from 'zod';

export const UserScalarFieldEnumSchema = z.enum(['id','tenantId','email','role','createdAt']);

export default UserScalarFieldEnumSchema;
