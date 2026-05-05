import { useState } from 'react';
import type { Message } from '../types';

type MessagingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSend: (message: Omit<Message, 'id' | 'timestamp' | 'status'>) => void;
};

export function MessagingModal({ isOpen, onClose, onSend }: MessagingModalProps) {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  const handleSend = () => {
    if (!recipient.trim() || !subject.trim() || !content.trim()) return;

    onSend({
      recipient: recipient.trim(),
      subject: subject.trim(),
      content: content.trim(),
    });

    // Reset form
    setRecipient('');
    setSubject('');
    setContent('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content messaging-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Send Message</h3>
          <button type="button" className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
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
              rows={6}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="button secondary" onClick={onClose}>
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
    </div>
  );
}