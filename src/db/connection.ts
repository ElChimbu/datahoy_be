import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Database connection pool using PostgreSQL
 * Optimized for Neon (serverless PostgreSQL)
 * 
 * Neon requires SSL connections and works best with connection pooling
 */
class Database {
  private pool: Pool | null = null;

  /**
   * Initialize database connection pool
   * Neon requires SSL for all connections
   */
  initialize(): Pool {
    if (this.pool) {
      return this.pool;
    }

    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    // Neon requires SSL for all connections
    // Connection string from Neon already includes SSL parameters
    this.pool = new Pool({
      connectionString: databaseUrl,
      // Neon requires SSL - connection string usually includes ?sslmode=require
      // But we set it explicitly to be safe
      ssl: {
        rejectUnauthorized: false, // Neon uses self-signed certificates
      },
      // Connection pool settings optimized for serverless
      max: 10, // Reduced for serverless (Neon handles pooling)
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000, // Increased timeout for serverless
    });

    // Test connection
    this.pool.on('connect', () => {
      console.log('✅ Database connected successfully to Neon');
    });

    this.pool.on('error', (err) => {
      console.error('❌ Unexpected error on idle client', err);
      // Don't exit in production, just log the error
      if (process.env.NODE_ENV !== 'production') {
        process.exit(-1);
      }
    });

    return this.pool;
  }

  /**
   * Get database pool instance
   */
  getPool(): Pool {
    if (!this.pool) {
      return this.initialize();
    }
    return this.pool;
  }

  /**
   * Execute a query
   */
  async query(text: string, params?: any[]): Promise<any> {
    const pool = this.getPool();
    const start = Date.now();
    
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      console.log('Executed query', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      console.error('Query error', { text, error });
      throw error;
    }
  }

  /**
   * Get a client from the pool for transactions
   */
  async getClient(): Promise<PoolClient> {
    return this.getPool().connect();
  }

  /**
   * Close all database connections
   */
  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      console.log('Database pool closed');
    }
  }
}

// Singleton instance
const db = new Database();

export default db;

