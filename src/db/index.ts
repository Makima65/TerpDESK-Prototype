import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Ensure DATABASE_URL is set in your .env.local file
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/terpdesk';

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
