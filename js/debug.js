let debug = {
    enabled: true,
    log: (...args) => {
        if (!debug.enabled) return;
        let str = args.toString();
        console.log(`[DEBUG] ${str}`);
    }
}