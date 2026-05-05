import { useMemo, useState } from 'react';
import { socialMetrics, postPerformance, benchmarkComparison, socialPlatforms } from '../data/socialData';

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatCalendarKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function buildMonthDays(viewMonth: Date) {
  const firstOfMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
  const startDay = firstOfMonth.getDay();
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
  const previousMonthEnd = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 0).getDate();

  const days = [];
  for (let offset = 0; offset < 42; offset += 1) {
    const dayIndex = offset - startDay;
    const date = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), dayIndex + 1);
    const isCurrentMonth = offset >= startDay && offset < startDay + daysInMonth;
    days.push({ date, isCurrentMonth });
  }

  return days;
}

export function SocialAnalytics() {
  const [viewMonth, setViewMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarEvent, setCalendarEvent] = useState('');
  const [notes, setNotes] = useState([
    { id: 'N-001', text: 'Confirm LinkedIn boost budget for next week', completed: false },
    { id: 'N-002', text: 'Review opponent paid social messaging', completed: false }
  ]);
  const [todos, setTodos] = useState([
    { id: 'T-001', text: 'Schedule Wednesday volunteer highlight post', completed: false },
    { id: 'T-002', text: 'Create press image for town hall recap', completed: true }
  ]);
  const [noteDraft, setNoteDraft] = useState('');
  const [todoDraft, setTodoDraft] = useState('');
  const [calendarEvents, setCalendarEvents] = useState<Record<string, string[]>>({
    [formatCalendarKey(new Date())]: ['LinkedIn post planning session'],
    [formatCalendarKey(new Date(new Date().setDate(new Date().getDate() + 3)))]: ['District office visit scheduling']
  });

  // New state for creating posts
  const [postDraft, setPostDraft] = useState({ title: '', content: '', platform: 'LinkedIn' });
  const [posts, setPosts] = useState(postPerformance);

  const monthLabel = useMemo(
    () => viewMonth.toLocaleString('default', { month: 'long', year: 'numeric' }),
    [viewMonth]
  );

  const calendarDays = useMemo(() => buildMonthDays(viewMonth), [viewMonth]);
  const selectedKey = formatCalendarKey(selectedDate);
  const eventsForSelectedDate = calendarEvents[selectedKey] ?? [];

  const handleAddNote = () => {
    const trimmed = noteDraft.trim();
    if (!trimmed) return;
    setNotes((current) => [...current, { id: `N-${Date.now()}`, text: trimmed, completed: false }]);
    setNoteDraft('');
  };

  const handleAddTodo = () => {
    const trimmed = todoDraft.trim();
    if (!trimmed) return;
    setTodos((current) => [...current, { id: `T-${Date.now()}`, text: trimmed, completed: false }]);
    setTodoDraft('');
  };

  const handleToggleTodo = (id: string) => {
    setTodos((current) => current.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)));
  };

  const handleDeleteNote = (id: string) => {
    setNotes((current) => current.filter((note) => note.id !== id));
  };

  const handleDeleteTodo = (id: string) => {
    setTodos((current) => current.filter((todo) => todo.id !== id));
  };

  const handleAddCalendarEvent = () => {
    const trimmed = calendarEvent.trim();
    if (!trimmed) return;
    setCalendarEvents((current) => ({
      ...current,
      [selectedKey]: [...(current[selectedKey] ?? []), trimmed]
    }));
    setCalendarEvent('');
  };

  const handleCreatePost = () => {
    const { title, content, platform } = postDraft;
    if (!title.trim() || !content.trim()) return;
    const newPost = {
      id: `P-${Date.now()}`,
      platform,
      title: title.trim(),
      impressions: 0,
      engagementRate: 0,
      interactions: 0,
      status: 'Draft'
    };
    setPosts((current) => [newPost, ...current]);
    setPostDraft({ title: '', content: '', platform: 'LinkedIn' });
  };

  const moveMonth = (amount: number) => {
    setViewMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  };

  const todayKey = formatCalendarKey(new Date());

  return (
    <section className="section-panel">
      <div className="section-title">
        <div>
          <h2>Social Media Analytics</h2>
          <p>Compare performance for Indiana campaigns across all 92 counties and statewide government levels.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Platform health</h3>
          <div className="button-group platform-grid">
            {socialPlatforms.map((platform) => (
              <div key={platform.name} className="platform-chip">
                <span>{platform.name}</span>
                <span className={`status-pill ${platform.active ? 'status-volunteer' : 'status-donor'}`}>
                  {platform.active ? 'Active' : 'Paused'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>High-value metrics</h3>
          <div className="metric-grid">
            {socialMetrics.map((metric) => (
              <div key={metric.label} className="metric-card">
                <span className="metric-label">{metric.label}</span>
                <strong>{metric.value.toLocaleString()}{metric.unit}</strong>
                <span className="metric-trend">{metric.trend}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Campaign calendar</h3>
          <div className="calendar-header">
            <button type="button" className="secondary" onClick={() => moveMonth(-1)}>
              Previous
            </button>
            <strong>{monthLabel}</strong>
            <button type="button" className="secondary" onClick={() => moveMonth(1)}>
              Next
            </button>
          </div>
          <div className="calendar-grid">
            {weekdayLabels.map((weekday) => (
              <div key={weekday} className="calendar-weekday">
                {weekday}
              </div>
            ))}
            {calendarDays.map(({ date, isCurrentMonth }) => {
              const key = formatCalendarKey(date);
              const isSelected = key === selectedKey;
              const isToday = key === todayKey;
              return (
                <button
                  type="button"
                  key={key}
                  className={`calendar-day ${isCurrentMonth ? '' : 'calendar-day--dimmed'} ${isSelected ? 'calendar-day--selected' : ''} ${isToday ? 'calendar-day--today' : ''}`}
                  onClick={() => setSelectedDate(date)}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
          <div className="calendar-details">
            <h4>Events for {selectedDate.toLocaleDateString()}</h4>
            <ul>
              {eventsForSelectedDate.length > 0 ? (
                eventsForSelectedDate.map((event, index) => <li key={`${selectedKey}-${index}`}>{event}</li>)
              ) : (
                <li className="muted-text">No events scheduled for this day.</li>
              )}
            </ul>
            <div className="form-group">
              <label htmlFor="calendar-event">Add event</label>
              <input
                id="calendar-event"
                value={calendarEvent}
                onChange={(event) => setCalendarEvent(event.target.value)}
                placeholder="Content review, press brief, post draft"
              />
            </div>
            <button type="button" className="primary" onClick={handleAddCalendarEvent}>
              Add calendar event
            </button>
          </div>
        </div>

        <div className="card">
          <h3>Notes & to-dos</h3>
          <div className="note-todo-grid">
            <div>
              <h4>Quick notes</h4>
              <div className="form-group">
                <textarea
                  value={noteDraft}
                  onChange={(event) => setNoteDraft(event.target.value)}
                  placeholder="Record talking points, key priorities, or campaign reminders"
                />
              </div>
              <button type="button" className="primary" onClick={handleAddNote}>
                Save note
              </button>
              <div className="note-list">
                {notes.map((note) => (
                  <div key={note.id} className="note-item">
                    <p>{note.text}</p>
                    <button type="button" className="secondary small" onClick={() => handleDeleteNote(note.id)}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4>To-do list</h4>
              <div className="form-group">
                <input
                  value={todoDraft}
                  onChange={(event) => setTodoDraft(event.target.value)}
                  placeholder="Add action item for social or field team"
                />
              </div>
              <button type="button" className="primary" onClick={handleAddTodo}>
                Add task
              </button>
              <div className="todo-list">
                {todos.map((item) => (
                  <div key={item.id} className="todo-item">
                    <label>
                      <input type="checkbox" checked={item.completed} onChange={() => handleToggleTodo(item.id)} />
                      <span className={item.completed ? 'todo-completed' : ''}>{item.text}</span>
                    </label>
                    <button type="button" className="secondary small" onClick={() => handleDeleteTodo(item.id)}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Create new post</h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="post-title">Post title</label>
            <input
              id="post-title"
              value={postDraft.title}
              onChange={(e) => setPostDraft({ ...postDraft, title: e.target.value })}
              placeholder="Enter post title"
            />
          </div>
          <div className="form-group">
            <label htmlFor="post-platform">Platform</label>
            <select
              id="post-platform"
              value={postDraft.platform}
              onChange={(e) => setPostDraft({ ...postDraft, platform: e.target.value })}
            >
              {socialPlatforms.filter(p => p.active).map(p => (
                <option key={p.name} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group form-span-full">
            <label htmlFor="post-content">Post content</label>
            <textarea
              id="post-content"
              value={postDraft.content}
              onChange={(e) => setPostDraft({ ...postDraft, content: e.target.value })}
              placeholder="Write your post content here..."
              rows={4}
            />
          </div>
        </div>
        <button type="button" className="primary" onClick={handleCreatePost}>
          Create post
        </button>
      </div>

      <div className="card">
        <h3>Cross-post performance</h3>
        <p>See engagement and reach for every cross-posted campaign message.</p>
        <table className="data-table">
          <thead>
            <tr>
              <th>Post</th>
              <th>Platform</th>
              <th>Impressions</th>
              <th>Engagement</th>
              <th>Interactions</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>{post.platform}</td>
                <td>{post.impressions.toLocaleString()}</td>
                <td>{post.engagementRate}%</td>
                <td>{post.interactions.toLocaleString()}</td>
                <td>{post.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Peer benchmark</h3>
        <p>Compare your engagement and reach against the state average and top opponent.</p>
        <table className="data-table">
          <thead>
            <tr>
              <th>Comparison</th>
              <th>Engagement</th>
              <th>Shares</th>
              <th>Profile views</th>
            </tr>
          </thead>
          <tbody>
            {benchmarkComparison.map((item) => (
              <tr key={item.name} className={item.name === 'Your campaign' ? 'row-highlight' : ''}>
                <td>{item.name}</td>
                <td>{item.engagement}%</td>
                <td>{item.shares.toLocaleString()}</td>
                <td>{item.profileViews.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
