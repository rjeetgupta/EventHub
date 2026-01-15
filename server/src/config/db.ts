import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js';

/**
 * Database Configuration
 * Uses Prisma ORM with PostgreSQL adapter
 *
 * Environment Required:
 * DATABASE_URL - PostgreSQL connection string
 *
 * @example
 * DATABASE_URL=postgresql://user:password@localhost:5432/EventHub
 */
const connectionString = `${process.env.DATABASE_URL}`;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

/**
 * Initialize Prisma with PostgreSQL Adapter
 * Uses PrismaPg for better PostgreSQL support
 */
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

/**
 * Log Prisma queries in development mode
 */
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    console.log('Query: ' + e.query);
  });
}

export { prisma };