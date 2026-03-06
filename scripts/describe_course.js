const {Client} = require('pg');
(async () => {
  const uri = 'postgresql://postgres%2Ewkxtdkycqapzkkngshlh:MolGXpIbEUSIAdKg@aws-1-eu-west-1.pooler.supabase.com:6543/postgres';
  const client = new Client({ connectionString: uri });
  try {
    await client.connect();
    const r = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='Course'");
    console.log(r.rows);
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
})();
