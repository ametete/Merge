let settings = {
    BGaudioMuted: false,
}

let Studs = 0;
let clicksleft = 10;
let moneygain = 0;
let currentBalls = {};

let DOMLoaded = false;
let DOMLoadedCallbacks = [];

document.addEventListener("DOMContentLoaded", () => {
    DOMLoaded = true;
    DOMLoadedCallbacks.forEach((func) => {
        if (typeof(func) === "function") func();
    })
})

function toggleMute() {
    let audio = document.getElementById("BGaudio");
    audio.muted = !audio.muted;
 }

function updateCurrentMergesTxt() {
    let str = "";
    for (const i in currentBalls) {
        if (Object.hasOwnProperty.call(currentBalls, i)) {
            const element = currentBalls[i];
            if (element > 0) str += i + ", ";
        }
    }
    str = str.substring(0, str.length-2);
    document.querySelector("#CurrentMerges").innerHTML = "Current Merges:\n"+str;
}

function LoadData() {
    let data = dataHandler.getData();
    currentBalls = data.currentBalls;
    Studs = data.Studs;
    clicksleft = data.clicksleft;
    moneygain = data.moneygain;
    settings = data.settings;
    
    if (!DOMLoaded) DOMLoadedCallbacks.push(updateCurrentMergesTxt);
    else updateCurrentMergesTxt();
}

function SaveData() {
    // document.querySelector("#Saving")

    let data = dataHandler.getData();
    data.currentBalls = currentBalls;
    data.Studs = Studs;
    data.clicksleft = clicksleft;
    data.moneygain = moneygain;
    data.settings = settings;
    dataHandler.saveData(data);
}

LoadData();

setInterval(SaveData, 600000);

function addBall(num) {
    if (isNaN(Number(num))) return;
    if (isNaN(Number(currentBalls[num]))) currentBalls[num] = 0;
    
    currentBalls[num]++;

    if (currentBalls[num] > 1) {
        currentBalls[num]--;
        currentBalls[num]--;
    
        addBall(num+1);
    } else {
        moneygain=0;
        for (const elem in currentBalls) {
            if (Object.hasOwnProperty.call(currentBalls, elem)) {
                if (elem!=1&&elem!=0) {
                    moneygain+=2^(elem-1);
                } else {
                    moneygain+=1 ;
                }
            }
        }
    }
    updateCurrentMergesTxt();
}

setInterval(() => {
    Studs+=moneygain;
    console.warn(moneygain);
    document.querySelector("#Studs").innerHTML = "Studs: " + numberformat.formatShort(Studs, {sigfigs: 2});
}, 1000);

function merge_clicked(){
    clicksleft--
    if (clicksleft==0)
    {
        clicksleft=10;
        document.querySelector("#MergeButton").innerHTML = "Click "+clicksleft+" more times";
        addBall(1);
    }else{
        document.querySelector("#MergeButton").innerHTML = "Click "+clicksleft+" more times";
    };
};

let UpgradeMenuActive = false;

function toggleUpgradeMenu() {
    let menu = document.querySelector("#Upgrades");
    let color = "rgba(255, 255, 255, 0.5)";

    UpgradeMenuActive = !UpgradeMenuActive;

    menu.style["box-shadow"] = UpgradeMenuActive ? "0px 0px 10px 5px " + color : "0px 0px 0px 0px " + color;

    menu.style["height"] = UpgradeMenuActive ? "90%" : "0";
    // menu.style["width"] = UpgradeMenuActive ? "300px" : "0";
};
