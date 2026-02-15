chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    createContextMenus();
  });
});

function createContextMenus() {
  chrome.contextMenus.create({
    id: "lipsum-parent",
    title: "Lipsum Generator",
    contexts: ["editable"]
  }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error creating parent menu:', chrome.runtime.lastError);
      return;
    }

    [1, 5, 10].forEach(count => {
      chrome.contextMenus.create({
        id: `words-${count}`,
        parentId: "lipsum-parent",
        title: `${count} Word${count > 1 ? 's' : ''}`,
        contexts: ["editable"]
      });
    });

    chrome.contextMenus.create({
      id: "separator-1",
      parentId: "lipsum-parent",
      type: "separator",
      contexts: ["editable"]
    });

    [1, 3, 5].forEach(count => {
      chrome.contextMenus.create({
        id: `sentences-${count}`,
        parentId: "lipsum-parent",
        title: `${count} Sentence${count > 1 ? 's' : ''}`,
        contexts: ["editable"]
      });
    });

    chrome.contextMenus.create({
      id: "separator-2",
      parentId: "lipsum-parent",
      type: "separator",
      contexts: ["editable"]
    });

    [1, 3].forEach(count => {
      chrome.contextMenus.create({
        id: `paragraphs-${count}`,
        parentId: "lipsum-parent",
        title: `${count} Paragraph${count > 1 ? 's' : ''}`,
        contexts: ["editable"]
      });
    });

    console.log('All context menus created successfully');
  });
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const menuId = info.menuItemId;

  if (menuId === 'lipsum-parent' || menuId.startsWith('separator')) return;

  try {
    await chrome.tabs.sendMessage(tab.id, {
      action: "insertLipsum",
      menuId: menuId
    });
  } catch (err) {
    // Silently handle - content script not available on this page
    // This is expected on chrome://, extension pages, etc.
  }
});
