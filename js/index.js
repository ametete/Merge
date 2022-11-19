let settings = {
    BGaudioMuted: false,
    debugEnabled: false
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

function settingsChanged() {
    let audio = document.getElementById("BGaudio");

    audio.muted = settings.BGaudioMuted;
    debug.enabled = settings.debugEnabled;
}

window.addEventListener("message", event => {
    let data = event.data;
    if (data.channel === "settingsChanged") {
        settingsChanged();
    }
})

function changeSetting(key, val) {
    if (key !== null && val !== null) {
        settings[key] = val;
        postMessage({channel: "settingsChanged"});
    } else {
        console.error(`[SETTING ERROR] key or val null/undefined\n${key}: ${val}`);
    }
}

function toggleMute() {
    changeSetting("BGaudioMuted", !settings.BGaudioMuted);
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
    
    if (!DOMLoaded) DOMLoadedCallbacks.push(updateCurrentMergesTxt, postMessage({channel: "settingsChanged"}));
    else {
        updateCurrentMergesTxt();
        postMessage({channel: "settingsChanged"});
    }
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
    debug.log(moneygain);

    // This is going to be an example of why I switched to this
    // when you used sigfigs: 2 with something below 100k you can't get 1k or 10k etc and just get
    // 1,000 and 10,000
    // lets say the number is 12,952 it will display 13,000 same for 1k
    // 1,952 will display as 2,000
    let format = Studs > 100000 ? numberformat.formatShort(Studs, {sigfigs: 2}) : 
                numberformat.formatShort(Studs, {sigfigs: 5})
    // debug.log(Studs, numberformat.formatShort(Studs, {sigfigs: 2}));
    document.querySelector("#Studs").innerHTML = "Studs: " + format;
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
let SettingsActive = false;

function toggleSettings() {
    // let menu = document.querySelector("#Settings");

    SettingsActive = !SettingsActive;

}

function toggleUpgradeMenu() {
    let menu = document.querySelector("#Upgrades");
    let color = "rgba(255, 255, 255, 0.5)";

    UpgradeMenuActive = !UpgradeMenuActive;

    menu.style["box-shadow"] = UpgradeMenuActive ? "0px 0px 10px 5px " + color : "0px 0px 0px 0px " + color;

    menu.style["height"] = UpgradeMenuActive ? "90%" : "0";
    // menu.style["width"] = UpgradeMenuActive ? "300px" : "0";
};
