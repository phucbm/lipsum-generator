/**
 * Generate unique ID
 */
function uniqueId(prefix = ''){
    return prefix + (+new Date()).toString(16) +
        (Math.random() * 100000000 | 0).toString(16);
}


/**
 * Capitalize all words in string
 * @param string
 * @param force
 * @returns {string}
 */
function capitalize(string, force){
    string = force ? string.toLowerCase() : string;
    return string.replace(/(\b)([a-zA-Z])/g, function(firstLetter){
        return firstLetter.toUpperCase();
    });
}


/**
 * Capitalize the first letter in string
 * @param string
 * @returns {string}
 */
function capitalizeFirstLetter(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}


/**
 * Get array of words from string
 * @param string
 * @returns {string[]}
 */
function parseString(string){
    return string.replace(/[^a-zA-Z ]/g, '').trim().split(' ');
}


/**
 * get a random integer in range [min;max]
 * @param min
 * @param max
 * @returns {number}
 */
function random(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}