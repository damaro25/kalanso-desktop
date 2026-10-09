import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // Repli sur la base de développement : `prisma generate` (lancé par `npm run build`) exige une URL
    // même s'il ne se connecte à rien, et un clone neuf n'a pas encore de fichier .env.
    url: process.env.DATABASE_URL ?? 'file:./dev.db',
  },
});
