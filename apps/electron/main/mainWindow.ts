import { join } from "path";
import { URL } from "url";
import { BrowserWindow, app } from "electron";

/**
 * URL for main window.
 * Vite dev server for development.
 * `file://../renderer/index.html` for production and test.
 */
export const pageUrl =
  import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
    ? import.meta.env.VITE_DEV_SERVER_URL
    : new URL("../renderer/dist/index.html", "file://" + __dirname).toString();

async function createWindow() {
  const browserWindow = new BrowserWindow({
    show: false, // Use the 'ready-to-show' event to show the instantiated BrowserWindow.
    width: 768,
    height: 450,
    resizable: false,
    webPreferences: {
      allowRunningInsecureContent: false, // https://www.electronjs.org/docs/latest/tutorial/security#8-do-not-enable-allowrunninginsecurecontent
      enableBlinkFeatures: "", // https://www.electronjs.org/docs/latest/tutorial/security#10-do-not-use-enableblinkfeatures
      experimentalFeatures: false, // https://www.electronjs.org/docs/latest/tutorial/security#9-do-not-enable-experimental-features
      nodeIntegration: false,
      contextIsolation: true,
      // prefer exposing a method via contextBridge before turning off the sandbox. https://www.electronjs.org/docs/latest/api/context-bridge
      // https://www.electronjs.org/docs/latest/tutorial/context-isolation#security-considerations
      sandbox: true, // enable when using Node.js api in the preload script like https://github.com/cawa-93/vite-electron-builder/tree/main/packages/preload/src
      webSecurity: true, // https://www.electronjs.org/docs/latest/tutorial/security#6-do-not-disable-websecurity
      webviewTag: false, // The webview tag is not recommended. Consider alternatives like an iframe or Electron's BrowserView. @see https://www.electronjs.org/docs/latest/api/webview-tag#warning
      preload: join(app.getAppPath(), "preload/dist/index.cjs"),
    },
  });

  /**
   * If the 'show' property of the BrowserWindow's constructor is omitted from the initialization options,
   * it then defaults to 'true'. This can cause flickering as the window loads the html content,
   * and it also has show problematic behaviour with the closing of the window.
   * Use `show: false` and listen to the  `ready-to-show` event to show the window.
   *
   * @see https://github.com/electron/electron/issues/25012 for the afford mentioned issue.
   */
  browserWindow.on("ready-to-show", () => {
    browserWindow.show();

    if (import.meta.env.DEV) {
      browserWindow.webContents.openDevTools();
    }
  });

  await browserWindow.loadURL(pageUrl);

  return browserWindow;
}

/**
 * Restore an existing BrowserWindow or Create a new BrowserWindow.
 */
export async function restoreOrCreateWindow() {
  let window = BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());

  if (window === undefined) {
    window = await createWindow();
  }

  if (window.isMinimized()) {
    window.restore();
  }

  window.focus();
}
