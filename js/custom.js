let translationPopup = null;
let selectionIcon = null;

function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

const handleStableSelection = debounce(() => {
  const selection = window.getSelection();
  if (!selection.isCollapsed) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    createSelectionIcon(
      rect.right + window.scrollX,
      rect.bottom + window.scrollY
    );
  } else {
    cleanupUI();
  }
});

document.addEventListener('selectionchange', handleStableSelection);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') cleanupUI();
});

function createSelectionIcon(x, y) {
  if (selectionIcon) selectionIcon.remove();

  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const rects = range.getClientRects();
  const lastRect = rects[rects.length - 1];
  const iconX = lastRect.right + window.scrollX;
  const iconY = lastRect.bottom + window.scrollY;
  
  selectionIcon = document.createElement('div');
  selectionIcon.innerHTML = '🌐';
  Object.assign(selectionIcon.style, {
    position: 'absolute',
    left: `${iconX + 5}px`,
    top: `${iconY + 5}px`,
    cursor: 'pointer',
    background: 'white',
    borderRadius: '50%',
    padding: '2px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    zIndex: 999999
  });

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const iconSize = 25;

  if (x + iconSize > viewportWidth) {
    selectionIcon.style.left = `${viewportWidth - iconSize - 5}px`;
  }
  if (y + iconSize > viewportHeight) {
    selectionIcon.style.top = `${viewportHeight - iconSize - 5}px`;
  }

  if (isSelectionInInput()) {
    selectionIcon.addEventListener('click', handleInputFieldIconClick);
  }
  else {
    selectionIcon.addEventListener('click', handleIconClick);
  }
  document.body.appendChild(selectionIcon);
}

async function handleIconClick(e) {
  e.stopPropagation();
  const selection = window.getSelection().toString();
  if (!selection) return;

  selectionIcon.innerHTML = '⏳';
  
  try {
    const translatedText = await translateText(selection);
    showTranslationPopup(translatedText, selection);
  } catch (error) {
    console.error(error);
  } finally {
    selectionIcon.innerHTML = '🌐';
  }
}

async function handleInputFieldIconClick(e) {
  e.stopPropagation();
  const selection = window.getSelection().toString();
  if (!selection) return;

  selectionIcon.innerHTML = '⏳';
  
  try {
    const translatedText = await translateText(selection);
    showTranslationPopup(translatedText, selection, true);
  } catch (error) {
    console.error(error);
  } finally {
    selectionIcon.innerHTML = '🌐';
  }
}

function showTranslationPopup(translatedText, originalText, isInputField = false) {
  if (translationPopup) translationPopup.remove();

  translationPopup = document.createElement('div');

  const replaceButton = isInputField ? 
    `<div style="margin-left: 10px; flex-shrink: 0;">
      <button id="replace-button" 
        style="background: rgb(0, 0, 0); color: white; padding: 4px 8px; 
               border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">
        Paste
      </button>
    </div>` 
    : '';

  translationPopup.innerHTML = `
    <div style="position: absolute; background: white; padding: 10px; 
         box-shadow: 0 2px 10px rgba(0,0,0,0.2); border-radius: 4px; z-index: 999999;
         display: flex; align-items: center; max-width: 400px;">
      <div style="flex-grow: 1; margin-right: 10px; word-break: break-word;">${translatedText}</div>
      ${replaceButton}
    </div>`;

  if (isInputField) {
    const button = translationPopup.querySelector('#replace-button');
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      replaceSelectedText(originalText, translatedText);
      cleanupUI();
    });
  }

  document.body.appendChild(translationPopup);
  positionPopup();
}

function replaceSelectedText(original, translated) {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(translated));
  }
}

function positionPopup() {
  if (!selectionIcon || !translationPopup || !translationPopup.children.length) return;

  const iconRect = selectionIcon.getBoundingClientRect();
  const popupContent = translationPopup.children[0];
  const viewportWidth = window.innerWidth;

  const leftPosition = iconRect.left - 100 > 0 
    ? iconRect.left - 100 
    : iconRect.right + 10;
  
  const topPosition = iconRect.top + 30 + popupContent.offsetHeight > window.innerHeight
    ? window.innerHeight - popupContent.offsetHeight - 10
    : iconRect.top + 30;

  Object.assign(popupContent.style, {
    left: `${leftPosition}px`,
    top: `${topPosition}px`
  });
}

function cleanupUI() {
  if (selectionIcon) selectionIcon.remove();
  if (translationPopup) translationPopup.remove();
  selectionIcon = null;
  translationPopup = null;
}

document.addEventListener('click', (e) => {
  if (!translationPopup?.contains(e.target) && !selectionIcon?.contains(e.target)) {
    cleanupUI();
  }
});

const getFromStorage = (key, defaultValue) => 
  new Promise(resolve => 
    chrome.storage.sync.get([key], result => 
      resolve(result[key] || defaultValue)
    )
  );

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

function isSelectionInInput() {
  const activeElement = document.activeElement;
  return activeElement && (
    activeElement.tagName === 'INPUT' || 
    activeElement.tagName === 'TEXTAREA' ||
    activeElement.isContentEditable
  );
}