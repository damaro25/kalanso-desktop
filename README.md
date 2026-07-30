# Kalanso Desktop

Version 100% hors-ligne de [Kalanso](https://github.com/damaro25/kalanso), l'ERP scolaire pour les écoles privées guinéennes. Contrairement à la version web (SaaS multi-écoles, connectée), cette version s'installe entièrement sur l'ordinateur d'une école et fonctionne sans aucune connexion internet : base de données SQLite locale, backend et frontend empaquetés dans une seule application Electron.

## Architecture

- **Frontend** : React + Vite + Mantine (repris du projet web, sans la couche de synchronisation hors-ligne/en-ligne qui n'a pas lieu d'être ici).
- **Backend** : NestJS + Prisma, porté de PostgreSQL vers **SQLite** (`better-sqlite3` + `@prisma/adapter-better-sqlite3`).
- **Electron** (`electron/main.js`) : lance NestJS *dans son propre processus* (pas de serveur séparé) sur un port choisi par l'OS, et sert le build React sur ce même port (`@nestjs/serve-static`) — même origine, pas de CORS.
- **Mono-tenant** : chaque installation ne gère qu'une seule école, créée une fois pour toutes via l'écran de premier démarrage (`/setup`).

## Prérequis

- Node.js 22+
- npm
- Windows (cible actuelle de l'installateur — `electron-builder` peut être reconfiguré pour macOS/Linux si besoin)

## Installation

```bash
npm install
```

Installe les dépendances des trois paquets (`backend/`, `frontend/`, racine) et déclenche automatiquement la recompilation de `better-sqlite3` pour l'ABI d'Electron (`postinstall`).

⚠️ Voir la section **better-sqlite3** ci-dessous avant de lancer le backend en développement juste après un `npm install` à la racine.

## Développement

Backend seul (API sur `http://localhost:3000/api`) :
```bash
npm --prefix backend run start:dev
```

Frontend seul (Vite, proxy à configurer ou tester via l'API packagée) :
```bash
npm --prefix frontend run dev
```

Première utilisation en local : la base SQLite (`backend/dev.db`, définie dans `backend/.env`) est créée par `npx prisma migrate dev` (voir `backend/prisma/schema.prisma`). L'écran `/setup` crée l'école et le compte fondateur au premier accès.

## Construire et empaqueter

```bash
npm run build   # backend (nest build) + frontend (vite build) + copie dans backend/dist/public + manifeste de migrations
npm run dist    # build + recompilation Electron de better-sqlite3 + electron-builder (installateur NSIS)
```

L'installateur final est généré dans `release/Kalanso Setup <version>.exe`. Pour ne produire que le dossier non empaqueté (plus rapide, utile pour tester) :
```bash
npm run build && npm run rebuild:backend-for-electron && npx electron-builder --dir
```

## Point important : `better-sqlite3` a besoin de deux builds différents

`better-sqlite3` est un module natif. Il doit être compilé différemment selon ce qu'on en fait :

| Contexte | Build requis | Commande |
|---|---|---|
| Développer le backend seul (`start:dev`, tests, `prisma migrate`) | Node.js standard | `npm run rebuild:backend-for-node` |
| Empaqueter ou lancer l'app Electron | ABI d'Electron | `npm run rebuild:backend-for-electron` |

`npm run dist` bascule automatiquement sur le build Electron avant d'empaqueter — pense à relancer `npm run rebuild:backend-for-node` avant de reprendre le développement du backend juste après. Mélanger les deux provoque une erreur explicite (`NODE_MODULE_VERSION ... requires ...`), pas un plantage silencieux.

## Structure

```
backend/    NestJS + Prisma (SQLite) — API et logique métier
frontend/   React + Vite + Mantine — interface
electron/   Point d'entrée Electron, génération du manifeste de migrations
scripts/    Scripts de build (copie du frontend dans le backend)
release/    Sorties d'electron-builder (ignoré par git)
```

## Premier lancement

Aucun compte n'existe par défaut. Au premier démarrage, l'application affiche un formulaire pour créer l'école et le compte fondateur (nom, email, mot de passe) — cette étape ne s'affiche qu'une seule fois par installation. L'ajout d'autres membres du personnel se fait ensuite depuis l'application (Établissement → Utilisateurs).
