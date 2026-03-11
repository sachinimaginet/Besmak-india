import { createPool, Pool } from 'mysql2/promise';

declare global {
  var mysqlPool: Pool | undefined;
}

const getPool = () => {
  if (global.mysqlPool) return global.mysqlPool;

  const url = process.env.DATABASE_URL || '';
  
  const isLocal = url.includes('localhost') || url.includes('127.0.0.1');
  const forcedSSL = url.includes('sslmode=require') || url.includes('ssl=true');
  const disabledSSL = url.includes('sslmode=disable') || url.includes('ssl=false');
  
  const pool = createPool({
    uri: url,
    waitForConnections: true,
    connectionLimit: 5, // Reduced from 10 to 5 to avoid "Too many connections" on the server
    maxIdle: 5,
    idleTimeout: 30000, // Reduced from 60000 to 30000ms
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    // Use SSL if explicitly requested OR (if remote and not explicitly disabled)
    ssl: forcedSSL || (!isLocal && !disabledSSL) ? { rejectUnauthorized: false } : undefined
  });

  if (process.env.NODE_ENV !== 'production') {
    global.mysqlPool = pool;
  }

  return pool;
};

export const query = async <T = any>(sql: string, params?: any[]): Promise<T> => {
  const connectionPool = getPool();
  try {
    const [results] = await connectionPool.query(sql, params || []);
    return results as T;
  } catch (error) {
    console.error('[DB Error] Query failed:', { sql, error });
    throw error;
  }
};

export default { query };
