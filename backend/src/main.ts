import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

// Exporté et appelable : l'appli Electron importe cette fonction directement
// (NestJS tourne dans le processus principal, pas dans un serveur séparé) et
// lit l'URL réellement attribuée pour y ouvrir sa fenêtre.
export async function bootstrap(): Promise<string> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // 0 = port choisi par l'OS. Frontend et backend sont toujours sur la même
  // machine : aucun intérêt à fixer un port qui pourrait déjà être occupé.
  await app.listen(process.env.PORT ?? 0);
  return app.getUrl();
}

// Permet de garder `nest start` fonctionnel en développement autonome, sans
// passer par Electron.
if (require.main === module) {
  bootstrap();
}
