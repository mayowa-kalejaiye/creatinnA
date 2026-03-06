import { getPublishedCoursesWithCounts } from '../lib/db-adapter.js';

process.env.SUPABASE_DB_URL = 'postgresql://postgres%2Ewkxtdkycqapzkkngshlh:MolGXpIbEUSIAdKg@aws-1-eu-west-1.pooler.supabase.com:6543/postgres';

(async () => {
  try {
    const rows = await getPublishedCoursesWithCounts();
    console.log('adapter rows:', rows);
  } catch (e) {
    console.error('adapter error', e);
  }
})();
