import { apiClient } from './client';

export interface SetupStatut {
  configure: boolean;
}

export interface InitialiserInput {
  nomEcole: string;
  villeEcole?: string;
  nom: string;
  prenom: string;
  email: string;
  password: string;
}

export async function fetchSetupStatut(): Promise<SetupStatut> {
  const { data } = await apiClient.get('/setup/statut');
  return data;
}

export async function initialiserSetup(input: InitialiserInput) {
  const { data } = await apiClient.post('/setup/initialiser', input);
  return data;
}
