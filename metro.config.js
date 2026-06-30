const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable fsevents watch by forcefully changing the file map provider behavior 
// or limiting watch folders, however standard metro-file-map might not respect USE_POLLING as easily
// in newer versions without watchman. We will reduce the watch folders to minimum.
config.watchFolders = [];

module.exports = config;
