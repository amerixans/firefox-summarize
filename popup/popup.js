document.getElementById('summarize-btn').addEventListener('click', () => {
  const summaryText = document.getElementById('summary-text');
  const errorMessage = document.getElementById('error-message');

  summaryText.innerHTML = 'Summarizing...';
  errorMessage.classList.add('hidden');

  // Send a message to the background script to start summarization
  browser.runtime.sendMessage({ type: 'summarize' })
    .then(response => {
      if (response.error) {
        summaryText.innerHTML = '';
        errorMessage.textContent = `Error: ${response.error}`;
        errorMessage.classList.remove('hidden');
      } else {
        summaryText.innerHTML = response.summary;
        errorMessage.classList.add('hidden');
      }
    })
    .catch(error => {
      summaryText.innerHTML = '';
      errorMessage.textContent = `Error: ${error.message}`;
      errorMessage.classList.remove('hidden');
    });
});
