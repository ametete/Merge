let defaultData = {} // JSON
let currentData;

let dataHandler = {
    /**
     * 
     * @param {string?} key 
     */
    getData: (key) => {
        if (!currentData) currentData = this.validate(localStorage.getItem("data"));
        if (key) {
            return currentData[key];
        }
        return currentData;
    },
    saveData: (data) => {
        if (!currentData) currentData = this.validate(localStorage.getItem("data"));
        localStorage.setItem("data", JSON.stringify(this.validate(currentData)));
    },
    validate: (data) => {
        
    }
}
