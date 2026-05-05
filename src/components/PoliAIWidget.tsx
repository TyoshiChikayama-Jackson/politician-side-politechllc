import { useState, useRef, useEffect } from 'react';

type Msg = { role: 'user' | 'assistant'; content: string };

const SUGGESTIONS = [
  'How are my fundraising numbers this month?',
  'What are my upcoming FEC deadlines?',
  'Show me my top donors this cycle.',
  'How many volunteer hours have been logged?',
];

export function PoliAIWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      content: "Hi! I'm PoliAI, your campaign data assistant. Ask me anything about your donors, fundraising, FEC deadlines, volunteer activity, or campaign analytics.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/poliAI', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "I'm having trouble connecting right now. For demo purposes: your Q1 fundraising totals are $28,400 raised against a goal of $85,000 (33%). Your next FEC filing is due July 15, 2024." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pol-ai-widget">
      <div className={`pol-ai-panel${open ? ' open' : ''}`}>
        <div className="pol-ai-panel-header">
          <div>
            <h4>✨ PoliAI</h4>
            <p>Campaign data assistant</p>
          </div>
          <button
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="pol-ai-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`pol-ai-msg ${msg.role}`}>
              {msg.content}
            </div>
          ))}
          {loading && (
            <div className="pol-ai-msg assistant" style={{ opacity: 0.6 }}>
              Thinking...
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length === 1 && (
          <div style={{ padding: '0 16px 12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                className="pol-ai-btn pol-btn-sm"
                onClick={() => sendMessage(s)}
                style={{ fontSize: '0.78rem', padding: '5px 10px' }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="pol-ai-input-row">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask about your campaign..."
            disabled={loading}
          />
          <button className="pol-btn-primary pol-btn-sm" onClick={() => sendMessage(input)} disabled={loading}>
            ↑
          </button>
        </div>
      </div>

      <button className="pol-ai-launcher" onClick={() => setOpen((v) => !v)} title="PoliAI Assistant">
        {open ? '✕' : '✨'}
      </button>
    </div>
  );
}
