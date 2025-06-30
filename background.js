// Firefox background script
console.log('Background script loaded');

// Simple test to ensure the extension is working
browser.browserAction.onClicked.addListener(async (tab) => {
  console.log('Browser action clicked');
  
  try {
    // Try to create a popup window
    const window = await browser.windows.create({
      url: browser.runtime.getURL('popup.html'),
      type: 'popup',
      width: 450,
      height: 650,
      focused: true
    });
    console.log('Window created successfully:', window);
  } catch (error) {
    console.error('Error creating window:', error);
    
    // Fallback: try to open in a new tab
    try {
      await browser.tabs.create({
        url: browser.runtime.getURL('popup.html')
      });
      console.log('Opened in new tab as fallback');
    } catch (tabError) {
      console.error('Error opening in tab:', tabError);
    }
  }
});

console.log('Penna extension loaded');
