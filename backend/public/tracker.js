(function () {
  // 1. Determine API endpoint dynamically from the script source URL
  const scriptSrc = document.currentScript ? document.currentScript.src : '';
  const apiOrigin = scriptSrc ? new URL(scriptSrc).origin : window.location.origin;
  const apiEndpoint = `${apiOrigin}/api/events`;

  // 2. Session Management
  const SESSION_KEY = 'clickmap_session_id';
  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    // Generate UUID v4 fallback if crypto.randomUUID is not available
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      sessionId = crypto.randomUUID();
    } else {
      sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  // 3. Helper function to send events
  function sendEvent(eventType, x = null, y = null) {
    const payload = {
      session_id: sessionId,
      event_type: eventType,
      page_url: window.location.href.split('?')[0].split('#')[0], // Clean URL without query/hash
      timestamp: new Date().toISOString(),
      x: x !== null ? Math.round(x) : null,
      y: y !== null ? Math.round(y) : null,
    };

    const data = JSON.stringify(payload);

    try {
      if (typeof fetch === 'function') {
        fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: data,
          keepalive: true, // Keep-alive ensures the request completes even if the page unloads
        }).catch(() => {
          // Suppress errors silently
        });
      } else if (navigator.sendBeacon) {
        const blob = new Blob([data], { type: 'application/json' });
        navigator.sendBeacon(apiEndpoint, blob);
      }
    } catch (e) {
      // Suppress errors silently
    }
  }

  // 4. Track Page View on DOMContentLoaded
  function initPageView() {
    sendEvent('page_view');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageView);
  } else {
    initPageView();
  }

  // 5. Track Click events on document click
  document.addEventListener('click', function (event) {
    // pageX and pageY include the scroll offsets automatically.
    const pageX = event.pageX;
    const pageY = event.pageY;
    const clientWidth = document.documentElement.clientWidth;

    // Normalize horizontal coordinate relative to the 1280px canvas (with 1200px centered page grid)
    let x_normalized;
    if (clientWidth >= 1200) {
      // Screen is wider than the layout container (which is centered at 1200px)
      const x_offset = pageX - (clientWidth / 2);
      x_normalized = 640 + x_offset;
    } else {
      // Screen is narrower (fluid responsive container), map proportionately
      x_normalized = (pageX / clientWidth) * 1200 + 40;
    }

    // pageY maps directly to the document scroll height
    const y_normalized = pageY;

    sendEvent('click', x_normalized, y_normalized);
  });
})();
