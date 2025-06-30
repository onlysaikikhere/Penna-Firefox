# Penna - Firefox Extension

A simple, elegant note-taking extension for Firefox with customizable themes and floating toolbar.

## Features

- **Custom Colors**: Choose your own background and text colors
- **Floating Toolbar**: Space-saving design with easy access to formatting tools
- **Export Options**: Save notes as TXT or formatted text files
- **Text Formatting**: Align, strikethrough, underline options
- **Persistent Settings**: Your color choices are remembered
- **Resizable Window**: Opens in a popup window that can be resized

## Installation

1. Open Firefox
2. Navigate to `about:debugging`
3. Click "This Firefox"
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file from this folder

## Usage

1. Click the Penna icon in the toolbar
2. Use the color pickers to customize your theme
3. Write your notes in the text area
4. Click the floating "+" button to access formatting and save options
5. Save your notes as TXT files or formatted text

## Firefox Compatibility

This version is specifically built for Firefox using:
- Manifest v2 format
- `browser` API namespace
- Firefox-specific background script format
- Compatible with Firefox 42.0 and above

## Files

- `manifest.json` - Extension configuration
- `popup.html` - Main interface
- `popup.js` - Functionality and logic
- `style.css` - Styling and layout
- `background.js` - Background script for popup window
- `README.md` - This file
