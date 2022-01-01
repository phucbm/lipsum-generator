/**
 * Generate unique ID
 */
function uniqueId(prefix = ''){
    return prefix + (+new Date()).toString(16) +
        (Math.random() * 100000000 | 0).toString(16);
}


/**
 * Copy text to clipboard from given value
 * @param val
 */
const copyValueToClipboard = (val) => {
    const dummy = document.createElement("textarea");
    document.body.appendChild(dummy);

    dummy.setAttribute("id", "dummy_id");
    document.getElementById("dummy_id").value = val;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}


/**
 * String to slug
 * https://stackoverflow.com/a/1054862/10636614
 * @param string
 * @returns {string}
 */
function stringToSlug(string = ''){
    return string
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
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