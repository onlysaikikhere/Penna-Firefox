// Debug logging
console.log('Popup script loaded');

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Content Loaded');
  const editor = document.getElementById('editor');
  const saveNoteTxtBtn = document.getElementById('save-note-txt');
  const saveNotePdfBtn = document.getElementById('save-note-pdf');
  const alignLeftBtn = document.getElementById('align-left');
  const alignCenterBtn = document.getElementById('align-center');
  const alignRightBtn = document.getElementById('align-right');
  const strikethroughBtn = document.getElementById('strikethrough');
  const underlineBtn = document.getElementById('underline');
  const backgroundColorPicker = document.getElementById('background-color-picker');
  const textColorPicker = document.getElementById('text-color-picker');
  const floatingBtn = document.getElementById('floating-btn');
  const floatingToolbar = document.getElementById('floating-toolbar');
  const dateElement = document.querySelector('.date');
  const titleElement = document.querySelector('.title');

  // Use browser API for Firefox compatibility
  const storageAPI = typeof browser !== 'undefined' ? browser.storage : chrome.storage;
  const downloadsAPI = typeof browser !== 'undefined' ? browser.downloads : chrome.downloads;
  const runtimeAPI = typeof browser !== 'undefined' ? browser.runtime : chrome.runtime;

  // Debug: Check if elements are found
  console.log('Elements found:');
  console.log('- editor:', editor);
  console.log('- backgroundColorPicker:', backgroundColorPicker);
  console.log('- textColorPicker:', textColorPicker);
  console.log('- titleElement:', titleElement);
  console.log('- dateElement:', dateElement);

  // Set current date
  dateElement.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Load saved colors
  try {
    storageAPI.sync.get(['customBackgroundColor', 'customTextColor'], function(result) {
      if (runtimeAPI.lastError) {
        console.error('Storage error:', runtimeAPI.lastError);
        return;
      }
      
      console.log('Loaded colors from storage:', result);
      
      if (result.customBackgroundColor) {
        backgroundColorPicker.value = result.customBackgroundColor;
        document.body.style.setProperty('background-color', result.customBackgroundColor, 'important');
        editor.style.setProperty('background-color', result.customBackgroundColor, 'important');
        
        const container = document.querySelector('.container');
        if (container) {
          container.style.setProperty('background-color', result.customBackgroundColor, 'important');
        }
      }
      
      if (result.customTextColor) {
        textColorPicker.value = result.customTextColor;
        document.body.style.setProperty('color', result.customTextColor, 'important');
        titleElement.style.setProperty('color', result.customTextColor, 'important');
        dateElement.style.setProperty('color', result.customTextColor, 'important');
        editor.style.setProperty('color', result.customTextColor, 'important');
        
        // Apply to all existing editor content
        const editorElements = editor.querySelectorAll('*');
        editorElements.forEach(el => {
          el.style.setProperty('color', result.customTextColor, 'important');
        });
      }
    });
  } catch (error) {
    console.error('Error loading saved colors:', error);
  }

  // Floating button toggle
  floatingBtn.addEventListener('click', function() {
    floatingToolbar.classList.toggle('visible');
    floatingBtn.classList.toggle('active');
  });

  // Close floating toolbar when clicking outside
  document.addEventListener('click', function(event) {
    if (!floatingBtn.contains(event.target) && !floatingToolbar.contains(event.target)) {
      floatingToolbar.classList.remove('visible');
      floatingBtn.classList.remove('active');
    }
  });

  // Background color picker
  backgroundColorPicker.addEventListener('change', function() {
    console.log('Background color picker changed');
    const selectedColor = backgroundColorPicker.value;
    console.log('Selected background color:', selectedColor);
    
    try {
      document.body.style.setProperty('background-color', selectedColor, 'important');
      editor.style.setProperty('background-color', selectedColor, 'important');
      
      // Also apply to container
      const container = document.querySelector('.container');
      if (container) {
        container.style.setProperty('background-color', selectedColor, 'important');
      }
      
      // Save to storage
      storageAPI.sync.set({customBackgroundColor: selectedColor}, function() {
        if (runtimeAPI.lastError) {
          console.error('Error saving background color:', runtimeAPI.lastError);
        } else {
          console.log('Background color saved successfully');
        }
      });
    } catch (error) {
      console.error('Error applying background color:', error);
    }
  });

  // Text color picker
  textColorPicker.addEventListener('change', function() {
    console.log('Text color picker changed');
    const selectedColor = textColorPicker.value;
    console.log('Selected text color:', selectedColor);
    
    try {
      document.body.style.setProperty('color', selectedColor, 'important');
      titleElement.style.setProperty('color', selectedColor, 'important');
      dateElement.style.setProperty('color', selectedColor, 'important');
      editor.style.setProperty('color', selectedColor, 'important');
      
      // Apply to all editor content
      const editorElements = editor.querySelectorAll('*');
      editorElements.forEach(el => {
        el.style.setProperty('color', selectedColor, 'important');
      });
      
      // Save to storage
      storageAPI.sync.set({customTextColor: selectedColor}, function() {
        if (runtimeAPI.lastError) {
          console.error('Error saving text color:', runtimeAPI.lastError);
        } else {
          console.log('Text color saved successfully');
        }
      });
    } catch (error) {
      console.error('Error applying text color:', error);
    }
  });

  // Save as TXT file
  saveNoteTxtBtn.addEventListener('click', function() {
    const titleText = titleElement.innerText.trim() || 'Untitled';
    const sanitizedTitle = titleText.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const noteText = editor.innerText;
    const fullContent = `${titleText}\n\n${noteText}`;

    if (noteText.trim() !== '') {
      const blob = new Blob([fullContent], {type: 'text/plain'});
      const url = URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${sanitizedTitle}_${timestamp}.txt`;

      downloadsAPI.download({
        url: url,
        filename: filename,
        saveAs: true
      }, function(downloadId) {
        if (runtimeAPI.lastError) {
          console.error(runtimeAPI.lastError.message);
        } else {
          editor.innerHTML = '';
          titleElement.innerHTML = '';
        }
      });
    }
  });

  // Save as PDF file (Simple text-based alternative)
  saveNotePdfBtn.addEventListener('click', function() {
    const titleText = titleElement.innerText.trim() || 'Untitled';
    const sanitizedTitle = titleText.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const noteText = editor.innerText.trim();

    if (noteText !== '' || titleText !== 'Untitled') {
      // Create a simple formatted text that can be saved as PDF later
      const formattedContent = `
${titleText}
${'='.repeat(titleText.length)}

Date: ${new Date().toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}

${noteText}

---
Generated by Penna Note Taker
`;

      const blob = new Blob([formattedContent], {type: 'text/plain'});
      const url = URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${sanitizedTitle}_${timestamp}.txt`;

      downloadsAPI.download({
        url: url,
        filename: filename,
        saveAs: true
      }, function(downloadId) {
        if (runtimeAPI.lastError) {
          console.error(runtimeAPI.lastError.message);
        } else {
          editor.innerHTML = '';
          titleElement.innerHTML = '';
          alert('Note saved as formatted text file. You can convert to PDF using any online converter or print to PDF.');
        }
      });
    } else {
      alert('Please add a title or some content before saving.');
    }
  });

  // Text formatting buttons
  alignLeftBtn.addEventListener('click', function() {
    document.execCommand('justifyLeft', false, null);
  });

  alignCenterBtn.addEventListener('click', function() {
    document.execCommand('justifyCenter', false, null);
  });

  alignRightBtn.addEventListener('click', function() {
    document.execCommand('justifyRight', false, null);
  });

  strikethroughBtn.addEventListener('click', function() {
    document.execCommand('strikeThrough', false, null);
  });

  underlineBtn.addEventListener('click', function() {
    document.execCommand('underline', false, null);
  });
  
  // Mutation observer to apply text color to new content
  function applyCurrentTextColor() {
    const currentTextColor = textColorPicker.value;
    if (currentTextColor && currentTextColor !== '#000000') {
      const editorElements = editor.querySelectorAll('*');
      editorElements.forEach(el => {
        el.style.setProperty('color', currentTextColor, 'important');
      });
    }
  }

  // Observe changes in the editor to apply color to new content
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            applyCurrentTextColor();
          }
        });
      }
    });
  });

  observer.observe(editor, {
    childList: true,
    subtree: true
  });
});
