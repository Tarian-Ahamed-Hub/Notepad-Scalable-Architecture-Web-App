 
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const USE_PGBOUNCER = process.env.USE_PGBOUNCER;

 
const POOL_MAX = USE_PGBOUNCER ? 50 : 10;  

 
const writePool = new Pool({
  connectionString: process.env.DATABASE_URL,  
  max: POOL_MAX,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const readPool = new Pool({
  connectionString: process.env.DATABASE_READ_URL || process.env.DATABASE_URL,
  max: POOL_MAX,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

 
const writeAdapter = new PrismaPg(writePool);
const readAdapter = new PrismaPg(readPool);

 
const prismaWrite = new PrismaClient({ adapter: writeAdapter });
const prismaRead = new PrismaClient({ adapter: readAdapter });

const connect = async () => {
  try {
    await Promise.all([prismaWrite.$connect(), prismaRead.$connect()]);
    
    const mode = USE_PGBOUNCER ? 'via PgBouncer' : 'direct to PostgreSQL';
    console.log(`Database connected ${mode}`);
    console.log(`Pool size : ${POOL_MAX*2} `);
  } catch (err) {
    console.error(`Connection failed:`, err.message);
    process.exit(1);
  }
};

const disconnect = async () => {
  await Promise.all([
    prismaWrite.$disconnect(),
    prismaRead.$disconnect(),
  ]);
  await Promise.all([writePool.end(), readPool.end()]);
};

process.on('SIGINT', disconnect);
process.on('SIGTERM', disconnect);

connect();

module.exports = {
  prisma: prismaWrite,  
  prismaWrite,
  prismaRead,
  connect,
};