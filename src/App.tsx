import { useState, useMemo } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { PoliticianSidebar } from './components/PoliticianSidebar';
import type { PoliticianView } from './components/PoliticianSidebar';
import { PoliAIWidget } from './components/PoliAIWidget';
import { PoliticianOverview } from './pages/politician/PoliticianOverview';
import { PoliticianDonors } from './pages/politician/PoliticianDonors';
import { PoliticianExpenses } from './pages/politician/PoliticianExpenses';
import { PoliticianVolunteers } from './pages/politician/PoliticianVolunteers';
import { PoliticianCommunications } from './pages/politician/PoliticianCommunications';
import { PoliticianBills } from './pages/politician/PoliticianBills';
import { PoliticianAnalytics } from './pages/politician/PoliticianAnalytics';
import { PoliticianQuestionnaire } from './pages/politician/PoliticianQuestionnaire';
import { PoliticianSettings } from './pages/politician/PoliticianSettings';
import { PoliticianEvents } from './pages/politician/PoliticianEvents';
import { PoliticianAds } from './pages/politician/PoliticianAds';
import { PoliticianPolls } from './pages/politician/PoliticianPolls';
import { PoliticianSpeech } from './pages/politician/PoliticianSpeech';

function App() {
  const [activeView, setActiveView] = useState<PoliticianView>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const content = useMemo(() => {
    switch (activeView) {
      case 'overview': return <PoliticianOverview />;
      case 'donors': return <PoliticianDonors />;
      case 'expenses': return <PoliticianExpenses />;
      case 'volunteers': return <PoliticianVolunteers />;
      case 'communications': return <PoliticianCommunications />;
      case 'bills': return <PoliticianBills />;
      case 'analytics': return <PoliticianAnalytics />;
      case 'questionnaire': return <PoliticianQuestionnaire />;
      case 'events': return <PoliticianEvents />;
      case 'ads': return <PoliticianAds />;
      case 'polls': return <PoliticianPolls />;
      case 'speech': return <PoliticianSpeech />;
      case 'settings': return <PoliticianSettings />;
      default: return <PoliticianOverview />;
    }
  }, [activeView]);

  return (
    <ThemeProvider>
      <div className="pol-app-shell">
        <PoliticianSidebar
          active={activeView}
          onSelect={setActiveView}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        />
        <main className={`pol-main${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
          <div className="pol-page">
            {content}
          </div>
        </main>
        <ThemeToggle />
        <PoliAIWidget />
      </div>
    </ThemeProvider>
  );
}

export default App;
