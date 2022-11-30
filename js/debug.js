let debug = {
    enabled: false,
    log: (...data) => {
        if (!debug.enabled) return;
        console.log(...data);
    },
    warn: (...data) => {
        if (!debug.enabled) return;
        console.warn(...data);
    },
    error: (...data) => {
        if (!debug.enabled) return;
        console.error(...data);
    }
}
