// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

$("#message").text("Welcome to Discord Theater")
$("#message").fadeIn("slow", () => {
    $("#message").delay(5000).fadeOut("slow");
})

const video = document.getElementById("video")

const videoCue = []

window.api.onAddMovie((event, url) => {
    if(video.paused) {
        video.src = "http://localhost:3138/movie/" + url

    } else {
        videoCue.push(url)
        
        $("#message").text("動画をキューに追加しました　キュー:" + videoCue.length + "件")
        $("#message").fadeIn("slow", () => {
            $("#message").delay(5000).fadeOut("slow");
        })


    }

})

window.api.onSkipRequest((event) => {
    if(videoCue.length) {
        video.src = "http://localhost:3138/movie/" + videoCue[0]
        videoCue.shift()
        $("#message").text("動画をスキップしました　キュー:" + videoCue.length + "件")
        $("#message").fadeIn("slow", () => {
            $("#message").delay(5000).fadeOut("slow");
        })

    } else {
        $("#message").text("動画キューはありません")
        $("#message").fadeIn("slow", () => {
            $("#message").delay(5000).fadeOut("slow");
        })
    }

})

window.api.onPlayRequest((event) => {
    video.play()
})

window.api.onPauseRequest((event) => {
    video.pause()
})

window.api.onTimebackRequest((event, time) => {
    video.currentTime -= time
})

window.api.onTimebackRequest((event, time) => {
    video.currentTime -= time
})

window.api.onTimegoRequest((event, time) => {
    video.currentTime += time
})

video.onended = (event) => {
    if(videoCue.length) {
        video.src = "http://localhost:3138/movie/" + videoCue[0]
        videoCue.shift()

        $("#message").text("次の動画を再生中　キュー:" + videoCue.length + "件")
        $("#message").fadeIn("slow", () => {
            $("#message").delay(5000).fadeOut("slow");
        })

    } else {

        $("#message").text("次に再生する動画がありません、追加しよう！")
        $("#message").fadeIn("slow", () => {
            $("#message").delay(5000).fadeOut("slow");
        })

    }

}

$("#message").hide();

