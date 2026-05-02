import { useState } from 'react';

const templates = [
  'Join me on the campaign trail as we talk local schools, public safety, and a stronger community.',
  'Fundraising update: we are $5,800 closer to our goal thanks to supporters like you.',
  'Today I visited neighborhood small businesses to hear your ideas for better city services.',
];

export function Posts() {
  const [message, setMessage] = useState(templates[0]);
  const [selected, setSelected] = useState(0);

  return (
    <section className="section-panel">
      <div className="section-title">
        <div>
          <h2>Message Center</h2>
          <p>Craft authentic messages to connect with voters. Share updates, policy positions, and campaign news across all channels.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Message templates</h3>
          <div className="button-group">
            {templates.map((template, index) => (
              <button
                key={template}
                type="button"
                className={`secondary ${selected === index ? 'primary' : ''}`}
                onClick={() => {
                  setSelected(index);
                  setMessage(template);
                }}
              >
                Template {index + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>Message preview</h3>
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} />
          <p className="upload-hint">This draft can be used for social feeds, email outreach, or SMS campaign updates.</p>
        </div>
      </div>

      <div className="card">
        <h3>Cross-post workflow</h3>
        <p>Publish to social, community newsletters, and campaign email lists from a single draft.</p>
        <div className="button-group" style={{ marginTop: '18px' }}>
          <button type="button" className="primary">
            Save draft
          </button>
          <button type="button" className="secondary">
            Export post
          </button>
        </div>
      </div>
    </section>
  );
}
