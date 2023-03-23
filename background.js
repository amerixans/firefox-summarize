// Replace with your own API key and GPT service endpoint
const API_KEY = 'API-KEY';
const GPT_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

// A function to send a request to the GPT API for chat completion
async function getChatCompletion(prompt) {
    console.log('bg 7', prompt);
    
    const requestBody = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3
    };
    console.log('Request body:', requestBody);
    
    const response = await fetch(GPT_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });
  
    if (response.ok) {
      const data = await response.json();
      console.log('bg 16', data);
      return data.choices[0].message.content;
    } else {
      console.error('GPT API error details:', await response.json());
      throw new Error(`GPT API error: ${response.statusText}`);
    }
  }

// Listen for messages from popup.js and content_script.js
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'summarize') {
    console.log('bg 28');
    // Get the active tab and send a message to the content script to extract text
    browser.tabs.query({ active: true, currentWindow: true })
      .then(tabs => {
        const activeTab = tabs[0];
        return browser.tabs.sendMessage(activeTab.id, { type: 'extractText' });
      })
      .then(text => {
        console.log('bg 38', text);
        if (!text || text.length === 0) {
          throw new Error('No text found on page');
        }
        const first1000Words = text.split(' ').slice(0, 1000).join(' ');
        const prompt = 'Return the 3 most interesting (fun) facts from the following article: """' + first1000Words + '..."""';
        return getChatCompletion(prompt);
      })
      .then(summary => {
        console.log("bg 51", summary);
        sendResponse({ summary })
    })
      .catch(error => sendResponse({ error: error.message }));
    return true;
  }
});
