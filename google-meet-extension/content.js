// ─── State ────────────────────────────────────────────────────────────────────
let isStreaming  = false;
let meetingId    = '';
let observer     = null;
let debounceTimer = null;
let chunkCount   = 0;

// Bounded dedup set — prevents memory leak from growing forever
const MAX_SEEN = 500;
const seenTexts = new Set();

// ─── Caption selectors ────────────────────────────────────────────────────────
// Google Meet obfuscates class names and changes them on every deploy.
// We use multiple strategies in priority order so at least one works.
const CAPTION_CONTAINER_SELECTORS = [
  '[data-message-text]',           // attribute-based (most stable)
  '[jsname="tgaKEf"]',             // jsname attributes change less often
  '[jsname="YSxPC"]',
  '.iTTPOb',                       // legacy obfuscated class (fallback)
  '.a4cQT',
];

const SPEAKER_SELECTORS = [
  '[data-sender-name]',
  '[jsname="r4nke"]',
  '.gV33Ad',
  '.zWGUib',
];

const TEXT_SELECTORS = [
  '[data-message-text]',
  '[jsname="tgaKEf"]',
  '.zs7s8d',
  '.VbkSUe',
  '.CNusmb',
];

// ─── Message listener (from popup) ───────────────────────────────────────────
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_STATUS') {
    sendResponse({ isStreaming, meetingId, chunkCount });

  } else if (request.type === 'START') {
    meetingId   = request.meetingId;
    isStreaming = true;
    chunkCount  = 0;
    seenTexts.clear();
    tryEnableCaptions();
    startObserving();
    sendResponse({ isStreaming, meetingId, chunkCount });

  } else if (request.type === 'STOP') {
    isStreaming = false;
    stopObserving();
    sendResponse({ isStreaming, meetingId, chunkCount });
  }

  return true; // keep message channel open for async sendResponse
});

// ─── Caption enabling ─────────────────────────────────────────────────────────
function tryEnableCaptions() {
  // Try multiple known aria-label patterns for the CC button
  const ccLabels = ['turn on captions', 'captions', 'closed captions', 'cc'];

  const allButtons = Array.from(document.querySelectorAll('button[aria-label]'));
  const ccBtn = allButtons.find(btn => {
    const label = btn.getAttribute('aria-label').toLowerCase();
    return ccLabels.some(l => label.includes(l));
  });

  if (ccBtn) {
    const isOn = ccBtn.getAttribute('aria-pressed') === 'true'
              || ccBtn.getAttribute('aria-checked') === 'true';
    if (!isOn) {
      ccBtn.click();
      console.log('[Meet Bridge] Captions enabled automatically');
    } else {
      console.log('[Meet Bridge] Captions already on');
    }
  } else {
    console.warn('[Meet Bridge] CC button not found — enable captions manually');
  }
}

// ─── DOM Observer ─────────────────────────────────────────────────────────────
function startObserving() {
  if (observer) observer.disconnect();

  observer = new MutationObserver(() => {
    // Debounce: batch rapid DOM mutations into one read every 800ms
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(readCaptions, 800);
  });

  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  console.log('[Meet Bridge] Observing captions for meetingId:', meetingId);
}

function stopObserving() {
  clearTimeout(debounceTimer);
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  console.log('[Meet Bridge] Stopped. Total chunks sent:', chunkCount);
}

// ─── Caption reading ──────────────────────────────────────────────────────────
function readCaptions() {
  if (!isStreaming) return;

  // Try each container selector until we find caption blocks
  let blocks = [];
  for (const sel of CAPTION_CONTAINER_SELECTORS) {
    blocks = Array.from(document.querySelectorAll(sel));
    if (blocks.length > 0) break;
  }

  // Fallback: scan all elements for caption-like text patterns
  if (blocks.length === 0) {
    blocks = findCaptionBlocksFallback();
  }

  blocks.forEach(block => {
    const text    = extractText(block);
    const speaker = extractSpeaker(block);

    if (!text || text.length < 3) return;

    // Dedup check
    const key = `${speaker}::${text}`;
    if (seenTexts.has(key)) return;

    // Bounded set — evict oldest entries when limit reached
    if (seenTexts.size >= MAX_SEEN) {
      const first = seenTexts.values().next().value;
      seenTexts.delete(first);
    }
    seenTexts.add(key);

    sendChunk(speaker, text);
  });
}

function extractText(block) {
  // Try attribute first (most reliable)
  const attr = block.getAttribute('data-message-text');
  if (attr) return attr.trim();

  // Try child selectors
  for (const sel of TEXT_SELECTORS) {
    const el = block.querySelector(sel);
    if (el?.innerText?.trim()) return el.innerText.trim();
  }

  // Last resort: innerText of the block itself if it's short enough to be a caption
  const raw = block.innerText?.trim();
  if (raw && raw.length < 500) return raw;

  return null;
}

function extractSpeaker(block) {
  const attr = block.getAttribute('data-sender-name');
  if (attr) return attr.trim();

  for (const sel of SPEAKER_SELECTORS) {
    const el = block.querySelector(sel);
    if (el?.innerText?.trim()) return el.innerText.trim();
  }

  return 'Speaker';
}

// Fallback: look for elements whose text looks like live captions
// (short, inside a known caption region near the bottom of the screen)
function findCaptionBlocksFallback() {
  const candidates = Array.from(document.querySelectorAll('div, span'))
    .filter(el => {
      const rect = el.getBoundingClientRect();
      const text = el.innerText?.trim();
      return (
        text &&
        text.length > 5 &&
        text.length < 300 &&
        rect.bottom > window.innerHeight * 0.6 && // lower 40% of screen
        rect.width > 100
      );
    });
  return candidates;
}

// ─── Backend communication ────────────────────────────────────────────────────
async function sendChunk(speaker, text) {
  const payload = { meetingId, speaker, text };

  try {
    const res = await fetchWithRetry('http://localhost:5000/api/meetings/chunk', payload);
    chunkCount++;

    // Notify popup of updated chunk count
    chrome.runtime.sendMessage({ type: 'CHUNK_SENT', chunkCount }).catch(() => {});

    console.log(`[Meet Bridge] Chunk #${chunkCount} sent — ${speaker}: ${text.slice(0, 60)}`);
    return res;
  } catch (err) {
    console.error('[Meet Bridge] Failed to send chunk after retries:', err.message);
  }
}

async function fetchWithRetry(url, body, retries = 2, delayMs = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (attempt === retries) throw err;
      await sleep(delayMs * attempt); // exponential-ish back-off
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
