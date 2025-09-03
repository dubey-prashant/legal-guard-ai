import { AppProvider } from './context/AppContext';
import { useAppContext } from './hooks/useAppContext';
import { HeroLanding } from './components/HeroLanding';
import { AnalysisPhase } from './components/AnalysisPhase';
import { CompleteWorkflow } from './components/CompleteWorkflow';

function AppContent() {
  const { uploadedFile, analysis } = useAppContext();

  // Hero Landing Page
  if (!uploadedFile) {
    return <HeroLanding />;
  }

  // Analysis Phase
  if (uploadedFile && !analysis) {
    return <AnalysisPhase />;
  }

  // Complete Workflow - Analysis & Response
  return <CompleteWorkflow />;
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
