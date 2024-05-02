//config
var imgArr = [
    {
        imgurl: "assets/e1.png",
        score: 100
    }, 
    {
        imgurl: "assets/e2.png",
        score: 100
    }, 
    {
        imgurl: "assets/p1.png",
        score: 50
    }, 
    {
        imgurl: "assets/p2.png",
        score: 50
    },
    {
        imgurl: "assets/p3.png",
        score: 50
    },
    {
        imgurl: "assets/p4.png",
        score: 50
    }
];
var score = 0; //player score
var imgwatfall = 0; //time interval for img waterfall
var timeiv = 0;
var gamePlayTime = 60; //game play time
var timeLeft = gamePlayTime;


//check two item hit with xy coords
function checkHit(x, y, x2, y2, width, height) {
    if (x >= x2 && x <= x2 + width && y >= y2 && y <= y2 + height) {
        return true;
    }
    return false;
}

//function random pick img
function randomImg() {
    var img = Math.floor(Math.random() * 6);
    return img;
}

// start img waterfall
function startGame() {
    imgwatfall = setInterval(dropImg, 3000);
    timeiv = setInterval(function(){
        timeLeft--;
        document.getElementById("timeleft").innerHTML = timeLeft;
    },1000);
    setTimeout(function() {
        endGame();
    },gamePlayTime * 1000);
    console.log("startgame");
}

//endgame clear all img and clear time interval
function endGame(){
    saveData();
    clearInterval(imgwatfall);
    clearInterval(timeiv);
    var imgs = document.getElementsByTagName("img");
    for (var i = 0; i < imgs.length; i++) {
        imgs[i].remove();
    }
console.log("endgame");
}

// function to check if img hit the player
function checkImgHit(img) {
    var player = document.getElementById("player");
    if (checkHit(img.offsetLeft, img.offsetTop, player.offsetLeft, player.offsetTop, 100, 100) && !img.markHit) {
        img.style.top = "100vh";
        img.markHit = true;
        score += img.hitscore;
        document.getElementById("score").innerHTML = score;
        return true;
    } else {
        return false;
    }
}

//drop img from window top
function dropImg() {
    var img = document.createElement("img");
    let imgIntvl = 0;
    img.src = imgArr[randomImg()].imgurl;
    img.hitscore = imgArr[randomImg()].score;
    img.style.position = "absolute";
    img.style.top = "-100px";
    img.style.left = Math.floor(Math.random() * (window.innerWidth - 100)) + "px";
    img.style.width = "100px";
    img.style.height = "100px";
    img.style.zIndex = "1";
    img.style.transition = "all 15s";
    img.style.transform = "rotate(" + Math.floor(Math.random() * 360) + "deg)";
    img.markHit = false;

    document.body.appendChild(img);

    // img event listener to check if img move to the bottom
    img.addEventListener("transitionend", function () {
        img.remove();
        clearInterval(imgIntvl);
    });

    // keep check img hit player 
    imgIntvl = setInterval(function () {
        if(checkImgHit(img)) {
            clearInterval(imgIntvl);
            img.remove(); 
        }
    },10);   

    setTimeout(function () {
        img.style.top = "100vh";
    }, 2000);
}

//keyin event listener
document.addEventListener("keydown", function (event) {
    var player = document.getElementById("player");
    if (event.key == "ArrowLeft") {
        player.style.left = player.offsetLeft - 10 + "px";
    }
    if (event.key == "ArrowRight") {
        player.style.left = player.offsetLeft + 10 + "px";
    }
});

//generate uuid
function genUUID(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

//save data to local storage
function saveData() {
    window.localStorage.setItem("score", score);
    fetch('http://localhost:3000/addScore', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
                id: genUUID(),
                name: "Player "+Math.floor(Math.random() *5000),
                scoreMark: score
        })
    });
}