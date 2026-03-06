const {Client}=require('pg');
(async()=>{
  const uri='postgresql://postgres%2Ewkxtdkycqapzkkngshlh:MolGXpIbEUSIAdKg@aws-1-eu-west-1.pooler.supabase.com:6543/postgres';
  const c=new Client({connectionString:uri});
  await c.connect();
  const tables=['Course','Module','Lesson','Enrollment','Payment','Progress','Cohort','applications','users'];
  for(const t of tables){
    const r=await c.query(`SELECT COUNT(1) as cnt FROM \"${t}\"`);
    console.log(t,r.rows[0].cnt);
  }
  await c.end();
})();
