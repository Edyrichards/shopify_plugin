(() => {
  const apiUrl = window.ADVANCED_SEARCH_API_URL || '/api';
  document.addEventListener('DOMContentLoaded', () => {
    const input = document.querySelector('.advanced-search-bar input[type="search"]');
    const resultsContainer = document.querySelector('#advanced-search-results');
    if (!input) return;

    let timeout;
    input.addEventListener('input', () => {
      clearTimeout(timeout);
      const query = input.value.trim();
      if (!query) {
        if (resultsContainer) resultsContainer.innerHTML = '';
        return;
      }
      timeout = setTimeout(async () => {
        try {
          const resp = await fetch(`${apiUrl}/search?q=${encodeURIComponent(query)}`);
          const data = await resp.json();
          if (resultsContainer) {
            resultsContainer.innerHTML = data.slice(0, 5).map(p => `<li><a href="/products/${p.handle}">${p.title}</a></li>`).join('');
          }
        } catch (err) {
          console.error('Search failed', err);
        }
      }, 300);
    });
  });
})();
