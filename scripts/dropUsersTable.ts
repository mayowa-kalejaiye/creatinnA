import Database from "better-sqlite3";

const db = new Database("./data/dev.db");
db.prepare('DROP TABLE IF EXISTS "users"').run();
console.log('Dropped table "users"');
db.close();
