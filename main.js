// Modules to control application life and create native browser window
require('dotenv').config()
const {app, BrowserWindow} = require('electron')
const express = require('express')
const cors = require('cors')
const path = require('path')
const Datastore = require('nedb')
const crypto = require('crypto');
const exec = require('child_process').exec;
const Discord = require('discord.js');
const ytfps = require('ytfps');

const db = new Datastore({ filename: './playlist', autoload: true });

const client = new Discord.Client();

const expressApp = express()
expressApp.use(cors())
expressApp.use(express.static('public'))
expressApp.listen("3138")

let mainWindow = undefined;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 640,
    height: 360,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    useContentSize: true,
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  mainWindow.removeMenu();

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

client.on('message', async (msg) => {

  if (msg.mentions.has(client.user)) {
    if(msg.content.split(" ")[1] === "skip"){
      mainWindow.webContents.send("onSkipRequest")

    } else if(msg.content.split(" ")[1] === "pause"){
      mainWindow.webContents.send("onPauseRequest")

    } else if(msg.content.split(" ")[1] === "play"){
      mainWindow.webContents.send("onPlayRequest")

    } else if(msg.content.split(" ")[1] === "back") {
      mainWindow.webContents.send("onTimebackRequest", msg.content.split(" ")[2])

    } else if(msg.content.split(" ")[1] === "go") {
      mainWindow.webContents.send("onTimegoRequest", msg.content.split(" ")[2])

    } else {
      if (msg.content.split(" ")[1].indexOf("youtube.com/playlist") != -1) {
        const url = msg.content.split(" ")[1];
        msg.reply('downloading playlist movies');
        try {
          const playlist = await ytfps(url);
          for (const video of playlist.videos) {
            try {
              const filename = await getVideo(video.url)
              mainWindow.webContents.send("onAddMovie", filename)
            } catch (error) {
              msg.reply(error.toString());
            }

          }

        } catch (error) {
          msg.reply(error.toString());
        }
        
      } else {
        msg.reply('downloading movie');
        console.log(msg.content);
        const maybeUrl = msg.content.split(" ")[1];
        console.log(msg.content.split(" "))
  
        let providerType = undefined;
        if(maybeUrl.indexOf("youtube") >= 0) {
            providerType = "youtube";
        } else if(maybeUrl.indexOf("nicovideo") >= 0) {
            providerType = "nicovideo";
        }
  
        try {
          const filename = await getVideo(maybeUrl)
          mainWindow.webContents.send("onAddMovie", filename)
  
        } catch (error) {
            console.log(error);
            msg.reply(error.toString());
  
        }

      }

    }
    
  }

});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.TOKEN);


async function getVideo(maybeUrl) {
  let filename = undefined;
      
      try {
          const videoid = crypto.createHash('md5').update(maybeUrl).digest('hex');

          await new Promise((resolve, reject) => {

              // ここではmp4で指定し保存しているが, Youtubeのマージ時に異なるフォーマットになる可能性がある
              // -f wrostだとLQのmp4が取得できるみたい
              exec('"./youtube-dl.exe" "'+ maybeUrl +'" -o ./public/movie/'+ videoid +'.mp4 -f worst', function(err, stdout, stderr){
                  if(err){
                      reject(err);
                  }
                  
                  console.log(stdout);

                  filename = videoid + ".mp4";
                  
                  resolve();

              });

          })
      } catch(err) {
        throw new Error("動画保存できなかったエラー" + err.toString())
      }

      return filename
      
}