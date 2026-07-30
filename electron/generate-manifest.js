// Exécuté à la construction (avant electron-builder) : transforme les
// migrations Prisma en un manifeste JSON simple, rejouable au premier
// lancement sans avoir à embarquer le CLI Prisma dans l'installateur.
const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(__dirname, '..', 'backend', 'prisma', 'migrations');
const outPath = path.join(__dirname, 'migrations-manifest.json');

const dossiers = fs
  .readdirSync(migrationsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const manifest = dossiers.map((name) => ({
  name,
  sql: fs.readFileSync(path.join(migrationsDir, name, 'migration.sql'), 'utf-8'),
}));

fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2));
console.log(`Manifeste de migrations généré : ${manifest.length} migration(s) -> ${outPath}`);
