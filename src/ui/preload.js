const { contextBridge, ipcRenderer } = require('electron');

// Expose ipcRenderer to the renderer process safely
contextBridge.exposeInMainWorld('api', {
  getAccessToken: () => ipcRenderer.invoke('get-access-token'),
  validateToken: () => ipcRenderer.invoke('validate-token'),
  logout: () => ipcRenderer.invoke('logout'),
});
