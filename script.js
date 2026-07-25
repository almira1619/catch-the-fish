// =============================
// Catch the Fish
// Part 1
// =============================

const menu = document.getElementById("menu");
const game = document.getElementById("game");

const playBtn = document.getElementById("playBtn");
const againBtn = document.getElementById("againBtn");

const instruction = document.getElementById("instruction");
const points = document.getElementById("points");

const net = document.getElementById("net");

const winScreen = document.getElementById("winScreen");

const ding = new Audio("assets/sounds/ding.mp4");
const wrong = new Audio("assets/sounds/wrong.mp4");
const win = new Audio("assets/sounds/win.mp3");

const fishes = document.querySelectorAll(".fish");

const colours = [
"green",
"red",
"blue",
"yellow",
"orange"
];

let score = 0;

let currentColour = "";

let fishData = [];

function speak(text){

const speech = new SpeechSynthesisUtterance(text);

speech.lang = "en-US";

speech.rate = 0.85;

speech.pitch = 1;

speech.volume = 1;

speechSynthesis.cancel();

speechSynthesis.speak(speech);

}

function randomColour(){

    const alive = fishData.filter(f => f.el.style.display !== "none");

    const aliveColours = alive.map(f =>
        [...f.el.classList].find(c => colours.includes(c))
    );

    currentColour =
        aliveColours[Math.floor(Math.random() * aliveColours.length)];

    instruction.innerHTML =
        "Catch the <b>" +
        currentColour.toUpperCase() +
        "</b> fish!";

    speak("Catch the " + currentColour + " fish");
}

playBtn.addEventListener("click",()=>{

menu.style.display="none";

game.style.display="block";

score=0;

points.textContent=0;

randomColour();

});

// =============================
// Part 2
// =============================

// Подготовка рыбок

fishes.forEach(fish=>{

fishData.push({

el:fish,

x:fish.offsetLeft,

y:fish.offsetTop,

dx:(Math.random()*1.2+0.8)*(Math.random()>0.5?1:-1),

dy:(Math.random()*0.8-0.4)

});

});

// Движение сачка мышью

document.addEventListener("mousemove",(e)=>{

net.style.left=e.clientX+"px";

net.style.top=e.clientY+"px";

});

// Движение сачка пальцем

document.addEventListener("touchmove",(e)=>{

const touch=e.touches[0];

net.style.left=touch.clientX+"px";

net.style.top=touch.clientY+"px";

},{passive:true});

// Движение рыбок

function moveFish(){

fishData.forEach(f=>{

f.x+=f.dx;

f.y+=f.dy;

if(f.x<0 || f.x>window.innerWidth-110){

f.dx*=-1;

if(f.dx>0){

f.el.style.transform="scaleX(1)";

}else{

f.el.style.transform="scaleX(-1)";

}

}

if(f.y<70 || f.y>window.innerHeight-110){

f.dy*=-1;

}

f.el.style.left=f.x+"px";

f.el.style.top=f.y+"px";

});

requestAnimationFrame(moveFish);

}

// Запускаем плавание

playBtn.addEventListener("click",()=>{

fishData.forEach(f=>{

f.x=f.el.offsetLeft;

f.y=f.el.offsetTop;

});

moveFish();

});

// =============================
// Part 3
// =============================

// Проверка столкновения

function checkCatch(){

    const netRect = net.getBoundingClientRect();

    for (let f of fishData){

        if(
    f.el.style.display==="none" ||
    f.el.dataset.caught==="1"
) continue;

        const fishRect = f.el.getBoundingClientRect();

        const hit =

        netRect.left < fishRect.right &&
        netRect.right > fishRect.left &&
        netRect.top < fishRect.bottom &&
        netRect.bottom > fishRect.top;

        if(!hit) continue;

        const fishColour =
        [...f.el.classList].find(c=>colours.includes(c));

        if(fishColour === currentColour){

            ding.currentTime = 0;
            ding.play();
            f.el.style.pointerEvents = "none";
            f.el.dataset.caught = "1";
            f.el.style.transition="transform .3s, opacity .3s";

            f.el.style.transform += " scale(.2)";
            f.el.style.opacity="0";

            setTimeout(()=>{

                f.el.style.display="none";

                score++;

                points.textContent=score;

                if(score >= fishData.length){

                    win.currentTime=0;
                    win.play();

                    winScreen.style.display="flex";

                    return;

                }

                randomColour();

            },300);

        }else{

            wrong.currentTime=0;
            wrong.play();

        }

        break;

    }

}

document.addEventListener("click", () => {

    checkCatch();

});

document.addEventListener("touchstart", () => {

    checkCatch();

});

againBtn.addEventListener("click",()=>{

winScreen.style.display="none";

fishData.forEach(f=>{

f.el.style.display="block";

f.el.style.opacity="1";

f.el.style.transform="";
f.el.style.pointerEvents = "auto";
delete f.el.dataset.caught;

});

document.addEventListener("click", () => {

    checkCatch();

});

document.addEventListener("touchstart", () => {

    checkCatch();

});
menu.style.display="flex";

game.style.display="none";

});
