let debug = {
    enabled: false,
    log: (...args) => {
        if (!debug.enabled) return;
        console.log(`[DEBUG] `, args);
    }
}