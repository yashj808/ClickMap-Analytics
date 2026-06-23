(function () {
  // Determine API endpoint dynamically, defaulting to the production Render URL
  const API_URL = 'https://clickmap-analytics.onrender.com';
  const scriptSrc = document.currentScript ? document.currentScript.src : '';
  
  let apiOrigin = API_URL;
  if (scriptSrc && (scriptSrc.includes('localhost') || scriptSrc.includes('127.0.0.1'))) {
    apiOrigin = new URL(scriptSrc).origin;
  } else if (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')) {
    apiOrigin = window.location.origin;
  }
  
  const apiEndpoint = `${apiOrigin}/api/events`;

  // Session Management
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

  // Helper function to send events
  function sendEvent(eventType, x = null, y = null, depth = null, metadata = null) {
    const payload = {
      session_id: sessionId,
      event_type: eventType,
      page_url: window.location.href.split('?')[0].split('#')[0], // Clean URL without query/hash
      timestamp: new Date().toISOString(),
      x: x !== null ? Math.round(x) : null,
      y: y !== null ? Math.round(y) : null,
      depth: depth,
      metadata: metadata,
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

  // Track Page View on DOMContentLoaded
  function initPageView() {
    const metadata = {
      user_agent: navigator.userAgent,
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      referrer: document.referrer || '',
    };
    sendEvent('page_view', null, null, null, metadata);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageView);
  } else {
    initPageView();
  }

  // Track Click events on document click
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

  // Track Scroll Depth threshold crossings
  const triggeredMilestones = new Set();
  let scrollTimeout = null;

  function trackScroll() {
    if (scrollTimeout) return;

    scrollTimeout = setTimeout(function () {
      scrollTimeout = null;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      const scrollableHeight = scrollHeight - clientHeight;
      if (scrollableHeight <= 0) return;

      const scrollPercent = (scrollTop / scrollableHeight) * 100;
      const milestones = [25, 50, 75, 100];

      milestones.forEach(function (milestone) {
        if (scrollPercent >= milestone && !triggeredMilestones.has(milestone)) {
          triggeredMilestones.add(milestone);
          sendEvent('scroll_depth', null, null, milestone, null);
        }
      });
    }, 150); // throttle 150ms
  }

  window.addEventListener('scroll', trackScroll);
})();
