chrome.runtime.onInstalled.addListener((details) => {
  chrome.contextMenus.removeAll(() => {
    createContextMenus();
  });

  if (details.reason === "update") {
    chrome.notifications.create({
      type: "basic",
      iconUrl: chrome.runtime.getURL("assets/img/128.png"),
      title: "Lipsum Generator updated",
      message: "Available in your context menu — right-click on any input to try."
    });
  }
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

    [1, 2, 3, 4, 5].forEach(count => {
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

    [1, 2, 3, 4, 5].forEach(count => {
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

    [1, 2, 3, 4, 5].forEach(count => {
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
    // Inject scripts into the active tab
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['assets/js/lipsum.js', 'content.js']
    });

    // Send message to insert text
    await chrome.tabs.sendMessage(tab.id, {
      action: "insertLipsum",
      menuId: menuId
    });
  } catch (err) {
    // Silently handle - content script not available on this page
    // This is expected on chrome://, extension pages, etc.
  }
});
