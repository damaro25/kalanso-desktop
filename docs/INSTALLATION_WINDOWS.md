# Installation de la version desktop sur un poste Windows

« La cible du formateur » Desktop est une application Windows autonome : base de données locale (SQLite), serveur et interface regroupés dans une seule application. Elle fonctionne sans Internet et gère une seule école par poste.

Ce guide a deux parties :
- **Partie A** : installer l'application sur le poste de l'école (personne qui déploie, sans connaissance technique du code).
- **Partie B** : fabriquer l'installateur `.exe` à partir du code source (développeur).

## Partie A. Installer sur le poste de l'école

### A.1 Prérequis du poste

- Windows 10 ou 11, 64 bits.
- 4 Go de RAM minimum, 1 Go d'espace disque libre pour l'application, plus l'espace des données.
- Un compte Windows administrateur pour l'installation (l'application s'installe pour tous les utilisateurs du poste).
- Aucune connexion Internet n'est nécessaire, ni à l'installation ni à l'usage.

### A.2 Installer

1. Copiez le fichier `La cible du formateur Setup 1.0.0.exe` sur le poste (clé USB par exemple).
2. Double-cliquez dessus.
3. Si Windows affiche « Windows a protégé votre ordinateur » (SmartScreen) : cliquez sur **Informations complémentaires**, puis **Exécuter quand même**. Cet avertissement est normal : l'installateur n'est pas encore signé numériquement (voir B.6).
4. Acceptez la demande d'autorisation administrateur, suivez l'assistant. Le dossier d'installation est imposé (`C:\Program Files\La cible du formateur`).
5. Un raccourci est créé sur le bureau et dans le menu Démarrer.

### A.3 Premier lancement

1. Ouvrez l'application. Au tout premier démarrage, l'écran d'installation demande de créer l'école et le compte fondateur (nom de l'école, nom, email, mot de passe).
2. Choisissez un mot de passe solide et notez-le dans un endroit sûr : il n'y a pas de procédure « mot de passe oublié » par email sur une installation hors ligne.
3. Une fois connecté en fondateur, créez les autres comptes (secrétaire, comptable, chef d'établissement, enseignants) dans **Établissement, Utilisateurs**. Un compte enseignant doit être relié à sa fiche du personnel, sinon il ne voit aucune classe.
4. Paramétrez ensuite l'année scolaire, les niveaux, les classes et les tarifs.

L'écran d'installation ne réapparaît plus ensuite : il n'existe qu'une école par installation.

### A.4 Pare-feu Windows

L'application n'écoute que sur le poste lui-même (adresse 127.0.0.1) : elle n'est pas joignable depuis le réseau de l'école et le pare-feu Windows ne doit rien demander. Si un message « Le Pare-feu Windows Defender a bloqué certaines fonctionnalités de cette application » apparaît quand même (installateur antérieur à cette correction), cliquez sur **Annuler** : l'application fonctionne normalement sans cet accès.

### A.5 Où sont les données

Tout est dans le dossier de l'utilisateur Windows qui lance l'application :

```
%APPDATA%\Kalanso\
├── db\kalanso.db         la base de données (élèves, notes, finances...)
├── uploads\              photos des élèves, pièces d'admission
└── secret.json           clé interne des sessions (ne pas supprimer)
```

Pour l'ouvrir : touche Windows + R, tapez `%APPDATA%\Kalanso`, Entrée.

Important : les données sont liées au compte Windows qui a ouvert l'application. Faites toujours ouvrir l'application par le même compte Windows sur ce poste.

### A.6 Sauvegarde

Une sauvegarde régulière est indispensable : si le disque du poste tombe en panne, les données de l'école sont perdues.

1. Fermez complètement l'application.
2. Copiez le dossier `%APPDATA%\Kalanso` en entier sur une clé USB ou un disque externe. Datez la copie (par exemple `Kalanso-2026-10-09`).
3. Rythme conseillé : en fin de semaine, et avant chaque mise à jour.

Conservez au moins trois copies de dates différentes, et une hors de l'école.

### A.7 Restauration (nouveau poste ou après panne)

1. Installez l'application (A.2) sur le nouveau poste, sans la lancer.
2. Connectez-vous à Windows avec le compte qui servira à l'utiliser.
3. Copiez le dossier sauvegardé vers `%APPDATA%\Kalanso`, de sorte que `%APPDATA%\Kalanso\db\kalanso.db` existe.
4. Lancez l'application : elle s'ouvre sur la connexion, avec toutes les données, sans repasser par l'écran d'installation.

### A.8 Mettre à jour

1. Sauvegardez les données (A.6).
2. Lancez le nouvel installateur : il remplace l'application et conserve les données.
3. Au premier lancement de la nouvelle version, les mises à jour de la base sont appliquées automatiquement.

Ne jamais restaurer une sauvegarde faite avec une version plus récente dans une application plus ancienne.

### A.9 Désinstaller

Paramètres Windows, Applications, « La cible du formateur », Désinstaller. Les données de `%APPDATA%\Kalanso` ne sont pas supprimées : supprimez ce dossier à la main uniquement si vous voulez effacer définitivement les données de l'école.

### A.10 Dépannage

| Symptôme | Action |
|---|---|
| L'application ne s'ouvre pas, aucune fenêtre | Relancer ; vérifier qu'aucune ancienne instance ne tourne (Gestionnaire des tâches, terminer « La cible du formateur ») |
| Écran blanc au lancement | Attendre quelques secondes : le serveur interne démarre et applique les mises à jour de base |
| « Mot de passe incorrect » | Se faire réinitialiser par un compte fondateur ou chef (Établissement, Utilisateurs, modifier le compte) |
| Mot de passe fondateur perdu | Restaurer une sauvegarde où il est connu, ou contacter le développeur |
| Plus d'espace disque | Libérer de l'espace : la base ne peut plus écrire et peut se corrompre |

---

## Partie B. Fabriquer l'installateur (développeur)

À faire sur une machine Windows. Le build produit `release\La cible du formateur Setup 1.0.0.exe` (environ 200 Mo).

### B.1 Prérequis

- Windows 10 ou 11, 64 bits.
- Node.js 22 ou plus, npm, Git.
- Une connexion Internet pour la première fois (dépendances npm, binaire Electron, outils NSIS mis en cache par electron-builder).
- Si la recompilation de `better-sqlite3` pour Electron ne trouve pas de binaire précompilé : Visual Studio Build Tools avec la charge de travail « Développement Desktop en C++ ».

### B.2 Récupérer le code et installer les dépendances

Le dépôt contient trois paquets indépendants (racine, `backend`, `frontend`). Installez-les un par un :

```powershell
git clone <URL_DU_DEPOT> kalanso-desktop
cd kalanso-desktop
npm install
npm --prefix backend install
npm --prefix frontend install
```

Le `npm install` de la racine ne s'occupe que de la racine (Electron, electron-builder, better-sqlite3). Il recompile `better-sqlite3` pour Electron via `postinstall`.

### B.3 Client Prisma

Le client Prisma n'est pas versionné, mais le build le génère lui-même (`prisma generate` est la première étape de `npm --prefix backend run build`). Il n'y a rien à faire à la main et aucun fichier `.env` n'est nécessaire pour construire l'installateur. Pour développer ou lancer le backend seul, copiez `backend\.env.example` en `backend\.env`.

### B.4 Construire l'installateur

```powershell
npm run dist
```

Cette commande enchaîne : compilation du backend, build du frontend, copie du frontend dans le backend, génération du manifeste des migrations, recompilation de `better-sqlite3` pour l'ABI d'Electron, puis electron-builder (NSIS). Comptez plus d'un quart d'heure : lors de l'essai sur un clone propre, l'empaquetage final a duré environ 13 minutes.

Résultat : `release\La cible du formateur Setup 1.0.0.exe`. C'est ce seul fichier qu'on remet à l'école.

Pour obtenir seulement un dossier exécutable, sans installateur (test rapide) :

```powershell
npm run build
npm run rebuild:backend-for-electron
npx electron-builder --dir
```

L'application se lance alors avec `release\win-unpacked\La cible du formateur.exe`.

### B.5 Vérifier avant de livrer

Sur un poste propre (machine virtuelle de préférence) :

1. Installer avec le `.exe`.
2. Lancer : l'écran d'installation doit apparaître, créer l'école et le fondateur.
3. Se connecter, créer une classe, un élève, enregistrer un paiement.
4. Ajouter une photo à un élève et générer une carte scolaire en PDF.
5. Fermer, rouvrir : les données sont toujours là.
6. Installer par-dessus la même version : les données sont conservées.

### B.6 Signature de l'installateur (recommandé)

Sans certificat de signature de code, Windows affiche l'avertissement SmartScreen à chaque nouvelle machine. Pour le supprimer, il faut un certificat de signature de code (organisation ou EV), à renseigner dans la configuration `win` d'electron-builder (`certificateFile`/`certificatePassword`, ou service de signature). C'est un coût annuel : à prévoir quand le nombre d'écoles grandit.

### B.7 Travailler ensuite sur le code (développement)

`better-sqlite3` existe en deux builds incompatibles (Node et Electron). Après un `npm run dist`, avant de relancer les tests ou le backend seul :

```powershell
npm run rebuild:backend-for-node
```

et l'inverse (`npm run rebuild:backend-for-electron`) avant de lancer l'application Electron. Une erreur `NODE_MODULE_VERSION` signale un mélange des deux.
