import { useState } from 'react';
import { Paper, TextInput, PasswordInput, Button, Title, Text, Alert, Center, Stack, Divider } from '@mantine/core';
import { initialiserSetup } from '../../api/setup';

export function PremierDemarragePage() {
  const [nomEcole, setNomEcole] = useState('');
  const [villeEcole, setVilleEcole] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { accessToken, user } = await initialiserSetup({ nomEcole, villeEcole: villeEcole || undefined, nom, prenom, email, password });
      localStorage.setItem('kalanso_token', accessToken);
      localStorage.setItem('kalanso_user', JSON.stringify(user));
      // Rechargement complet : AuthProvider relit son état depuis le localStorage
      // au montage, comme après une connexion classique.
      window.location.href = '/dashboard';
    } catch {
      setError("Impossible d'initialiser l'application. Vérifiez les champs et réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Center h="100vh" bg="kalanso.0">
      <Paper shadow="md" p="xl" w={440} withBorder>
        <form onSubmit={handleSubmit}>
          <Stack>
            <Title order={2} c="kalanso.7">
              Bienvenue sur Kalanso
            </Title>
            <Text size="sm" c="dimmed">
              Première utilisation : configurez votre école et votre compte fondateur. Cette étape ne s'affiche
              qu'une seule fois.
            </Text>
            {error && <Alert color="red">{error}</Alert>}

            <TextInput label="Nom de l'école" value={nomEcole} onChange={(e) => setNomEcole(e.currentTarget.value)} required />
            <TextInput label="Ville (optionnel)" value={villeEcole} onChange={(e) => setVilleEcole(e.currentTarget.value)} />

            <Divider label="Votre compte (fondateur)" labelPosition="left" mt="sm" />
            <TextInput label="Nom" value={nom} onChange={(e) => setNom(e.currentTarget.value)} required />
            <TextInput label="Prénom" value={prenom} onChange={(e) => setPrenom(e.currentTarget.value)} required />
            <TextInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} required />
            <PasswordInput
              label="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              minLength={6}
              required
            />

            <Button type="submit" loading={loading} fullWidth mt="sm">
              Démarrer
            </Button>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
}
