function extractTextFromNode(node) {
    let text = '';
  
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent.trim() + ' ';
    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
      for (const child of node.childNodes) {
        text += extractTextFromNode(child);
      }
    }
  
    return text;
  }
  
  function extractTextFromParagraphs() {
    const paragraphs = document.querySelectorAll('p');
    let text = '';
  
    paragraphs.forEach(paragraph => {
      text += extractTextFromNode(paragraph);
    });
  
    return text;
  }
  
  // Listen for messages from the background script
  browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'extractText') {
      const text = extractTextFromParagraphs();
      sendResponse(text);
    }
  });