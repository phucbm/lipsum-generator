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
const copyValueToClipboard = async (val) => {
    // Try modern Clipboard API first
    if(navigator.clipboard && window.isSecureContext){
        try {
            await navigator.clipboard.writeText(val);
            return;
        } catch(err){
            console.warn('Clipboard API failed, falling back to execCommand', err);
        }
    }

    // Fallback for older browsers or non-secure contexts
    const dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = val;
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
 * Manage object in session|local storage
 */
class MyStorage{
    constructor(key){
        this.key = key;
    }

    set(object){
        localStorage.setItem(this.key, JSON.stringify(object));
    }

    get(){
        return JSON.parse(localStorage.getItem(this.key));
    }

    clear(){
        localStorage.removeItem(this.key);
    }
}