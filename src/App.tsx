import { useMemo, useState } from 'react';
import { BrandLayout } from './components/BrandLayout';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { CRM } from './pages/CRM';
import { Posts } from './pages/Posts';
import { Compliance } from './pages/Compliance';
import { MapView } from './pages/MapView';

type ViewItem = { id: 'dashboard' | 'crm' | 'posts' | 'compliance' | 'map'; label: string };

const views: readonly ViewItem[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'crm', label: 'CRM' },
  { id: 'posts', label: 'Post Studio' },
  { id: 'compliance', label: 'FEC & Finance' },
  { id: 'map', label: 'Zip Map' }
];

type ViewId = ViewItem['id'];

function App() {
  const [activeView, setActiveView] = useState<ViewId>('dashboard');
  const content = useMemo(() => {
    switch (activeView) {
      case 'crm':
        return <CRM />;
      case 'posts':
        return <Posts />;
      case 'compliance':
        return <Compliance />;
      case 'map':
        return <MapView />;
      default:
        return <Dashboard />;
    }
  }, [activeView]);

  return (
    <BrandLayout>
      <Header views={views} active={activeView} onSelect={setActiveView} />
      <main className="page-content">{content}</main>
    </BrandLayout>
  );
}

export default App;
