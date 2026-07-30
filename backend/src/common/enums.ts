// Le connecteur SQLite de Prisma ne supporte pas les blocs "enum" natifs
// (contrairement à PostgreSQL) : ces valeurs étaient auto-générées par Prisma
// dans le projet web d'origine, elles sont ici maintenues à la main, dans le
// même format que génère Prisma pour son générateur "prisma-client" (un objet
// `as const` + un type union de chaînes) — pas un `enum` TypeScript nominal,
// pour que les littéraux de chaîne déjà utilisés dans tout le code applicatif
// (ex. `statut: 'EN_ATTENTE'`) restent assignables sans aucun changement.
// Utilisées à la fois par class-validator (@IsEnum) et par le code métier.

export const RoleUtilisateur = {
  FONDATEUR: 'FONDATEUR',
  CHEF_ETABLISSEMENT: 'CHEF_ETABLISSEMENT',
  SECRETAIRE: 'SECRETAIRE',
  COMPTABLE: 'COMPTABLE',
  ENSEIGNANT: 'ENSEIGNANT',
} as const;
export type RoleUtilisateur = (typeof RoleUtilisateur)[keyof typeof RoleUtilisateur];

export const Genre = {
  M: 'M',
  F: 'F',
} as const;
export type Genre = (typeof Genre)[keyof typeof Genre];

export const StatutInscription = {
  EN_COURS: 'EN_COURS',
  TERMINEE: 'TERMINEE',
  ABANDONNEE: 'ABANDONNEE',
  TRANSFEREE: 'TRANSFEREE',
} as const;
export type StatutInscription = (typeof StatutInscription)[keyof typeof StatutInscription];

export const StatutAbsence = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  RETARD: 'RETARD',
} as const;
export type StatutAbsence = (typeof StatutAbsence)[keyof typeof StatutAbsence];

export const StatutFacture = {
  IMPAYEE: 'IMPAYEE',
  PARTIELLE: 'PARTIELLE',
  PAYEE: 'PAYEE',
  ANNULEE: 'ANNULEE',
} as const;
export type StatutFacture = (typeof StatutFacture)[keyof typeof StatutFacture];

export const TypeFacture = {
  ECOLAGE: 'ECOLAGE',
  INSCRIPTION: 'INSCRIPTION',
  AUTRE: 'AUTRE',
} as const;
export type TypeFacture = (typeof TypeFacture)[keyof typeof TypeFacture];

export const ModePaiement = {
  ESPECES: 'ESPECES',
  VIREMENT: 'VIREMENT',
  CHEQUE: 'CHEQUE',
  MOBILE_MONEY: 'MOBILE_MONEY',
  AUTRE: 'AUTRE',
} as const;
export type ModePaiement = (typeof ModePaiement)[keyof typeof ModePaiement];

export const OperateurMobileMoney = {
  ORANGE_MONEY: 'ORANGE_MONEY',
  MTN_MOMO: 'MTN_MOMO',
} as const;
export type OperateurMobileMoney = (typeof OperateurMobileMoney)[keyof typeof OperateurMobileMoney];

export const StatutTransaction = {
  EN_ATTENTE: 'EN_ATTENTE',
  REUSSIE: 'REUSSIE',
  ECHOUEE: 'ECHOUEE',
  ANNULEE: 'ANNULEE',
} as const;
export type StatutTransaction = (typeof StatutTransaction)[keyof typeof StatutTransaction];

export const JourSemaine = {
  LUNDI: 'LUNDI',
  MARDI: 'MARDI',
  MERCREDI: 'MERCREDI',
  JEUDI: 'JEUDI',
  VENDREDI: 'VENDREDI',
  SAMEDI: 'SAMEDI',
} as const;
export type JourSemaine = (typeof JourSemaine)[keyof typeof JourSemaine];

export const TypeMessage = {
  MANUEL: 'MANUEL',
  ABSENCE: 'ABSENCE',
  RAPPEL_IMPAYE: 'RAPPEL_IMPAYE',
} as const;
export type TypeMessage = (typeof TypeMessage)[keyof typeof TypeMessage];

export const StatutMessage = {
  EN_ATTENTE: 'EN_ATTENTE',
  ENVOYE: 'ENVOYE',
  ECHEC: 'ECHEC',
} as const;
export type StatutMessage = (typeof StatutMessage)[keyof typeof StatutMessage];

export const StatutDemandeInscription = {
  EN_ATTENTE: 'EN_ATTENTE',
  ACCEPTEE: 'ACCEPTEE',
  REFUSEE: 'REFUSEE',
} as const;
export type StatutDemandeInscription = (typeof StatutDemandeInscription)[keyof typeof StatutDemandeInscription];

export const TypeDocument = {
  PHOTO: 'PHOTO',
  ATTESTATION: 'ATTESTATION',
  RELEVE_NOTES: 'RELEVE_NOTES',
  EXTRAIT_NAISSANCE: 'EXTRAIT_NAISSANCE',
  AUTRE: 'AUTRE',
} as const;
export type TypeDocument = (typeof TypeDocument)[keyof typeof TypeDocument];

export const StatutVerificationDocument = {
  EN_ATTENTE: 'EN_ATTENTE',
  VERIFIE: 'VERIFIE',
  REJETE: 'REJETE',
} as const;
export type StatutVerificationDocument = (typeof StatutVerificationDocument)[keyof typeof StatutVerificationDocument];

export const StatutBulletinPaie = {
  BROUILLON: 'BROUILLON',
  VALIDE: 'VALIDE',
  PAYE: 'PAYE',
} as const;
export type StatutBulletinPaie = (typeof StatutBulletinPaie)[keyof typeof StatutBulletinPaie];

export const TypePersonnel = {
  ENSEIGNANT: 'ENSEIGNANT',
  ADMINISTRATIF: 'ADMINISTRATIF',
} as const;
export type TypePersonnel = (typeof TypePersonnel)[keyof typeof TypePersonnel];

export const TypeMouvement = {
  RECETTE: 'RECETTE',
  DEPENSE: 'DEPENSE',
} as const;
export type TypeMouvement = (typeof TypeMouvement)[keyof typeof TypeMouvement];

export const StatutEmprunt = {
  EN_COURS: 'EN_COURS',
  RETOURNE: 'RETOURNE',
} as const;
export type StatutEmprunt = (typeof StatutEmprunt)[keyof typeof StatutEmprunt];

export const CategorieMateriel = {
  MOBILIER: 'MOBILIER',
  INFORMATIQUE: 'INFORMATIQUE',
  PEDAGOGIQUE: 'PEDAGOGIQUE',
  AUTRE: 'AUTRE',
} as const;
export type CategorieMateriel = (typeof CategorieMateriel)[keyof typeof CategorieMateriel];

export const EtatMateriel = {
  BON: 'BON',
  MOYEN: 'MOYEN',
  A_REPARER: 'A_REPARER',
  HORS_SERVICE: 'HORS_SERVICE',
} as const;
export type EtatMateriel = (typeof EtatMateriel)[keyof typeof EtatMateriel];

export const TypeAnnulation = {
  ADMISSION: 'ADMISSION',
  REFUS: 'REFUS',
} as const;
export type TypeAnnulation = (typeof TypeAnnulation)[keyof typeof TypeAnnulation];
