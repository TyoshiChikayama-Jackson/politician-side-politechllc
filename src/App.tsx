import { useMemo, useState } from 'react';
import { BrandLayout } from './components/BrandLayout';
import { Header } from './components/Header';
import { MessagingModal } from './components/MessagingModal';
import { Dashboard } from './pages/Dashboard';
import { CRM } from './pages/CRM';
import { Posts } from './pages/Posts';
import { Staff } from './pages/Staff';
import { Compliance } from './pages/Compliance';
import { SocialAnalytics } from './pages/SocialAnalytics';
import type { Message } from './types';

type ViewItem = { id: 'dashboard' | 'crm' | 'posts' | 'analytics' | 'staff' | 'compliance'; label: string };

const views: readonly ViewItem[] = [
  { id: 'dashboard', label: 'Campaign Hub' },
  { id: 'crm', label: 'Community' },
  { id: 'posts', label: 'Message Center' },
  { id: 'analytics', label: 'Social Analytics' },
  { id: 'staff', label: 'Staff' },
  { id: 'compliance', label: 'Finance & Filings' }
];

type ViewId = ViewItem['id'];

function App() {
  const [activeView, setActiveView] = useState<ViewId>('dashboard');
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
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
      case 'analytics':
        return <SocialAnalytics />;
      case 'staff':
        return <Staff />;
      case 'compliance':
        return <Compliance />;
      default:
        return <Dashboard />;
    }
  }, [activeView]);

  return (
    <BrandLayout>
      <Header
        views={views}
        active={activeView}
        onSelect={setActiveView}
        onOpenMessaging={() => setIsMessagingOpen(true)}
      />
      <main className="page-content">{content}</main>
      <MessagingModal
        isOpen={isMessagingOpen}
        onClose={() => setIsMessagingOpen(false)}
        onSend={handleSendMessage}
      />
    </BrandLayout>
  );
}

export default App;
