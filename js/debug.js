let debug = {
    enabled: false,
    log: (...data) => {
        if (!debug.enabled) return;
        console.log(...data);
    },
    error: (...data) => {
        if (!debug.enabled) return;
        console.error(...data);
    }
}
