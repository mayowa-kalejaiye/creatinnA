import Database from "better-sqlite3";

const db = new Database("./data/dev.db");
db.prepare('DROP TABLE IF EXISTS "User"').run();
console.log('Dropped table "User"');
db.close();
