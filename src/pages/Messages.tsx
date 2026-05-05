import { useState } from 'react';
import type { Message } from '../types';

type MessagesProps = {
  messages: Message[];
  onSendMessage: (messageData: Omit<Message, 'id' | 'timestamp' | 'status'>) => void;
};

export function Messages({ messages, onSendMessage }: MessagesProps) {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [showCompose, setShowCompose] = useState(false);

  const handleSend = () => {
    if (!recipient.trim() || !subject.trim() || !content.trim()) return;

    onSendMessage({
      recipient: recipient.trim(),
      subject: subject.trim(),
      content: content.trim(),
    });

    // Reset form
    setRecipient('');
    setSubject('');
    setContent('');
    setShowCompose(false);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="messages-center">
      <div className="section-title">
        <h2>Messages Center</h2>
        <p>Compose and manage your campaign communications</p>
        <button
          type="button"
          className="button primary"
          onClick={() => setShowCompose(!showCompose)}
        >
          {showCompose ? 'Cancel' : 'Compose Message'}
        </button>
      </div>

      {showCompose && (
        <div className="card compose-section">
          <h3>Compose New Message</h3>
          <div className="form-group">
            <label htmlFor="recipient">Recipient</label>
            <input
              id="recipient"
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter recipient email or name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Message subject"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Message</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your message here..."
              rows={8}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="button secondary"
              onClick={() => setShowCompose(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="button primary"
              onClick={handleSend}
              disabled={!recipient.trim() || !subject.trim() || !content.trim()}
            >
              Send Message
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <h3>Sent Messages</h3>
        {messages.length === 0 ? (
          <p className="empty-state">No messages sent yet. Compose your first message above.</p>
        ) : (
          <div className="messages-list">
            {messages.map((message) => (
              <div key={message.id} className="message-item">
                <div className="message-header">
                  <div className="message-meta">
                    <strong>To: {message.recipient}</strong>
                    <span className="message-date">{formatDate(message.timestamp)}</span>
                  </div>
                  <span className={`status-badge ${message.status.toLowerCase()}`}>
                    {message.status}
                  </span>
                </div>
                <div className="message-subject">
                  <strong>Subject:</strong> {message.subject}
                </div>
                <div className="message-content">
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}