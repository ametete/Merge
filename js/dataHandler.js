let defaultData = {
    currentballs: {}, // Current balls in-game
    // Should this be added?
    Studs: 0,
    clicksleft: 10,
    moneygain: 0,
    // idk
    date: new Date().getTime()/1000 // Date in seconds
} // default data
let currentData;

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
    saveData: (data) => {
        if (data) currentData = dataHandler.validate(data);
        else currentData = dataHandler.getData(); // validate happens on get
        currentData.date = new Date().getTime()/1000
        localStorage.setItem("data", JSON.stringify(currentData));
        document.querySelector("#SavingText").style.opacity = 1; 
        setTimeout (() => {
            document.querySelector("#SavingText").style.opacity = 0; 
        }, 2500);
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
    }
}
