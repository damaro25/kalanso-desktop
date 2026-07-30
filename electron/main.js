const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const Database = require('better-sqlite3');

function ensureDirs(userData) {
  const dbDir = path.join(userData, 'db');
  const uploadsDir = path.join(userData, 'uploads', 'admissions');
  fs.mkdirSync(dbDir, { recursive: true });
  fs.mkdirSync(uploadsDir, { recursive: true });
  return { dbDir, uploadsDir };
}

// Généré une seule fois au tout premier lancement puis réutilisé : sans ça,
// chaque redémarrage de l'appli invaliderait toutes les sessions ouvertes.
function ensureJwtSecret(userData) {
  const secretPath = path.join(userData, 'secret.json');
  if (fs.existsSync(secretPath)) {
    return JSON.parse(fs.readFileSync(secretPath, 'utf-8')).jwtSecret;
  }
  const secret = crypto.randomBytes(64).toString('hex');
  fs.writeFileSync(secretPath, JSON.stringify({ jwtSecret: secret }));
  return secret;
}

// Rejoue les migrations Prisma non encore appliquées directement via
// better-sqlite3, sans embarquer le CLI Prisma dans l'installateur.
function runMigrations(dbPath) {
  const manifestPath = path.join(__dirname, 'migrations-manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

  const db = new Database(dbPath);
  try {
    db.pragma('journal_mode = WAL');
    db.exec('CREATE TABLE IF NOT EXISTS _kalanso_migrations (name TEXT PRIMARY KEY, appliedAt TEXT NOT NULL)');
    const dejaAppliquees = new Set(db.prepare('SELECT name FROM _kalanso_migrations').all().map((r) => r.name));

    for (const { name, sql } of manifest) {
      if (dejaAppliquees.has(name)) continue;
      const rejouer = db.transaction(() => {
        db.exec(sql);
        db.prepare('INSERT INTO _kalanso_migrations (name, appliedAt) VALUES (?, ?)').run(name, new Date().toISOString());
      });
      rejouer();
    }
  } finally {
    db.close();
  }
}

async function main() {
  await app.whenReady();

  const userData = app.getPath('userData');
  const { dbDir, uploadsDir } = ensureDirs(userData);
  const dbPath = path.join(dbDir, 'kalanso.db');

  process.env.DATABASE_URL = `file:${dbPath}`;
  process.env.JWT_SECRET = ensureJwtSecret(userData);
  process.env.JWT_EXPIRES_IN = '8h';
  process.env.UPLOADS_DIR = uploadsDir;
  process.env.PORT = '0';

  runMigrations(dbPath);

  // NestJS tourne dans ce même processus (pas de serveur séparé) : le build
  // du backend expose bootstrap(), qui retourne l'URL réellement attribuée.
  // nest build sort dans dist/src/ (voir commentaire dans app.module.ts).
  const { bootstrap } = require(path.join(__dirname, '..', 'backend', 'dist', 'src', 'main'));
  const url = await bootstrap();

  const fenetre = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'Kalanso',
  });
  fenetre.loadURL(url);
}

app.on('window-all-closed', () => {
  app.quit();
});

main().catch((erreur) => {
  console.error('Échec du démarrage de Kalanso :', erreur);
  app.quit();
});
