import { useState, useMemo, useRef } from 'react';
import type { Expense, ExpenseCategory, BudgetLine } from '../../types';
import { demoExpenses, demoBudget } from '../../data/politicianData';

function SuccessToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      background: '#F0FDF4', borderLeft: '4px solid #16A34A',
      padding: '12px 16px', borderRadius: 8, fontSize: 14,
      color: '#14532D', boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <span>{message}</span>
      <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#14532D', fontSize: 16 }}>✕</button>
    </div>
  );
}

function downloadCSV(rows: string[][], filename: string) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = filename; a.click();
}

const CATEGORIES: ExpenseCategory[] = ['Advertising', 'Staff', 'Travel', 'Events', 'Technology', 'Office', 'Consulting', 'Printing', 'Other'];

type Tab = 'expenses' | 'budget' | 'reports';

function AddExpenseModal({ show, onClose, onSave }: { show: boolean; onClose: () => void; onSave: (e: Expense) => void }) {
  const [form, setForm] = useState({
    vendor: '', amount: '', category: 'Advertising' as ExpenseCategory,
    date: new Date().toISOString().slice(0, 10), paymentMethod: 'card' as Expense['paymentMethod'],
    memo: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!show) return null;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.vendor.trim()) e.vendor = 'Required';
    if (!form.amount || Number(form.amount) <= 0) e.amount = 'Must be > 0';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const expense: Expense = {
      id: `exp-${Date.now()}`,
      vendor: form.vendor,
      amount: Number(form.amount),
      category: form.category,
      date: form.date,
      paymentMethod: form.paymentMethod,
      approvalStatus: 'pending',
      memo: form.memo,
    };
    onSave(expense);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Expense</h3>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="pol-field-group">
              <label>Vendor</label>
              <input value={form.vendor} onChange={(e) => setForm((p) => ({ ...p, vendor: e.target.value }))} />
              {errors.vendor && <span className="pol-field-error">{errors.vendor}</span>}
            </div>
            <div className="pol-field-group">
              <label>Amount ($)</label>
              <input type="number" min="1" step="10" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} />
              {errors.amount && <span className="pol-field-error">{errors.amount}</span>}
            </div>
            <div className="pol-field-group">
              <label>Category</label>
              <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as ExpenseCategory }))}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="pol-field-group">
              <label>Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} />
            </div>
            <div className="pol-field-group">
              <label>Payment Method</label>
              <select value={form.paymentMethod} onChange={(e) => setForm((p) => ({ ...p, paymentMethod: e.target.value as Expense['paymentMethod'] }))}>
                <option value="card">Card</option>
                <option value="check">Check</option>
                <option value="wire">Wire</option>
                <option value="cash">Cash</option>
              </select>
            </div>
            <div className="pol-field-group form-span-full">
              <label>Memo</label>
              <textarea value={form.memo} onChange={(e) => setForm((p) => ({ ...p, memo: e.target.value }))} style={{ minHeight: 80 }} />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="pol-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="pol-btn-primary" onClick={handleSave}>Save Expense</button>
        </div>
      </div>
    </div>
  );
}

export function PoliticianExpenses() {
  const [tab, setTab] = useState<Tab>('expenses');
  const [expenses, setExpenses] = useState<Expense[]>(demoExpenses);
  const [budget] = useState<BudgetLine[]>(demoBudget);
  const [showAdd, setShowAdd] = useState(false);
  const [filterCategory, setFilterCategory] = useState<'all' | ExpenseCategory>('all');
  const [toast, setToast] = useState<string | null>(null);
  const receiptInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const totalBudget = useMemo(() => budget.reduce((s, b) => s + b.budgeted, 0), [budget]);
  const totalSpent = useMemo(() => expenses.filter((e) => e.approvalStatus === 'approved').reduce((s, e) => s + e.amount, 0), [expenses]);
  const pendingCount = useMemo(() => expenses.filter((e) => e.approvalStatus === 'pending').length, [expenses]);
  const burnRateWeekly = Math.round(totalSpent / 16);
  const weeksRemaining = totalBudget > totalSpent ? Math.round((totalBudget - totalSpent) / (burnRateWeekly || 1)) : 0;

  const filteredExpenses = useMemo(() =>
    filterCategory === 'all' ? expenses : expenses.filter((e) => e.category === filterCategory),
    [expenses, filterCategory]
  );

  const approveExpense = (id: string) => {
    setExpenses((prev) => prev.map((e) => e.id === id ? { ...e, approvalStatus: 'approved' as const, approvedBy: 'Campaign Manager' } : e));
  };

  const handleAddExpense = (e: Expense) => {
    setExpenses((prev) => [e, ...prev]);
  };

  const categorySpend = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.filter((e) => e.approvalStatus === 'approved').forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return map;
  }, [expenses]);

  return (
    <div>
      <div className="pol-page-header">
        <div className="pol-header-left">
          <h1>Expenses & Budget</h1>
          <p>Track every campaign expenditure, manage budgets, and auto-populate Schedule B for FEC filings.</p>
        </div>
        <div className="pol-header-actions">
          <button className="pol-btn-secondary pol-btn-sm" onClick={() => {
            const approved = expenses.filter((e) => e.approvalStatus === 'approved');
            downloadCSV(
              [['Payee', 'Purpose', 'Category', 'Amount', 'Date', 'Method'],
               ...approved.map((e) => [e.vendor, e.memo, e.category, String(e.amount), e.date, e.paymentMethod])],
              'schedule-b.csv'
            );
            showToast('Schedule B exported as CSV.');
          }}>Export Schedule B</button>
          <button className="pol-btn-secondary pol-btn-sm" onClick={() => receiptInputRef.current?.click()}>Upload Receipt</button>
          <input ref={receiptInputRef} type="file" accept=".jpg,.jpeg,.png,.pdf" style={{ display: 'none' }} onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) showToast(`Receipt "${file.name}" attached.`);
            e.target.value = '';
          }} />
          <button className="pol-btn-primary pol-btn-sm" onClick={() => setShowAdd(true)}>Add Expense</button>
        </div>
      </div>

      <div className="pol-stat-grid" style={{ marginBottom: 20 }}>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Total Budget</span>
          <span className="pol-stat-value">${(totalBudget / 1000).toFixed(0)}K</span>
          <span className="pol-stat-sub">Across all categories</span>
        </div>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Total Spent</span>
          <span className="pol-stat-value">${(totalSpent / 1000).toFixed(1)}K</span>
          <span className="pol-stat-sub">{Math.round((totalSpent / totalBudget) * 100)}% of budget</span>
        </div>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Burn Rate</span>
          <span className="pol-stat-value">${burnRateWeekly.toLocaleString()}</span>
          <span className="pol-stat-sub">Per week (est.)</span>
        </div>
        <div className="pol-stat-card">
          <span className="pol-stat-label">Runway</span>
          <span className="pol-stat-value">{weeksRemaining}w</span>
          <span className="pol-stat-sub">{pendingCount} pending approvals</span>
        </div>
      </div>

      <div className="pol-tab-row">
        {(['expenses', 'budget', 'reports'] as Tab[]).map((t) => (
          <button key={t} className={`pol-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t === 'expenses' ? 'Expense Ledger' : t === 'budget' ? 'Budget' : 'Reports'}
          </button>
        ))}
      </div>

      {tab === 'expenses' && (
        <div className="pol-card">
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <select
              style={{ padding: '9px 14px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.88rem' }}
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as 'all' | ExpenseCategory)}
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Memo</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id}>
                    <td style={{ fontWeight: 600 }}>{exp.vendor}</td>
                    <td><span className="pol-badge in-progress">{exp.category}</span></td>
                    <td style={{ fontWeight: 700 }}>${exp.amount.toLocaleString()}</td>
                    <td>{exp.date}</td>
                    <td>{exp.paymentMethod}</td>
                    <td>
                      <span className={`pol-badge ${exp.approvalStatus === 'approved' ? 'passed' : exp.approvalStatus === 'rejected' ? 'failed' : 'pending'}`}>
                        {exp.approvalStatus}
                      </span>
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: '0.85rem', maxWidth: 200 }}>{exp.memo}</td>
                    <td>
                      {exp.approvalStatus === 'pending' && (
                        <button className="pol-btn-primary pol-btn-sm" onClick={() => approveExpense(exp.id)}>Approve</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'budget' && (
        <div>
          <div className="pol-card" style={{ marginBottom: 20 }}>
            <h3>Overall Budget Progress</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.88rem', color: 'var(--muted)' }}>
              <span>Spent: ${totalSpent.toLocaleString()}</span>
              <span>Budget: ${totalBudget.toLocaleString()} ({Math.round((totalSpent / totalBudget) * 100)}% used)</span>
            </div>
            <div className="pol-thermometer">
              <div className="pol-thermometer-fill" style={{ width: `${Math.min(100, (totalSpent / totalBudget) * 100)}%` }} />
            </div>
          </div>
          <div className="pol-grid-2">
            {budget.map((line) => {
              const actualSpent = categorySpend[line.category] || 0;
              const pct = line.budgeted > 0 ? (actualSpent / line.budgeted) * 100 : 0;
              const isOver = actualSpent > line.budgeted;
              return (
                <div key={line.category} className="pol-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <h3 style={{ margin: 0, fontSize: '0.98rem' }}>{line.category}</h3>
                    <span style={{ fontSize: '0.82rem', color: isOver ? '#f87171' : 'var(--muted)' }}>
                      ${actualSpent.toLocaleString()} / ${line.budgeted.toLocaleString()}
                    </span>
                  </div>
                  <div className="pol-progress-track">
                    <div
                      className={`pol-progress-fill${isOver ? ' over-budget' : pct > 80 ? ' near-limit' : ''}`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
                    <span>{Math.round(pct)}% used</span>
                    <span style={{ color: isOver ? 'var(--color-danger)' : undefined }}>{isOver ? 'Over budget' : `$${(line.budgeted - actualSpent).toLocaleString()} remaining`}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'reports' && (
        <div className="pol-card">
          <h3>Schedule B — Itemized Disbursements</h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 16 }}>Auto-populated from approved expense records for FEC filing.</p>
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <button className="pol-btn-primary pol-btn-sm" onClick={() => {
              const approved = expenses.filter((e) => e.approvalStatus === 'approved');
              downloadCSV(
                [['Payee', 'Purpose', 'Category', 'Amount', 'Date', 'Method'],
                 ...approved.map((e) => [e.vendor, e.memo, e.category, String(e.amount), e.date, e.paymentMethod])],
                'schedule-b.csv'
              );
              showToast('Schedule B CSV downloaded.');
            }}>Download CSV</button>
            <button className="pol-btn-secondary pol-btn-sm" onClick={() => showToast('PDF download coming soon. Use Download CSV for now.')}>Download PDF</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr><th>Payee</th><th>Purpose</th><th>Category</th><th>Amount</th><th>Date</th><th>Method</th></tr>
              </thead>
              <tbody>
                {expenses.filter((e) => e.approvalStatus === 'approved').map((e) => (
                  <tr key={e.id}>
                    <td style={{ fontWeight: 600 }}>{e.vendor}</td>
                    <td style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{e.memo}</td>
                    <td><span className="pol-badge in-progress">{e.category}</span></td>
                    <td style={{ fontWeight: 700 }}>${e.amount.toLocaleString()}</td>
                    <td>{e.date}</td>
                    <td>{e.paymentMethod}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} style={{ fontWeight: 700, paddingTop: 16 }}>Total Disbursements</td>
                  <td style={{ fontWeight: 700 }}>${totalSpent.toLocaleString()}</td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      <AddExpenseModal show={showAdd} onClose={() => setShowAdd(false)} onSave={(e) => { handleAddExpense(e); showToast('Expense saved successfully.'); }} />
      {toast && <SuccessToast message={toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
