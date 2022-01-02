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