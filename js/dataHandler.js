let defaultData = {
    currentBalls: {}, // Current Balls
    Studs: 0, // Current Studs
    clicksleft: 10, // Clicks left
    moneygain: 0, // Money gain

    // TODO: How should upgrades be done?
    //       PageName: {upgrade1,upgrade2,...} or upgrade1,upgrade2,...
    //       Either way the hardest part is functions for each one
    upgrades: { // Upgrades for the game
        unknown1: 0, // ???
        unknown2: 0, // ???
    },

    settings: { // Settings for the game
        MuteBGAudio: false, // If BG Music is muted
        debugEnabled: false, // If debug mode is enableds
        Theme: "dark", // If custom then it will use the css that is in settings
        StyleSource: "", // Custom CSS
    },

    date: new Date().getTime()/1000 // Date in seconds
}

let currentData;

async function getFile() {
    return await new Promise(async (resolve, reject) => {
        let file;
        if (window.showOpenFilePicker) {
            const handle = await window.showOpenFilePicker({
                types: [{
                    description: "Save Data",
                    accept: {"application/json": [".json"]}
                }],
            });

            file = await handle[0].getFile();
        } else {
            // TODO: Find out a better way to reject when canceling prompt
            file = await new Promise((res, rej) => {
                let input = document.createElement("input");

                input.type = "file";
                input.multiple = false;
                input.accept = "application/json";

                input.onchange = () => {
                    let files = Array.from(input.files);
                    res(files[0]);
                }

                onfocus = () => {
                    // 0.5s timeout to stop false positives
                    setTimeout(() => {
                        rej("File Selection Canceled");
                    }, 500);
                }

                input.click();
            });
        }

        if (file == undefined) reject("Failed to get file");

        // Read the file data as UTF-8 and return content
        let reader = new FileReader();
        reader.readAsText(file,"UTF-8");
        reader.onload = res => {
            resolve(res.target.result);
        }
    });
}

async function saveAs(content) {
    if (window.showSaveFilePicker) {
        const handle = await showSaveFilePicker({
            suggestedName: "SaveData.json",
            types: [{
                description: "Save Data",
                accept: {"application/json": [".json"]}
            }]
        });

        const writable = await handle.createWritable();
        await writable.write(content);
        writable.close();
    } else {
        // TODO: Make an "copy" of showSaveFilePicker (aka name change and if possible save location)
        //       mostly cause of how chrome based browsers work
        const save = document.createElement("a");
        
        save.href = URL.createObjectURL(content);
        save.download = "SaveData.json";
        save.click();

        setTimeout(() => URL.revokeObjectURL(save.href), 60000);
    }
}

// Loop function to cut down on code on vaildation
function loop(object, callback) {
    for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
            const element = object[key];
            callback(key, element);
        }
    }
}

let dataHandler = {
    /**
     * 
     * @return {object} The data used by the game 
     */
    checkForData: () => {
        let data = localStorage.getItem("data");

        try {
            if (data) data = JSON.parse(data);
        } catch (error) {
            data = null;
        }

        if (!data) data = defaultData;
        
        return data;
    },
    /**
     * 
     * @param {string?} key 
     */
    getData: (key) => {
        if (!currentData) currentData = dataHandler.validate(dataHandler.checkForData());
        
        if (key) {
            return currentData[key];
        }
        
        return currentData;
    },
    /**
     * 
     * @param {object?} data 
     */
    saveData: (data, showMsg) => {
        if (data) currentData = dataHandler.validate(data);
        else currentData = dataHandler.getData(); // validate happens on get
        
        currentData.date = new Date().getTime()/1000;
        localStorage.setItem("data", JSON.stringify(currentData));
        
        if (showMsg) {
            try {
                document.querySelector("#SavingText").style.opacity = 1; 

                setTimeout (() => {
                    document.querySelector("#SavingText").style.opacity = 0; 
                }, 2500);
            } catch (error) {}
        }
        
        return currentData;
    },
    /**
     * 
     * @param {object?} data 
     */
    validate: (data) => {
        // Is there an better way to do this? probably not /shrug
        
        loop(defaultData, (i, v) => {
            if (data[i]) return;
            data[i] = v;
        });
        
        loop(defaultData.settings, (i, v) => {
            if (data.settings[i]) return;
            data.settings[i] = v;
        });

        loop(defaultData.upgrades, (i, v) => {
            if (data.upgrades[i]) return;
            data.upgrades[i] = v;
        });

        return data;
    },
    wipeData: () => {
        dataHandler.Load(defaultData, true);
    },
    // Import/Export stuff
    Import: async () => {
        try {
            let content = await getFile();

            if (content != null) {
                try {
                    let data = JSON.parse(content);

                    if (data) {
                        let loadData = dataHandler.validate(data);
                        dataHandler.Load(loadData, true);
                    }
                } catch (error) {
                    console.warn(`Invailed JSON Data?\n${error}`);
                }
            }
        } catch (error) {
            console.warn(`Failed to get file\n${error}`);
        }
    },
    Export: async () => {
        let json = JSON.stringify(dataHandler.Save(false), null, "\t");
        await saveAs(new Blob([json], {type: "application/json"}));
    }
}
