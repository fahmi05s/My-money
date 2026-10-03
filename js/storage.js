/* storage — the ONLY file that touches browser storage. Swap internals for IndexedDB/Supabase later; callers stay the same. */
const KEY_TX = 'mm_tx', KEY_SET = 'mm_set';
let storageOk = true;
const _mem = {};
function _read(k, d) {
  if (k in _mem) return _mem[k];
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { storageOk = false; return d; }
}
function _write(k, v) {
  try { localStorage.setItem(k, JSON.stringify(v)); delete _mem[k]; } catch (e) { storageOk = false; _mem[k] = v; }
}
function _valid(x) {
  return !!x && typeof x.id === 'string' && Number.isFinite(x.amount) && x.amount > 0 &&
    (x.type === 'income' || x.type === 'expense') && typeof x.description === 'string' &&
    ['cash', 'scan'].includes(x.paymentMethod) && ['IDR', 'THB', 'USD'].includes(x.currency) &&
    /^\d{4}-\d{2}-\d{2}$/.test(x.date) && typeof x.time === 'string';
}
function getTransactions() { const l = _read(KEY_TX, []); return Array.isArray(l) ? l.filter(_valid) : []; }
function addTransaction(t) { const l = getTransactions(); l.push(t); _write(KEY_TX, l); return t; }
function updateTransaction(t) { _write(KEY_TX, getTransactions().map(x => x.id === t.id ? t : x)); }
function deleteTransaction(id) { _write(KEY_TX, getTransactions().filter(x => x.id !== id)); }
function clearTransactions() { _write(KEY_TX, []); }
function getSettings() { const s = _read(KEY_SET, {}); return s && typeof s === 'object' ? s : {}; }
function saveSettings(s) { _write(KEY_SET, s); }
