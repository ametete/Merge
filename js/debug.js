let debug = {
    enabled: true,
    log: (...args) => {
        if (!debug.enabled) return;
        console.log(`[DEBUG] `, args);
    }
}