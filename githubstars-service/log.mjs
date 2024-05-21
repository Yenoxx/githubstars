// log module.
// Contains utility functions for logging


// Returns system time string in familiar format
function getTime() {
    return new Date().toLocaleTimeString('ru-ru');
}


// console.log with timestamp
function log(string) {
    console.log(`[${getTime()}] ${string}`);
}


// console.err with timestamp
function err(string) {
    console.error(`[${getTime()}] ${string}`);
}


export {
    log, err,
}