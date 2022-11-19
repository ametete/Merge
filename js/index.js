let Studs = 0;
let clicksleft = 10;
let moneygain = 0;
let currentballs = {};

function addBall(num) {
    if (isNaN(Number(num))) return;
    if (isNaN(Number(currentballs[num]))) currentballs[num] = 0;
    
    currentballs[num]++;

    if (currentballs[num] > 1) {
        currentballs[num]--;
        currentballs[num]--;
    
        addBall(num+1);
    } else {
        moneygain=0;
        for (const elem in currentballs) {
            if (Object.hasOwnProperty.call(currentballs, elem)) {
                if (elem!=1&&elem!=0) {
                    moneygain+=2^(elem-1);
                } else {
                    moneygain+=1 ;
                }
            }
        }
    }
    let str = "";
    for (const i in currentballs) {
        if (Object.hasOwnProperty.call(currentballs, i)) {
            const element = currentballs[i];
            if (element > 0) str += i + ", ";
        }
    }
    str = str.substring(0, str.length-2);
    document.querySelector("#CurrentMerges").innerHTML = "Current Merges:\n"+str;
}

setInterval(() => {
    Studs+=moneygain;
    console.warn(moneygain);
    document.querySelector("#Studs").innerHTML = "Studs: "+Studs;
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