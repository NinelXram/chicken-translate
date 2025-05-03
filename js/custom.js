// Helper functions
const getFromStorage = (key, defaultValue) => 
  new Promise(resolve => 
    chrome.storage.sync.get([key], result => 
      resolve(result[key] || defaultValue)
    )
  );

document.addEventListener("keydown", async (event) => {
  if (event.ctrlKey) {
    const selection = window.getSelection().toString();
    if (selection) {
      const translatedText = await translateText(selection);
      document.execCommand("insertHTML", false, translatedText);
    }
  }
});

async function translateText(input) {
  const [sourceLang, targetLang] = await Promise.all([
    getFromStorage('languageIn', 'vi'),
    getFromStorage('languageOut', 'en')
  ]);

  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(input)}`
    );
    const data = await response.json();
    return data[0].map(item => item[0]).join('');
  } catch (error) {
    console.error('Translation error:', error);
    return input;
  }
}