import fs from 'fs';
import path from 'path';
import db from './connection';

/**
 * Run database migrations
 * Executes SQL statements one by one for better error handling
 */
async function migrate() {
  try {
    console.log('🔄 Starting database migration for Neon...');
    
    // Initialize database connection
    db.initialize();
    
    // Test connection first
    await db.query('SELECT NOW()');
    console.log('✅ Database connection established');
    
    // Read migration file
    const migrationPath = path.join(__dirname, '../../migrations/001_create_pages_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
    
    // Split SQL by semicolons and execute each statement
    // Filter out empty statements and comments
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && s !== '$$');
    
    console.log(`📝 Executing ${statements.length} SQL statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      // Skip empty statements and standalone comment blocks
      if (statement.length < 10 || statement.startsWith('--')) {
        continue;
      }
      
      try {
        // Add semicolon back for execution
        await db.query(statement + ';');
        console.log(`✅ Statement ${i + 1}/${statements.length} executed`);
      } catch (error: any) {
        // Some statements like DROP TRIGGER IF EXISTS may fail if trigger doesn't exist
        // That's OK, we can continue
        if (error.message && error.message.includes('does not exist')) {
          console.log(`⚠️  Statement ${i + 1} skipped (${error.message.split('\n')[0]})`);
        } else {
          throw error;
        }
      }
    }
    
    // Verify table was created
    const result = await db.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'pages'
      );
    `);
    
    if (result.rows[0].exists) {
      console.log('✅ Migration completed successfully');
      console.log('✅ Pages table verified');
      
      // Check if table has the correct structure
      const columns = await db.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'pages'
        ORDER BY ordinal_position;
      `);
      
      console.log(`✅ Table has ${columns.rows.length} columns`);
    } else {
      throw new Error('Migration completed but table was not created');
    }
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Migration failed:');
    console.error(error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

migrate();

