/**
 * Entry point of the Election app.
 */
import { app, BrowserWindow, ipcMain, Tray, Menu, shell, dialog, MenuItem, MenuItemConstructorOptions, nativeImage } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { selectFilePathFromExplorer } from 'Utils/files'
import { uploadFile, verifySession } from 'Utils/api'

const screenshot = require('screenshot-desktop')

let mainWindow: Electron.BrowserWindow | null;
let tray: Tray

const logoPath: string = require('Public/logo.png')

function createMainWindow(): void {
    mainWindow = new BrowserWindow({
        height: 300,
        width: 400,
        webPreferences: {
            webSecurity: false,
            devTools: process.env.NODE_ENV !== 'development' ? false : true,
            nodeIntegration: true
        },
        autoHideMenuBar: true,
        resizable: false,
        icon: logoPath
    });

    if (process.env.NODE_ENV !== 'development') {
        mainWindow.removeMenu()
    }

    // and load the index.html of the app.
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, './index.html'),
            protocol: 'file:',
            slashes: true
        })
    );

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

async function updateTray() {
    const trayImg = nativeImage.createFromPath(
        process.env.NODE_ENV !== 'development' ?
            path.join(__dirname, '/../public/logo.png') :
            logoPath
    )

    if (!tray) {
        tray = new Tray(trayImg)
    }

    let res = null

    try {
        res = await verifySession()
    }
    catch (e) {
        console.error(e)
    }

    const menu = Menu.buildFromTemplate([
        {
            label: 'Open shara',
            type: 'normal',
            click: () => {
                if (mainWindow) {
                    mainWindow.show()
                }
                else {
                    createMainWindow()
                }
            }
        },
        res && res.data && {
            label: 'Take a screenshot',
            type: "normal",
            click: () => {
                screenshot()
                    .then(async (img: Buffer) => {
                        const res = await uploadFile({
                            name: `Screenshot-${(new Date()).toLocaleString()}`,
                            isPrivate: false,
                            fileArray: img,
                            meta: {
                                size: img.byteLength,
                                mime: 'image/jpeg',
                                description: ''
                            }
                        })

                        if (res.success && res.data) {
                            shell.openExternal(res.data.imageUrl)
                        }
                    })
                    .catch((e: Error) => {
                        dialog.showErrorBox('Error', e.message)
                    })
            }
        },
        {
            label: 'Quit',
            type: 'normal',
            click: () => {
                if (mainWindow) {
                    mainWindow.close()
                }
                app.exit()
            }
        }
    ].filter(a => !!a) as MenuItemConstructorOptions[] | MenuItem[])

    tray.setToolTip('Shara')
    tray.setContextMenu(menu)
}

function init(): void {
    createMainWindow()
    updateTray()

    ipcMain.handle('get-file-path', async (): Promise<string | null> => {
        const path = await selectFilePathFromExplorer()

        return path
    })

    ipcMain.handle('update-tray', async (): Promise<void> => {
        updateTray()
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', init);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        // app.quit();
    }
});

app.on('activate', () => {
    // On OS X it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        init();
    }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
