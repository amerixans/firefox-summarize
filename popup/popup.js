// Add a listener for the summarize message from the background script
document.getElementById('summarize-btn').addEventListener('click', () => {
  const summaryText = document.getElementById('summary-text');
  const errorMessage = document.getElementById('error-message');
  const apiKeyDiv = document.getElementById('api-key');
  const apiKeyInput = document.getElementById('input-api-key');

  summaryText.innerHTML = 'Summarizing...';
  errorMessage.classList.add('hidden');

  // Send a message to the background script to start summarization
  browser.runtime.sendMessage({ type: 'summarize' })
    .then(response => {
      if (response.error) {
        summaryText.innerHTML = '';
        errorMessage.textContent = `Error: ${response.error}`;
        errorMessage.classList.remove('hidden');
        if (response.missingApiKey) {
          errorMessage.classList.remove('hidden');
          apiKeyDiv.classList.remove('hidden');
          apiKeyInput.focus();
        }
      } else {
        // Replace line breaks with <br> tags
        response.summary = response.summary.replace(/\n/g, '<br/>');
        summaryText.innerHTML = response.summary;
        errorMessage.classList.add('hidden');
      }
    });
});

// Add a listener for the setApiKey message from the background script
document.getElementById('send-api-key').addEventListener('click', () => {
  const apiKeyDiv = document.getElementById('api-key');
  const apiKeyInput = document.getElementById('input-api-key');
  const errorMessage = document.getElementById('error-message');
  const summaryText = document.getElementById('summary-text');


  browser.runtime.sendMessage({ type: 'setApiKey', apiKey: apiKeyInput.value })
    .then((response) => {
      apiKeyInput.value = '';
      
      if (response.error) {
        errorMessage.textContent = `Error: ${response.error}`;
        errorMessage.classList.remove('hidden');
      } else {
        errorMessage.classList.add('hidden');
        apiKeyDiv.classList.add('hidden');
        summaryText.innerHTML = 'API key set successfully!';
      }
    });
});