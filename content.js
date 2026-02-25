if (!window.__lipsumInitialized) {
  window.__lipsumInitialized = true;

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "insertLipsum") {
      insertLipsumText(request.menuId);
    }
  });
}

function insertLipsumText(menuId) {
  const [type, countStr] = menuId.split('-');
  const count = parseInt(countStr);

  const typeMap = {
    'words': 'word',
    'sentences': 'sentence',
    'paragraphs': 'paragraph'
  };

  const text = window.Lipsum.get({
    type: typeMap[type],
    quantity: count,
    hasPrefix: false,
    textTransform: 'capitalizeFirstWordInSentence'
  });

  const activeElement = document.activeElement;

  if (!activeElement) return;

  if (activeElement.isContentEditable) {
    insertIntoContentEditable(activeElement, text);
  } else if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
    insertIntoInput(activeElement, text);
  }
}

function insertIntoInput(element, text) {
  const start = element.selectionStart;
  const end = element.selectionEnd;
  const currentValue = element.value;

  const newValue = currentValue.slice(0, start) + text + currentValue.slice(end);

  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value"
  ).set;
  const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype,
    "value"
  ).set;

  if (element.tagName === 'TEXTAREA') {
    nativeTextAreaValueSetter.call(element, newValue);
  } else {
    nativeInputValueSetter.call(element, newValue);
  }

  element.dispatchEvent(new Event('input', { bubbles: true }));

  const newCursorPos = start + text.length;
  element.setSelectionRange(newCursorPos, newCursorPos);
  element.focus();
}

function insertIntoContentEditable(element, text) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  range.deleteContents();

  const textNode = document.createTextNode(text);
  range.insertNode(textNode);

  range.setStartAfter(textNode);
  range.setEndAfter(textNode);
  selection.removeAllRanges();
  selection.addRange(range);

  element.focus();
}
