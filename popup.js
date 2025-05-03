const tl = [
  { code: "vi", name: "Vietnamese" },
  { code: "en", name: "English" },
  { code: "zh-CN", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "es", name: "Spanish" },
  { code: "it", name: "Italian" },
  { code: "ru", name: "Russian" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "bn", name: "Bengali" },
  { code: "pt", name: "Portuguese" },
  { code: "id", name: "Indonesian" },
  { code: "ms", name: "Malay" },
  { code: "th", name: "Thai" },
  { code: "tr", name: "Turkish" },
  { code: "ur", name: "Urdu" },
  { code: "el", name: "Greek" },
  { code: "nl", name: "Dutch" },
  { code: "pl", name: "Polish" },
  { code: "sv", name: "Swedish" },
  { code: "da", name: "Danish" },
  { code: "fi", name: "Finnish" },
  { code: "no", name: "Norwegian" },
  { code: "cs", name: "Czech" },
  { code: "ro", name: "Romanian" },
  { code: "hu", name: "Hungarian" },
  { code: "sk", name: "Slovak" },
  { code: "bg", name: "Bulgarian" },
  { code: "uk", name: "Ukrainian" },
  { code: "ca", name: "Catalan" },
  { code: "iw", name: "Hebrew" },
  { code: "fa", name: "Persian" },
  { code: "hy", name: "Armenian" },
  { code: "ka", name: "Georgian" },
  { code: "km", name: "Khmer" },
  { code: "lo", name: "Lao" },
];
  
  document.addEventListener('DOMContentLoaded', async () => {
    const langInSelect = document.getElementById('language-in');
    const langOutSelect = document.getElementById('language-out');
    
    const uniqueLangs = [...new Set(tl.map(JSON.stringify))].map(JSON.parse);
    uniqueLangs.forEach(lang => {
      langInSelect.innerHTML += `<option value="${lang.code}">${lang.name}</option>`;
      langOutSelect.innerHTML += `<option value="${lang.code}">${lang.name}</option>`;
    });
  
    const [languageIn, languageOut] = await Promise.all([
      getFromStorage('languageIn', 'vi'),
      getFromStorage('languageOut', 'en')
    ]);
    
    langInSelect.value = languageIn;
    langOutSelect.value = languageOut;
  
    document.getElementById('submit-chicken-trans').addEventListener('click', () => {
      chrome.storage.sync.set({
        languageIn: langInSelect.value,
        languageOut: langOutSelect.value
      }, () => window.close());
    });
  
    document.getElementById('close-popup').addEventListener('click', () => window.close());
  });
  
  const getFromStorage = (key, defaultValue) => 
    new Promise(resolve => 
      chrome.storage.sync.get([key], result => 
        resolve(result[key] || defaultValue)
      )
    );