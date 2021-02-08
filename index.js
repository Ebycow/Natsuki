const Discord = require('discord.js');
const client = new Discord.Client();
const crypto = require('crypto');
const fs = require('fs')

const exec = require('child_process').exec;
const uuidv4 = require('uuid').v4;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
    if (msg.mentions.has(client.user)) {
        msg.reply('動画ダウンロード中');
        console.log(msg.content);
        const maybeUrl = msg.content.split(" ")[1];
        console.log(msg.content.split(" "))

        let providerType = undefined;
        if(maybeUrl.indexOf("youtube") >= 0) {
            providerType = "youtube";
        } else if(maybeUrl.indexOf("nicovideo") >= 0) {
            providerType = "nicovideo";
        }

        let filename = undefined;
        
        try {
            const videoid = crypto.createHash('md5').update(maybeUrl).digest('hex');

            await new Promise((resolve, reject) => {

                // ここではmp4で指定し保存しているが, Youtubeのマージ時に異なるフォーマットになる可能性がある
                // -f wrostだとLQのmp4が取得できるみたい
                exec('"./bin/youtube-dl.exe" "'+ maybeUrl +'" -o ./video/'+ videoid +'.mp4 -f worst', function(err, stdout, stderr){
                    if(err){
                        reject(err);
                    }
                    
                    console.log(stdout);

                    // if(providerType == "youtube") {
                    //     for (const line of stdout.split("\n")) {
                    //         if(line.indexOf("Merging formats into") >= 0) {
                    //           filename = line.match(/"video(.*)"/)[1].slice(1)
                          
                    //         }
                          
                    //     }

                    // } else if(providerType == "nicovideo") {
                    //     filename = videoid + ".mp4"

                    // }

                    filename = videoid + ".mp4";

                    resolve();

                });

                // const video = youtubedl(maybeUrl,undefined,
                //     // Additional options can be given for calling `child_process.execFile()`.
                //     { cwd: __dirname })
                
                //     // Will be called when the download starts.
                //     video.on('info', function(info) {
                //     console.log('Download started')
                //     console.log('filename: ' + info._filename)
                //     console.log('size: ' + info.size)
                //     })
                
                // video.pipe(fs.createWriteStream('myvideo.mp4'))

                // setTimeout(() => {resolve();}, 10000)

                

            })

            console.log('"./bin/mpc-be64.exe" "./video/'+ filename + '"')
            exec('"./bin/mpc-be64.exe" "'+ process.cwd() +'/video/'+ filename + '"', function(err, stdout, stderr){
                console.log(stderr)
            });

            msg.reply('3137');

        } catch (error) {
            console.log(error);
            msg.reply('エラー');

        }

    }

});

client.login('');