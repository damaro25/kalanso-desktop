// Copie le build React (frontend/dist) dans backend/dist/public, où
// ServeStaticModule le sert sur le même port que l'API.
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'frontend', 'dist');
const dest = path.join(__dirname, '..', 'backend', 'dist', 'public');

fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(src, dest, { recursive: true });
console.log(`Frontend copié : ${src} -> ${dest}`);
