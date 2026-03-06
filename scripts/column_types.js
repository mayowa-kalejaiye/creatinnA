const {Client} = require('pg');
(async () => {
  const uri = 'postgresql://postgres%2Ewkxtdkycqapzkkngshlh:MolGXpIbEUSIAdKg@aws-1-eu-west-1.pooler.supabase.com:6543/postgres';
  const c = new Client({ connectionString: uri });
  try {
    await c.connect();
    const r = await c.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='Course'");
    console.log(r.rows);
  } catch (e) {
    console.error('err', e.message);
  } finally {
    await c.end();
  }
})();
