const electron = require('electron');
const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;
const Menu = electron.Menu;

function createWindow() {
    Menu.setApplicationMenu(null);

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        transparent: false,
        frame: true,
        resizable: false, //固定大小
        devTools: true,
        // icon: './img/raticon.ico'
    })

    const myURL = url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    });

    mainWindow.loadURL(myURL);
    // mainWindow.openDevTools();

    mainWindow.on('closed', function() {
        mainWindow = null;
    });

}

app.on('ready', createWindow);

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function() {
    if (mainWindow === null) {
        createWindow();
    }
});