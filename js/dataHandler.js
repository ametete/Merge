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
        try {
            document.querySelector("#SavingText").style.opacity = 1; 
            setTimeout (() => {
                document.querySelector("#SavingText").style.opacity = 0; 
            }, 2500);
        } catch (error) {}
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
