import { ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { RoleUtilisateur } from '../common/enums';
import { InitialiserDto } from './dto/initialiser.dto';

// Amorçage minimal, propre à l'installation desktop : chaque installation ne
// sert qu'une seule école, créée une seule fois au tout premier lancement.
// Le garde-fou (compte de comptes = 0) est vérifié ici, côté serveur, pas
// seulement dans l'écran d'accueil du frontend.
@Injectable()
export class SetupService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async statut() {
    const nbUtilisateurs = await this.prisma.utilisateur.count();
    return { configure: nbUtilisateurs > 0 };
  }

  async initialiser(dto: InitialiserDto) {
    const nbUtilisateurs = await this.prisma.utilisateur.count();
    if (nbUtilisateurs > 0) {
      throw new ForbiddenException('Cette installation est déjà configurée');
    }

    const motDePasseHash = await bcrypt.hash(dto.password, 12);

    const { ecole, utilisateur } = await this.prisma.$transaction(async (tx) => {
      const ecole = await tx.ecole.create({
        data: { nom: dto.nomEcole, ville: dto.villeEcole },
      });
      const utilisateur = await tx.utilisateur.create({
        data: {
          ecoleId: ecole.id,
          nom: dto.nom,
          prenom: dto.prenom,
          email: dto.email,
          motDePasseHash,
          role: RoleUtilisateur.FONDATEUR,
        },
      });
      return { ecole, utilisateur };
    });

    return this.authService.emettreSession(utilisateur);
  }
}
