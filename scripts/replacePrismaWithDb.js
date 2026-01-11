/**
 * Scans project files and replaces imports from lib/prisma to import { db }.
 * Also renames runtime occurrences of "db." to "db.".
 *
 * Usage: node scripts/replacePrismaWithDb.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const IGNORED = ['node_modules', '.next', 'drizzle', 'drizzle/migrations', 'dist'];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (IGNORED.some(i => full.includes(path.join(ROOT, i)))) continue;
    if (e.isDirectory()) walk(full);
    else if (/\.(js|ts|jsx|tsx)$/.test(e.name)) processFile(full);
  }
}

function processFile(file) {
  let src = fs.readFileSync(file, 'utf8');
  const orig = src;

  // Replace named import containing prisma: import { db, x } from '.../lib/prisma'
  src = src.replace(/import\s*\{\s*([^}]*?)\s*\}\s*from\s*(['"][^'"]*lib\/prisma['"])/g, (m, imports, fromPath) => {
    const items = imports.split(',').map(s => s.trim()).filter(Boolean);
    const hasPrisma = items.includes('prisma');
    if (!hasPrisma) return m;
    const newItems = items.map(it => (it === 'prisma' ? 'db' : it)).join(', ');
    return `import { ${newItems} } from ${fromPath}`;
  });

  // Replace default import: import { db } from '.../lib/prisma'
  src = src.replace(/import\s+([A-Za-z0-9_$]+)\s+from\s+(['"][^'"]*lib\/prisma['"])/g, (m, def, fromPath) => {
    if (def !== 'prisma') return m;
    return `import { db } from ${fromPath}`;
  });

  // Replace namespace import: import * as prismaClient from '.../lib/prisma'
  src = src.replace(/import\s+\*\s+as\s+([A-Za-z0-9_$]+)\s+from\s+(['"][^'"]*lib\/prisma['"])/g, (m, name, fromPath) => {
    if (name !== 'prisma') return m;
    return `import { db as ${name} } from ${fromPath}`;
  });

  // Replace direct require usages: const { db } = require('.../lib/prisma')
  src = src.replace(/(const|let|var)\s*\{\s*([^}]*?)\s*\}\s*=\s*require\((['"][^'"]*lib\/prisma['"])\)/g, (m, decl, imports, reqPath) => {
    const items = imports.split(',').map(s => s.trim());
    if (items.includes('prisma')) {
      const newItems = items.map(it => (it === 'prisma' ? 'db' : it)).join(', ');
      return `${decl} { ${newItems} } = require(${reqPath})`;
    }
    return m;
  });

  // Replace simple require default: const { db } = require('.../lib/prisma')
  src = src.replace(/(const|let|var)\s+prisma\s*=\s*require\((['"][^'"]*lib\/prisma['"])\)/g, (m, decl, reqPath) => {
    return `const { db } = require(${reqPath})`;
  });

  // Replace runtime occurrences db. -> db.
  src = src.replace(/(\b)prisma\./g, '$1db.');

  if (src !== orig) {
    fs.writeFileSync(file, src, 'utf8');
    console.log('patched:', path.relative(ROOT, file));
  }
}

console.log('Scanning project and replacing prisma -> db imports/usages...');
walk(ROOT);
console.log('Done.');
// Run this script, then manually adapt DB calls to Drizzle/sqlite adapter functions.
