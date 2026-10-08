import 'reflect-metadata';
import { ForbiddenException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SetupService } from './setup.service';
import { InitialiserDto } from './dto/initialiser.dto';
import { createPrismaMock } from '../../test/helpers/prisma-mock';

describe('SetupService (premier lancement desktop)', () => {
  let prisma: any;
  let auth: { emettreSession: jest.Mock };
  let service: SetupService;

  const dto: InitialiserDto = {
    nomEcole: 'Ecole Test',
    villeEcole: 'Conakry',
    nom: 'Camara',
    prenom: 'Laby',
    email: 'laby@ecole.gn',
    password: 'secret1',
  };

  beforeEach(() => {
    prisma = createPrismaMock();
    auth = { emettreSession: jest.fn().mockResolvedValue({ accessToken: 'jwt' }) };
    service = new SetupService(prisma, auth as any);
  });

  describe('statut', () => {
    it('non configuré tant qu\'aucun compte n\'existe', async () => {
      prisma.utilisateur.count.mockResolvedValue(0);
      expect(await service.statut()).toEqual({ configure: false });
    });

    it('configuré dès qu\'un compte existe', async () => {
      prisma.utilisateur.count.mockResolvedValue(1);
      expect(await service.statut()).toEqual({ configure: true });
    });
  });

  describe('initialiser', () => {
    it('refuse (403) si l\'installation est déjà configurée, sans rien créer', async () => {
      prisma.utilisateur.count.mockResolvedValue(1);

      await expect(service.initialiser(dto)).rejects.toThrow(ForbiddenException);

      expect(prisma.ecole.create).not.toHaveBeenCalled();
      expect(prisma.utilisateur.create).not.toHaveBeenCalled();
      expect(auth.emettreSession).not.toHaveBeenCalled();
    });

    it('crée l\'école et son FONDATEUR (mot de passe haché) en une transaction, puis ouvre la session', async () => {
      prisma.utilisateur.count.mockResolvedValue(0);
      prisma.ecole.create.mockResolvedValue({ id: 'ecole-1' });
      prisma.utilisateur.create.mockImplementation(async ({ data }: any) => ({ id: 'u1', ...data }));

      const session = await service.initialiser(dto);

      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
      expect(prisma.ecole.create).toHaveBeenCalledWith({ data: { nom: 'Ecole Test', ville: 'Conakry' } });

      const data = prisma.utilisateur.create.mock.calls[0][0].data;
      expect(data).toMatchObject({
        ecoleId: 'ecole-1',
        nom: 'Camara',
        prenom: 'Laby',
        email: 'laby@ecole.gn',
        role: 'FONDATEUR',
      });
      expect(data.motDePasseHash).not.toBe('secret1'); // jamais en clair
      expect(data.motDePasseHash).toBe('hashed:secret1');

      expect(auth.emettreSession).toHaveBeenCalledWith(expect.objectContaining({ id: 'u1', role: 'FONDATEUR' }));
      expect(session).toEqual({ accessToken: 'jwt' });
    });
  });

  describe('InitialiserDto', () => {
    const erreurs = async (plain: object) =>
      (await validate(plainToInstance(InitialiserDto, plain), { whitelist: true })).map((e) => e.property);

    it('accepte une configuration valide, ville facultative', async () => {
      expect(await erreurs(dto)).toEqual([]);
      const { villeEcole, ...sansVille } = dto;
      expect(await erreurs(sansVille)).toEqual([]);
    });

    it('refuse un email invalide et un mot de passe trop court', async () => {
      expect(await erreurs({ ...dto, email: 'laby' })).toContain('email');
      expect(await erreurs({ ...dto, password: '123' })).toContain('password');
    });

    it('exige le nom de l\'école et l\'identité du fondateur', async () => {
      const { nomEcole, nom, prenom, ...reste } = dto;
      expect((await erreurs(reste)).sort()).toEqual(['nom', 'nomEcole', 'prenom']);
    });
  });
});
