import 'dotenv/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';

// Exporté et appelable : l'appli Electron importe cette fonction directement
// (NestJS tourne dans le processus principal, pas dans un serveur séparé) et
// lit l'URL réellement attribuée pour y ouvrir sa fenêtre.
export async function bootstrap(): Promise<string> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new PrismaExceptionFilter(app.get(HttpAdapterHost).httpAdapter));
  // 0 = port choisi par l'OS. Frontend et backend sont toujours sur la même
  // machine : aucun intérêt à fixer un port qui pourrait déjà être occupé.
  // Interface de bouclage uniquement : sans cela l'API serait joignable depuis le réseau de l'école.
  await app.listen(process.env.PORT ?? 0, '127.0.0.1');
  return app.getUrl();
}

// Permet de garder `nest start` fonctionnel en développement autonome, sans
// passer par Electron.
if (require.main === module) {
  bootstrap();
}
