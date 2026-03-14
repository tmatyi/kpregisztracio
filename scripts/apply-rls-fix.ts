import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyMigration() {
  const migrationPath = path.join(__dirname, '../supabase/migrations/fix_rls_policies.sql')
  const sql = fs.readFileSync(migrationPath, 'utf8')

  console.log('Applying RLS policy fixes...')
  console.log('SQL:', sql)

  // Split by semicolon and execute each statement
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0)

  for (const statement of statements) {
    console.log('\nExecuting:', statement.substring(0, 100) + '...')
    const { error } = await supabase.rpc('exec_sql', { sql_query: statement })
    
    if (error) {
      console.error('Error:', error)
    } else {
      console.log('✓ Success')
    }
  }

  console.log('\nMigration complete!')
}

applyMigration().catch(console.error)
