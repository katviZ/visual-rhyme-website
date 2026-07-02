/**
 * Lead capture client — POSTs to the Apps Script Web App, queues failures
 * in localStorage so no lead is ever silently dropped, and auto-flushes
 * the queue on module load (2.5s after first paint).
 *
 * The Apps Script code lives in /apps-script/lead-capture.gs. Deploy it
 * as a Web App (see /apps-script/README.md) and paste the exec URL below.
 */

// Paste your Apps Script exec URL here after deploying the Web App.
// Sentinel value keeps isConfigured() honest until real URL is wired.
export const LEAD_ENDPOINT = 'REPLACE_WITH_APPS_SCRIPT_EXEC_URL';

const QUEUE_KEY = 'vr_lead_queue';
const QUEUE_MAX = 25;

export function isConfigured() {
  return typeof LEAD_ENDPOINT === 'string' &&
         LEAD_ENDPOINT.startsWith('https://') &&
         !LEAD_ENDPOINT.includes('REPLACE_WITH');
}

/**
 * Submit a lead. Returns { ok, queued?, error? }.
 * Never throws. Always writes to localStorage as backup on failure.
 */
export async function submitLead(data) {
  const payload = {
    ...data,
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    referrer: typeof document !== 'undefined' ? document.referrer : '',
    submitted_at: new Date().toISOString(),
  };

  if (!isConfigured()) {
    enqueue(payload);
    return { ok: false, queued: true, error: 'endpoint-not-configured' };
  }

  try {
    const res = await fetch(LEAD_ENDPOINT, {
      method: 'POST',
      // text/plain avoids the CORS preflight that Apps Script cannot
      // easily answer. Apps Script parses e.postData.contents as JSON.
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });
    const json = await res.json().catch(() => ({ ok: res.ok }));
    if (json.ok) {
      flushQueue().catch(() => { /* best-effort */ });
      return { ok: true };
    }
    enqueue(payload);
    return { ok: false, queued: true, error: json.error || 'server-error' };
  } catch (err) {
    enqueue(payload);
    return { ok: false, queued: true, error: err?.message || 'network-error' };
  }
}

/* ---------- queue internals ---------- */

function readQueue() {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function writeQueue(q) {
  try {
    if (!q || q.length === 0) {
      localStorage.removeItem(QUEUE_KEY);
    } else {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(q.slice(-QUEUE_MAX)));
    }
  } catch { /* privacy mode etc — silently ignore */ }
}

function enqueue(payload) {
  const q = readQueue();
  q.push(payload);
  writeQueue(q);
}

export async function flushQueue() {
  if (!isConfigured()) return { flushed: 0, remaining: readQueue().length };
  const q = readQueue();
  if (q.length === 0) return { flushed: 0, remaining: 0 };

  const remaining = [];
  let flushed = 0;
  for (const item of q) {
    try {
      const res = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(item),
        redirect: 'follow',
      });
      const json = await res.json().catch(() => ({ ok: res.ok }));
      if (json.ok) flushed++;
      else remaining.push(item);
    } catch {
      remaining.push(item);
    }
  }
  writeQueue(remaining);
  return { flushed, remaining: remaining.length };
}

// Auto-flush shortly after first paint if any leads are queued from a
// previous visit where the endpoint was down.
if (typeof window !== 'undefined') {
  setTimeout(() => {
    if (readQueue().length > 0 && isConfigured()) {
      flushQueue().catch(() => { /* best-effort */ });
    }
  }, 2500);
}
