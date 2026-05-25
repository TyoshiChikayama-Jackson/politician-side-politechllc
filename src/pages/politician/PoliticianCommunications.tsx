import { useState } from 'react';
import type { ConstituentMessage, CampaignPost } from '../../types';
import { demoMessages, demoCampaignPosts } from '../../data/politicianData';

type Tab = 'inbox' | 'email-blast' | 'polifeed' | 'history';

const RESPONSE_TEMPLATES = [
  { label: 'Thank You', body: 'Thank you for reaching out. I appreciate your engagement on this important issue and will take your concerns into consideration.' },
  { label: 'Town Hall Invite', body: 'Thank you for your message. I invite you to join us at our upcoming town hall where we can discuss these issues directly.' },
  { label: 'Bill Information', body: 'Thank you for your interest. I would be happy to share more information about the legislation you mentioned.' },
];

function AIDraftButton({ onDraft, topic }: { onDraft: (text: string) => void; topic: string }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, type: 'constituent-reply' }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      onDraft(data.draft);
    } catch {
      onDraft(`Thank you for your message regarding ${topic}. As your representative, I take these concerns seriously and am committed to addressing them. I will carefully review this matter and keep constituents informed of any developments.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button className="pol-ai-btn" onClick={handleClick} disabled={loading}>
      {loading ? 'Drafting...' : 'AI Suggest Reply'}
    </button>
  );
}

export function PoliticianCommunications() {
  const [tab, setTab] = useState<Tab>('inbox');
  const [messages, setMessages] = useState<ConstituentMessage[]>(demoMessages);
  const [posts, setPosts] = useState<CampaignPost[]>(demoCampaignPosts);
  const [selectedMessage, setSelectedMessage] = useState<ConstituentMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [blastSubject, setBlastSubject] = useState('');
  const [blastBody, setBlastBody] = useState('');
  const [blastTarget, setBlastTarget] = useState('all');
  const [postBody, setPostBody] = useState('');
  const [postTopic, setPostTopic] = useState('');
  const [postBill, setPostBill] = useState('');
  const [aiDraftLoading, setAiDraftLoading] = useState(false);

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  const sendReply = (msgId: string) => {
    if (!replyText.trim()) return;
    setMessages((prev) =>
      prev.map((m) => m.id === msgId
        ? { ...m, status: 'replied' as const, replyBody: replyText, repliedAt: new Date().toISOString() }
        : m
      )
    );
    setReplyText('');
    setSelectedMessage(null);
  };

  const markRead = (msgId: string) => {
    setMessages((prev) => prev.map((m) => m.id === msgId && m.status === 'unread' ? { ...m, status: 'read' as const } : m));
  };

  const selectMessage = (msg: ConstituentMessage) => {
    markRead(msg.id);
    setSelectedMessage(msg);
    setReplyText('');
  };

  const publishPost = () => {
    if (!postBody.trim()) return;
    const newPost: CampaignPost = {
      id: `post-${Date.now()}`,
      body: postBody,
      topicTag: postTopic || undefined,
      billTag: postBill || undefined,
      status: 'published',
      publishedAt: new Date().toISOString(),
      views: 0, likes: 0, shares: 0, comments: 0,
    };
    setPosts((prev) => [newPost, ...prev]);
    setPostBody('');
    setPostTopic('');
    setPostBill('');
  };

  const generateBlastDraft = async () => {
    setAiDraftLoading(true);
    try {
      const res = await fetch('/api/ai-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: blastSubject, type: 'email-blast' }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBlastBody(data.draft);
    } catch {
      setBlastBody(`Dear Valued Supporter,\n\nThank you for your continued engagement with our campaign. I wanted to reach out personally to update you on ${blastSubject || 'important issues facing our district'}.\n\nAs your representative, I am committed to fighting for the values and priorities that matter most to District 12. Your support makes this work possible.\n\nThank you for standing with us.\n\nIn service,\nAlex Johnson\nIndiana State House, District 12`);
    } finally {
      setAiDraftLoading(false);
    }
  };

  return (
    <div>
      <div className="pol-page-header">
        <div className="pol-header-left">
          <h1>Communications</h1>
          <p>Manage constituent messages, send email campaigns, and publish posts to the PoliTech public feed.</p>
        </div>
        <div className="pol-header-actions">
          <button className="pol-btn-secondary pol-btn-sm" onClick={() => setTab('polifeed')}>New Post</button>
          <button className="pol-btn-primary pol-btn-sm" onClick={() => setTab('email-blast')}>New Email Campaign</button>
        </div>
      </div>

      <div className="pol-stat-grid" style={{ marginBottom: 20 }}>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Unread Messages</span>
          <span className="pol-stat-value" style={{ color: unreadCount > 0 ? '#f87171' : undefined }}>{unreadCount}</span>
          <span className="pol-stat-sub">Need response</span>
        </div>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Total Inbox</span>
          <span className="pol-stat-value">{messages.length}</span>
          <span className="pol-stat-sub">{messages.filter((m) => m.status === 'replied').length} replied</span>
        </div>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Published Posts</span>
          <span className="pol-stat-value">{posts.filter((p) => p.status === 'published').length}</span>
          <span className="pol-stat-sub">{posts.filter((p) => p.status === 'draft').length} drafts</span>
        </div>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Total Post Reach</span>
          <span className="pol-stat-value">{(posts.reduce((s, p) => s + p.views, 0) / 1000).toFixed(1)}K</span>
          <span className="pol-stat-sub">Views across all posts</span>
        </div>
      </div>

      <div className="pol-tab-row">
        {(['inbox', 'email-blast', 'polifeed', 'history'] as Tab[]).map((t) => (
          <button key={t} className={`pol-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t === 'inbox' ? `Inbox${unreadCount > 0 ? ` (${unreadCount})` : ''}` : t === 'email-blast' ? 'Email Campaign' : t === 'polifeed' ? 'PoliFeed' : 'History'}
          </button>
        ))}
      </div>

      {tab === 'inbox' && (
        <div className="pol-sidebar-layout">
          {/* Left panel — message list; scrolls independently */}
          <div className="pol-record-list">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`pol-record-item${selectedMessage?.id === msg.id ? ' selected' : ''}`}
                onClick={() => selectMessage(msg)}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span style={{ fontWeight: msg.status === 'unread' ? 800 : 600, fontSize: '0.92rem' }}>{msg.fromName}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{new Date(msg.receivedAt).toLocaleDateString()}</span>
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: msg.status === 'unread' ? 600 : 400, color: 'var(--text)', marginBottom: 2 }}>{msg.subject}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.body.slice(0, 80)}...</div>
                </div>
                <span className={`pol-badge ${msg.status === 'unread' ? 'violation' : msg.status === 'replied' ? 'passed' : 'pending'}`}>
                  {msg.status}
                </span>
              </div>
            ))}
          </div>

          {/* Right panel — detail pane; sits alongside list, never underneath */}
          <div style={{ minWidth: 0 }}>
            {selectedMessage ? (
              <div className="pol-card">
                <div style={{ marginBottom: 20 }}>
                  <h3 style={{ marginBottom: 4 }}>{selectedMessage.subject}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                    From: {selectedMessage.fromName} &lt;{selectedMessage.fromEmail}&gt; · {new Date(selectedMessage.receivedAt).toLocaleString()}
                  </div>
                </div>
                <div style={{ padding: '16px 18px', borderRadius: 12, background: 'var(--surfaceSoft, #f1f5f9)', marginBottom: 20, fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--text)' }}>
                  {selectedMessage.body}
                </div>

                {selectedMessage.replyBody ? (
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--success-solid)', marginBottom: 8 }}>Replied {selectedMessage.repliedAt ? new Date(selectedMessage.repliedAt).toLocaleDateString() : ''}</div>
                    <div style={{ padding: '14px 16px', borderRadius: 12, background: 'var(--success-bg)', border: '1px solid var(--success-border)', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      {selectedMessage.replyBody}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Write Reply</h4>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <AIDraftButton topic={selectedMessage.subject} onDraft={setReplyText} />
                        {RESPONSE_TEMPLATES.map((t) => (
                          <button key={t.label} className="pol-btn-ghost pol-btn-sm" onClick={() => setReplyText(t.body)}>
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write your reply..."
                      style={{ width: '100%', minHeight: 140, border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.92rem', resize: 'vertical' }}
                    />
                    <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                      <button className="pol-btn-primary pol-btn-sm" onClick={() => sendReply(selectedMessage.id)} disabled={!replyText.trim()}>
                        Send Reply
                      </button>
                      <button className="pol-btn-ghost pol-btn-sm" onClick={() => setSelectedMessage(null)}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="pol-card" style={{ display: 'grid', placeItems: 'center', minHeight: 300, color: 'var(--muted)', textAlign: 'center' }}>
                <div>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--border-strong)', marginBottom: 12 }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <p>Select a message to read and reply.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'email-blast' && (
        <div className="pol-grid-2">
          <div className="pol-card">
            <h3>Compose Email Campaign</h3>
            <div className="pol-field-group">
              <label>Target Audience</label>
              <select value={blastTarget} onChange={(e) => setBlastTarget(e.target.value)}>
                <option value="all">All Supporters</option>
                <option value="donors">Donors Only</option>
                <option value="volunteers">Volunteers Only</option>
                <option value="district">District 12 Residents</option>
              </select>
            </div>
            <div className="pol-field-group">
              <label>Subject Line</label>
              <input value={blastSubject} onChange={(e) => setBlastSubject(e.target.value)} placeholder="e.g. Update on HB 1042 Education Funding" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text)' }}>Email Body</label>
              <button className="pol-ai-btn" onClick={generateBlastDraft} disabled={aiDraftLoading || !blastSubject.trim()}>
                {aiDraftLoading ? 'Drafting...' : 'AI Draft'}
              </button>
            </div>
            <textarea
              value={blastBody}
              onChange={(e) => setBlastBody(e.target.value)}
              placeholder="Write your message to supporters..."
              style={{ width: '100%', minHeight: 220, border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.92rem', resize: 'vertical', marginBottom: 16 }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="pol-btn-primary pol-btn-sm" disabled={!blastSubject.trim() || !blastBody.trim()}>Send Campaign</button>
              <button className="pol-btn-secondary pol-btn-sm">Save Draft</button>
              <button className="pol-btn-secondary pol-btn-sm">Schedule</button>
            </div>
          </div>
          <div className="pol-card">
            <h3>Preview</h3>
            <div style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: 12, minHeight: 300, background: 'var(--surfaceSoft, #f1f5f9)' }}>
              {blastSubject && <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: 12 }}>{blastSubject}</div>}
              {blastBody ? (
                <div style={{ fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--text)', whiteSpace: 'pre-wrap' }}>{blastBody}</div>
              ) : (
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Your email preview will appear here as you type.</p>
              )}
            </div>
            <div style={{ marginTop: 12, fontSize: '0.83rem', color: 'var(--muted)' }}>
              Estimated recipients: <strong>{blastTarget === 'all' ? '1,240' : blastTarget === 'donors' ? '20' : blastTarget === 'volunteers' ? '5' : '3,800'}</strong>
            </div>
          </div>
        </div>
      )}

      {tab === 'polifeed' && (
        <div className="pol-grid-2">
          <div className="pol-card">
            <h3>Compose PoliFeed Post</h3>
            <div className="pol-field-group">
              <label>Post Body</label>
              <textarea
                value={postBody}
                onChange={(e) => setPostBody(e.target.value)}
                placeholder="Share an update with your constituents..."
                style={{ minHeight: 160 }}
              />
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', textAlign: 'right', marginTop: 4 }}>{postBody.length}/500</div>
            </div>
            <div className="form-grid">
              <div className="pol-field-group">
                <label>Topic Tag</label>
                <select value={postTopic} onChange={(e) => setPostTopic(e.target.value)}>
                  <option value="">None</option>
                  {['Economy', 'Education', 'Healthcare', 'Infrastructure', 'Environment', 'Public Safety', 'Housing', 'Community'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="pol-field-group">
                <label>Bill Tag (optional)</label>
                <input value={postBill} onChange={(e) => setPostBill(e.target.value)} placeholder="e.g. SB 238" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button className="pol-btn-primary pol-btn-sm" onClick={publishPost} disabled={!postBody.trim()}>Publish Now</button>
              <button className="pol-btn-secondary pol-btn-sm">Save Draft</button>
              <button className="pol-btn-secondary pol-btn-sm">Schedule</button>
            </div>
          </div>

          <div className="pol-card">
            <h3>Recent Posts</h3>
            <div className="pol-record-list">
              {posts.slice(0, 5).map((post) => (
                <div key={post.id} className="pol-record-item" style={{ cursor: 'default', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: 6 }}>
                    <span className={`pol-badge ${post.status === 'published' ? 'passed' : post.status === 'draft' ? 'pending' : 'in-progress'}`}>{post.status}</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {post.topicTag && <span className="pol-badge in-progress">{post.topicTag}</span>}
                      {post.billTag && <span className="pol-badge major">{post.billTag}</span>}
                    </div>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text)', margin: '0 0 8px', lineHeight: 1.5 }}>
                    {post.body.slice(0, 100)}{post.body.length > 100 ? '...' : ''}
                  </p>
                  <div style={{ display: 'flex', gap: 12, fontSize: '0.8rem', color: 'var(--muted)' }}>
                    <span>{post.views.toLocaleString()} views</span>
                    <span>{post.likes} likes</span>
                    <span>{post.shares} shares</span>
                    <span>{post.comments} comments</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div className="pol-card">
          <h3>Communication History</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr><th>Type</th><th>Contact</th><th>Subject / Content</th><th>Date</th><th>Status</th></tr>
              </thead>
              <tbody>
                {messages.map((m) => (
                  <tr key={m.id}>
                    <td><span className="pol-badge in-progress">Inbox</span></td>
                    <td style={{ fontWeight: 600 }}>{m.fromName}</td>
                    <td style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{m.subject}</td>
                    <td>{new Date(m.receivedAt).toLocaleDateString()}</td>
                    <td><span className={`pol-badge ${m.status === 'replied' ? 'passed' : m.status === 'unread' ? 'violation' : 'pending'}`}>{m.status}</span></td>
                  </tr>
                ))}
                {posts.filter((p) => p.status === 'published').map((p) => (
                  <tr key={p.id}>
                    <td><span className="pol-badge major">PoliFeed</span></td>
                    <td style={{ color: 'var(--muted)' }}>Public</td>
                    <td style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{p.body.slice(0, 60)}...</td>
                    <td>{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : '—'}</td>
                    <td><span className="pol-badge passed">published</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
