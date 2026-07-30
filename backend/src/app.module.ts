import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EcolesModule } from './ecoles/ecoles.module';
import { ElevesModule } from './eleves/eleves.module';
import { FinancesModule } from './finances/finances.module';
import { AbsencesModule } from './absences/absences.module';
import { PersonnelModule } from './personnel/personnel.module';
import { ReportingModule } from './reporting/reporting.module';
import { NotesModule } from './notes/notes.module';
import { EmploiDuTempsModule } from './emploi-du-temps/emploi-du-temps.module';
import { CommunicationModule } from './communication/communication.module';
import { MobileMoneyModule } from './mobile-money/mobile-money.module';
import { AdmissionsModule } from './admissions/admissions.module';
import { PaieModule } from './paie/paie.module';
import { LogistiqueModule } from './logistique/logistique.module';
import { FinanceModule } from './finance/finance.module';
import { BibliothequeModule } from './bibliotheque/bibliotheque.module';
import { ParcoursModule } from './parcours/parcours.module';
import { SetupModule } from './setup/setup.module';

@Module({
  imports: [
    // Sert le build React (copié dans dist/public à l'empaquetage) sur le
    // même port que l'API : même origine, pas de CORS, un seul processus.
    // nest build sort dans dist/src/ (prisma.config.ts et prisma/seed.ts hors
    // de src/ font que TypeScript place src/ comme sous-dossier de dist/,
    // pas comme sa racine) : public/ copié dans dist/public se trouve donc un
    // niveau au-dessus de ce fichier compilé (dist/src/app.module.js).
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api/{*splat}'],
    }),
    PrismaModule,
    AuthModule,
    SetupModule,
    EcolesModule,
    ElevesModule,
    FinancesModule,
    AbsencesModule,
    PersonnelModule,
    NotesModule,
    EmploiDuTempsModule,
    CommunicationModule,
    MobileMoneyModule,
    AdmissionsModule,
    PaieModule,
    LogistiqueModule,
    FinanceModule,
    BibliothequeModule,
    ParcoursModule,
    ReportingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
