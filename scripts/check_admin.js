require('dotenv').config()
const { Pool } = require('pg')

async function main() {
  const conn = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL
  if (!conn) {
    console.error('No SUPABASE_DB_URL or DATABASE_URL in environment')
    process.exit(1)
  }
  const pool = new Pool({ connectionString: conn })
  try {
    const id = 'f10dd536-1279-4d16-9dae-6e5d1ef4be2e'
    const res = await pool.query('SELECT id,email,password FROM "users" WHERE id = $1', [id])
    console.log('rows:', JSON.stringify(res.rows, null, 2))
  } catch (e) {
    console.error('query failed:', e)
  } finally {
    await pool.end()
  }
}

main()
