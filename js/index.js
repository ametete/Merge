let settings = {
    MuteBGAudio: false,
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
        try {
            if (typeof(func) === "function") func();
        } catch (error) { console.error(error); } 
    })
})

function updateSettingButton(key, val) {
    let btn;

    try {
        btn = document.querySelector(`button[data-setting="${key}"] a`);
        if (!btn) return console.warn(`Failed to get setting button ${key}`);
        btn.innerHTML = val;
    } catch (error) { console.error(error); }

    if (btn) return document.querySelector(`button[data-setting="${key}"]`);
    return null;
}

function settingsChanged() {
    try {
        setTimeout(() => {
            let audio = document.getElementById("BGaudio");
            audio.muted = settings.MuteBGAudio;
        }, 0);
    } catch (error) { console.warn("Failed to get BGaudio (Not loaded?)"); }

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
        updateSettingButton(key, val);
        settings[key] = val;
        postMessage({channel: "settingsChanged"});
    } else {
        console.error(`[SETTING ERROR] key or val null/undefined\n${key}: ${val}`);
    }
}

function updateCurrentMergesTxt() {
    let str = "";

    for (const i in currentBalls) {
        if (Object.hasOwnProperty.call(currentBalls, i)) {
            const element = currentBalls[i];
            if (element > 0) str += `${i}, `;
        }
    }

    str = str.substring(0, str.length-2);
    document.querySelector("#CurrentMerges").innerHTML = `Current Merges:\n${str}`;
}

let LoadData = (data, forceSave) => {
    if (!data) data = dataHandler.getData();

    currentBalls = data.currentBalls;
    Studs = data.Studs;
    clicksleft = data.clicksleft;
    moneygain = data.moneygain;
    settings = data.settings;
    
    if (forceSave) SaveData(false);

    let setupSettings = () => {
        for (const key in settings) {
            if (Object.hasOwnProperty.call(settings, key)) {
                const val = settings[key];
                let btn = updateSettingButton(key, val)
                if (btn) btn.onclick = () => {
                    changeSetting(key, !settings[key])
                }
            }
        }
    }

    if (!DOMLoaded) {
        DOMLoadedCallbacks.push(setupSettings, updateCurrentMergesTxt, postMessage({channel: "settingsChanged"}));
    } else {
        setupSettings();
        updateCurrentMergesTxt();
        postMessage({channel: "settingsChanged"});
    }
    
    return data;
}

let SaveData = (saveMsg) => {
    let data = dataHandler.getData();

    data.currentBalls = currentBalls;
    data.Studs = Studs;
    data.clicksleft = clicksleft;
    data.moneygain = moneygain;
    data.settings = settings;

    return dataHandler.saveData(data, saveMsg);
}

dataHandler.Load = LoadData;
dataHandler.Save = SaveData;

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
                    moneygain+=1;
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
    document.querySelector("#Studs").innerHTML = `Studs: ${format}`;
}, 1000);

function merge_clicked() {
    clicksleft--;

    if (clicksleft==0) {
        clicksleft = 10;
        addBall(1);
    }
    
    document.querySelector("#MergeButton").innerHTML = `Click ${clicksleft} more times`;
}

let UpgradeMenuActive = false;
let SettingsActive = false;

function toggleSettings() {
    if (UpgradeMenuActive) toggleUpgradeMenu();
    let menu = document.querySelector("#Settings");

    SettingsActive = !SettingsActive;

    menu.style["box-shadow"] = SettingsActive ? null : "none";
    menu.style["height"] = SettingsActive ? null : "0";
}

function toggleUpgradeMenu() {
    if (SettingsActive) toggleSettings();
    let menu = document.querySelector("#Upgrades");

    UpgradeMenuActive = !UpgradeMenuActive;

    menu.style["box-shadow"] = UpgradeMenuActive ? null : "none";
    menu.style["height"] = UpgradeMenuActive ? null : "0";
}
