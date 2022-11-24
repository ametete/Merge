let defaultData = {
    currentBalls: {}, // Current Balls
    Studs: 0, // Current Studs
    clicksleft: 10, // Clicks left
    moneygain: 0, // Money gain

    settings: { // Settings for the game
        BGaudioMuted: false, // If BG Music is muted
    },

    date: new Date().getTime()/1000 // Date in seconds
} // default data
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

                onfocus = () => {
                    let found = (input.value.length)
                    if (!found) rej("File Selection Canceled");
                }

                input.onchange = () => {
                    res(Array.from(input.files)[0]);
                }

                input.click();
            });
        }

        if (!file) reject("Failed to get file");

        console.log(file);

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
      const save = document.createElement("a");
      save.href = URL.createObjectURL(content);
      save.download = "SaveData.json";
      save.click();
      setTimeout(() => URL.revokeObjectURL(save.href), 60000);
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
        currentData.date = new Date().getTime()/1000
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
        for (const elem in defaultData) {
            if (Object.hasOwnProperty.call(defaultData, elem)) {
                if (data[elem]) continue;
                data[elem] = defaultData[elem];
            }
        }
        return data;
    },
    import: async () => {
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
    export: async () => {
        let json = JSON.stringify(dataHandler.Save(false), null, "\t");
        await saveAs(new Blob([json], {type: "text/json"}));
    }
}
