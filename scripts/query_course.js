const {Client} = require('pg');
(async () => {
  const uri = 'postgresql://postgres%2Ewkxtdkycqapzkkngshlh:MolGXpIbEUSIAdKg@aws-1-eu-west-1.pooler.supabase.com:6543/postgres';
  const client = new Client({ connectionString: uri });
  try {
    await client.connect();
    const r = await client.query('SELECT * FROM "Course" WHERE "isPublished" = 1');
    console.log('rows', r.rows);
  } catch (e) {
    console.error('error', e.message);
  } finally {
    await client.end();
  }
})();
