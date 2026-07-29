const toggleBtn  = document.getElementById('toggleBtn');
const meetingInput = document.getElementById('meetingId');
const statusDot  = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const chunkBadge = document.getElementById('chunkBadge');
const mainUi     = document.getElementById('main-ui');
const notMeetUi  = document.getElementById('not-meet-ui');

// ─── Init ─────────────────────────────────────────────────────────────────────
chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  if (!tab?.url?.includes('meet.google.com')) {
    mainUi.style.display    = 'none';
    notMeetUi.style.display = 'block';
    return;
  }

  // Restore last-used meetingId from storage
  chrome.storage.local.get(['lastMeetingId'], ({ lastMeetingId }) => {
    if (lastMeetingId) meetingInput.value = lastMeetingId;
  });

  // Automatically fetch active meeting from local Express server
  fetch('http://localhost:5000/api/meetings/active')
    .then(r => r.json())
    .then(data => {
      if (data.active && data.active.meetingId) {
        const meetingId = data.active.meetingId;
        meetingInput.value = meetingId;

        // Get current status from content script
        chrome.tabs.sendMessage(tab.id, { type: 'GET_STATUS' }, (res) => {
          if (chrome.runtime.lastError) return;
          
          // If a live meeting session exists but is not yet streaming, auto-start connection
          if (res && !res.isStreaming) {
            chrome.tabs.sendMessage(tab.id, { type: 'START', meetingId }, (startRes) => {
              if (startRes) renderUi(startRes.isStreaming, startRes.meetingId, startRes.chunkCount ?? 0);
            });
          } else if (res) {
            renderUi(res.isStreaming, res.meetingId, res.chunkCount ?? 0);
          }
        });
      } else {
        // Fallback status check
        chrome.tabs.sendMessage(tab.id, { type: 'GET_STATUS' }, (res) => {
          if (chrome.runtime.lastError) return;
          if (res) renderUi(res.isStreaming, res.meetingId, res.chunkCount ?? 0);
        });
      }
    })
    .catch(err => {
      console.warn("Express server active check offline, using standard storage fallback...", err.message);
      chrome.tabs.sendMessage(tab.id, { type: 'GET_STATUS' }, (res) => {
        if (chrome.runtime.lastError) return;
        if (res) renderUi(res.isStreaming, res.meetingId, res.chunkCount ?? 0);
      });
    });
});

// ─── Toggle button ────────────────────────────────────────────────────────────
toggleBtn.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (!tab) return;

    chrome.tabs.sendMessage(tab.id, { type: 'GET_STATUS' }, (res) => {
      const streaming  = res?.isStreaming ?? false;
      const action     = streaming ? 'STOP' : 'START';
      const meetingId  = meetingInput.value.trim() || `meet_${Date.now()}`;

      if (action === 'START') {
        chrome.storage.local.set({ lastMeetingId: meetingId });
      }

      chrome.tabs.sendMessage(tab.id, { type: action, meetingId }, (response) => {
        if (response) renderUi(response.isStreaming, response.meetingId, response.chunkCount ?? 0);
      });
    });
  });
});

// ─── Live chunk count updates from content script ────────────────────────────
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'CHUNK_SENT') {
    updateChunkBadge(msg.chunkCount);
  }
});

// ─── UI helpers ───────────────────────────────────────────────────────────────
function renderUi(streaming, meetingId, chunks) {
  if (streaming) {
    toggleBtn.textContent    = 'Stop Streaming';
    toggleBtn.style.background = '#ef4444';
    statusDot.className      = 'dot active';
    statusText.textContent   = `Streaming → ${meetingId}`;
    meetingInput.disabled    = true;
    updateChunkBadge(chunks);
  } else {
    toggleBtn.textContent    = 'Connect & Stream';
    toggleBtn.style.background = '#2563eb';
    statusDot.className      = 'dot';
    statusText.textContent   = 'Disconnected';
    meetingInput.disabled    = false;
    chunkBadge.classList.remove('visible');
  }
}

function updateChunkBadge(count) {
  chunkBadge.textContent = `${count} chunk${count !== 1 ? 's' : ''}`;
  chunkBadge.classList.add('visible');
}
