const {Client} = require('pg');
(async () => {
  const uri = process.env.SUPABASE_DB_URL ||
    'postgresql://postgres%2Ewkxtdkycqapzkkngshlh:MolGXpIbEUSIAdKg@aws-1-eu-west-1.pooler.supabase.com:6543/postgres';
  const client = new Client({ connectionString: uri });
  try {
    await client.connect();
    const res = await client.query('SELECT COUNT(1) as cnt FROM "Course"');
    console.log('Course count rows:', res.rows);
  } catch (e) {
    console.error('error', e.message);
  } finally {
    await client.end();
  }
})();
