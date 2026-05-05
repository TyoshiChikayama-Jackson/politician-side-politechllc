import { useMemo, useState } from 'react';
import { BrandLayout } from './components/BrandLayout';
import { Header } from './components/Header';
import { ThemeToggle } from './components/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';
import { Dashboard } from './pages/Dashboard';
import { CRM } from './pages/CRM';
import { Posts } from './pages/Posts';
import { Messages } from './pages/Messages';
import { Staff } from './pages/Staff';
import { Compliance } from './pages/Compliance';
import { SocialAnalytics } from './pages/SocialAnalytics';
import type { Message } from './types';

type ViewItem = { id: 'dashboard' | 'crm' | 'posts' | 'messages' | 'analytics' | 'staff' | 'compliance'; label: string };

const views: readonly ViewItem[] = [
  { id: 'dashboard', label: 'Campaign Hub' },
  { id: 'crm', label: 'Community' },
  { id: 'posts', label: 'Content Hub' },
  { id: 'messages', label: 'Message Center' },
  { id: 'analytics', label: 'Social Analytics' },
  { id: 'staff', label: 'Staff' },
  { id: 'compliance', label: 'Finance & Filings' }
];

type ViewId = ViewItem['id'];

function App() {
  const [activeView, setActiveView] = useState<ViewId>('dashboard');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (messageData: Omit<Message, 'id' | 'timestamp' | 'status'>) => {
    const newMessage: Message = {
      ...messageData,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'Sent',
    };
    setMessages(prev => [newMessage, ...prev]);
  };

  const content = useMemo(() => {
    switch (activeView) {
      case 'crm':
        return <CRM />;
      case 'posts':
        return <Posts />;
      case 'messages':
        return <Messages messages={messages} onSendMessage={handleSendMessage} />;
      case 'analytics':
        return <SocialAnalytics />;
      case 'staff':
        return <Staff />;
      case 'compliance':
        return <Compliance />;
      default:
        return <Dashboard />;
    }
  }, [activeView, messages]);

  return (
    <ThemeProvider>
      <BrandLayout>
        <Header views={views} active={activeView} onSelect={setActiveView} />
        <ThemeToggle />
        <main className="page-content">{content}</main>
      </BrandLayout>
    </ThemeProvider>
  );
}

export default App;
