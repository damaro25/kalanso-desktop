import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Center, Loader } from '@mantine/core';
import { AuthProvider } from './auth/AuthContext';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { AppShell } from './layout/AppShell';
import { LoginPage } from './pages/login/LoginPage';
import { PremierDemarragePage } from './pages/setup/PremierDemarragePage';
import { fetchSetupStatut } from './api/setup';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ElevesListPage } from './pages/eleves/ElevesListPage';
import { EleveDetailPage } from './pages/eleves/EleveDetailPage';
import { ClassesListPage } from './pages/classes/ClassesListPage';
import { ClasseDetailPage } from './pages/classes/ClasseDetailPage';
import { NiveauxPage } from './pages/classes/NiveauxPage';
import { TarifsEcolagePage } from './pages/finances/TarifsEcolagePage';
import { FacturesListPage } from './pages/finances/FacturesListPage';
import { AppelDuJourPage } from './pages/absences/AppelDuJourPage';
import { AbsencesHistoriquePage } from './pages/absences/AbsencesHistoriquePage';
import { PersonnelListPage } from './pages/personnel/PersonnelListPage';
import { PersonnelFormPage } from './pages/personnel/PersonnelFormPage';
import { PersonnelDetailPage } from './pages/personnel/PersonnelDetailPage';
import { NotesPage } from './pages/notes/NotesPage';
import { MatieresPage } from './pages/notes/MatieresPage';
import { ParcoursPage } from './pages/parcours/ParcoursPage';
import { EmploiDuTempsPage } from './pages/emploi-du-temps/EmploiDuTempsPage';
import { CommunicationPage } from './pages/communication/CommunicationPage';
import { AdmissionsPage } from './pages/admissions/AdmissionsPage';
import { InscriptionPubliquePage } from './pages/admissions/InscriptionPubliquePage';
import { PaiePage } from './pages/paie/PaiePage';
import { LogistiquePage } from './pages/logistique/LogistiquePage';
import { FinancePage } from './pages/finance/FinancePage';
import { BibliothequePage } from './pages/bibliotheque/BibliothequePage';

// Aucune création d'école en libre-service : chaque installation desktop est
// mono-tenant, amorcée une seule fois via /setup. Tant que l'appli n'a pas
// encore de compte, on affiche cet écran à la place du routeur normal.
function SetupGate({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useQuery({ queryKey: ['setup-statut'], queryFn: fetchSetupStatut });

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader color="kalanso" />
      </Center>
    );
  }

  if (data && !data.configure) {
    return <PremierDemarragePage />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <SetupGate>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/inscription/:ecoleId" element={<InscriptionPubliquePage />} />
            <Route
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/eleves" element={<ElevesListPage />} />
              <Route path="/eleves/:id" element={<EleveDetailPage />} />
              <Route path="/classes" element={<ClassesListPage />} />
              <Route path="/classes/:id" element={<ClasseDetailPage />} />
              <Route path="/niveaux" element={<NiveauxPage />} />
              <Route path="/finances/tarifs" element={<TarifsEcolagePage />} />
              <Route path="/finances/factures" element={<FacturesListPage />} />
              <Route path="/absences/appel" element={<AppelDuJourPage />} />
              <Route path="/absences/historique" element={<AbsencesHistoriquePage />} />
              <Route path="/personnel" element={<PersonnelListPage />} />
              <Route path="/personnel/nouveau" element={<PersonnelFormPage />} />
              <Route path="/personnel/:id" element={<PersonnelDetailPage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/matieres" element={<MatieresPage />} />
              <Route path="/parcours" element={<ParcoursPage />} />
              <Route path="/emploi-du-temps" element={<EmploiDuTempsPage />} />
              <Route path="/communication" element={<CommunicationPage />} />
              <Route path="/admissions" element={<AdmissionsPage />} />
              <Route path="/paie" element={<PaiePage />} />
              <Route path="/logistique" element={<LogistiquePage />} />
              <Route path="/bibliotheque" element={<BibliothequePage />} />
              <Route path="/finance" element={<FinancePage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </SetupGate>
    </BrowserRouter>
  );
}

export default App;
