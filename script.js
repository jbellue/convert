const Types = {
    ASCII: "ascii",
    hex: "hex",
    binary: "binary",
    decimal: "decimal",
    b64: "b64"
}

// define the elements to use them later
let userDefinedDelimiter, delimiterSelector, binPrefixCheckbox,
    hexPrefixCheckbox, asciiTextArea, hexTextArea, base64TextArea,
    binTextArea, decTextArea, lengthInput, asciiValueForHex;

const updateData = (input, src) => {
    if (!input) {
        return;
    }
    let ascii=hex=dec=bin='';
    const delimiter = userDefinedDelimiter.value;
    let hexprefix = "";
    let binprefix = "";
    if (binPrefixCheckbox.checked) {
        binprefix = "0b";
    }
    if (hexPrefixCheckbox.checked) {
        hexprefix = "0x";
    }

    for(let i = 0; i < input.length; ++i) {
        let hexByte = input[i].toString(16);
        let decimalByte = input[i].toString(10);
        let binaryByte = input[i].toString(2);

        // add padding to hex and binary
        if (hexByte.length == 1){
            hexByte = '0' + hexByte;
        }
        if (binaryByte.length < 8){
            binaryByte = '0'.repeat(8 - binaryByte.length) + binaryByte;
        }

        if (decimalByte < 256){
            ascii += String.fromCharCode(input[i]);
        }

        hex += hexprefix + hexByte.toUpperCase();
        dec += decimalByte;
        bin += binprefix + binaryByte;
        if (i < input.length - 1) {
            hex += delimiter;
            dec += delimiter;
            bin += delimiter;
        }
    }

    if(src != Types.ASCII) {
        asciiTextArea.value = ascii;
    }
    if(src != Types.hex) {
        hexTextArea.value = hex;
    }
    if(src != Types.binary) {
        binTextArea.value = bin;
    }
    if(src != Types.decimal) {
        decTextArea.value = dec;
    }
    if(src != Types.b64) {
        base64TextArea.value = window.btoa(ascii);
    }

    const img = document.querySelector('#pngImage');
    img.src = window.URL.createObjectURL(
        new Blob([new Uint8Array(input)],
                 { type: 'application/octet-stream' })
    );

    lengthInput.value = input.length;
};

const clearFields = () => {
    asciiTextArea.value = "";
    hexTextArea.value = "";
    base64TextArea.value = "";
    binTextArea.value = "";
    decTextArea.value = "";
    lengthInput.value = 0;
}

const showASCIIrepresentation = e => {
    const borderChars = [' ', '\n', '\r', '\t']
    const text = hexTextArea.value;
    let start = hexTextArea.selectionStart;
    let end = hexTextArea.selectionEnd;
    while (start > 0) {
        if (borderChars.indexOf(text[start]) == -1) {
            --start;
        } else {
            break;
        }                        
    }

    while (end < text.length) {
        if (borderChars.indexOf(text[end]) == -1) {
            ++end;
        } else {
            break;
        }
    }
    let nibble = text.substr(start, end - start).trim();
    if (!hexPrefixCheckbox.checked) {
        nibble = `0x${nibble}`;
    }
    const ascii = String.fromCharCode(parseInt(nibble, 16));
    const stringDesctiption = `${nibble}: ${ascii} (${asciiDescription[nibble]})`;
    asciiValueForHex.textContent = stringDesctiption;
    console.log(stringDesctiption);
};

const convert = e => {
    let data = [];
    const type = e?.target.dataset.areatype;
    switch (type) {
        case Types.hex:
            data = convertHex();
            break;
        case Types.binary:
            data = convertBinary();
            break;
        case Types.decimal:
            data = convertDecimal();
            break;
        case Types.b64:
            data = convertBase64();
            break;
        default:
            data = convertASCII();
            break;
    }
    updateData(data, type);
}

const convertASCII = () => {
    let output = [];
    const ascii = asciiTextArea.value;

    if (ascii.length == 0) {
        clearFields();
        return;
    }

    for (let i = 0; i < ascii.length; i++) {
        output[i] = ascii.charCodeAt(i);
    }
    return output;
};

const convertHex = () =>{
    let output = [];
    let hex = hexTextArea.value;

    if (hex.length == 0) {
        clearFields();
        return;
    }

    hex = hex.replace(/0x/gim,"");
    hex = hex.toUpperCase();
    hex = hex.match(/[0-9A-Fa-f]{1,2}/g);

    if (!hex) {
        clearFields();
        return;
    }

    for (let i = 0; i < hex.length; i++) {
        output[i] = parseInt(hex[i], 16);
    }
    return output;
};

const convertBinary = () => {
    let output = [];
    let bin = binTextArea.value;
    if (bin.length == 0) {
        clearFields();
        return;
    }
    bin = bin.replace(/0b/gim,"");
    bin = bin.match(/[0-1]{1,8}/g);

    if (!bin) {
        clearFields();
        return;
    }
    for ( i = 0; i < bin.length; i++) {
        output[i] = parseInt(bin[i], 2);
    }
    return output;
};

const convertDecimal = () => {
    let output = [];
    let dec = decTextArea.value;
    if (dec.length == 0) {
        clearFields();
        return;
    }
    dec = dec.match(/[0-9]{1,3}/g);
    if (!dec) {
        clearFields();
        return;
    }
    for ( i = 0; i < dec.length; i++) {
        output[i] = parseInt(dec[i], 10);
    }
    return output;
};

const convertBase64 = () => {
    let x = [];
    const base64 = base64TextArea.value;
    if (base64.length == 0) {
        clearFields();
        return;
    }
    const ascii = window.atob(base64);
    asciiTextArea.value = ascii;
    for ( i = 0; i < ascii.length; i++) {
        x[i] = ascii.charCodeAt(i);
    }
    return x;
};

const loadPageData = () => {
    const onDelimiterSelectionChange = e => {
        if (e.target.selectedIndex == 3) { //user defined
            userDefinedDelimiter.focus();
            userDefinedDelimiter.readOnly = false;
        }
        else {
            userDefinedDelimiter.readOnly = true;
        }
        userDefinedDelimiter.value = e.target.options[e.target.selectedIndex].value;
        convert();
    };
    
    const onDelimiterInput = (e) => {
        delimiterSelector.selectedIndex = 3;
        convert();
    };

    userDefinedDelimiter = document.getElementById("userDefinedDelimiter");
    delimiterSelector = document.getElementById("delimiterSelector");
    binPrefixCheckbox = document.getElementById("binPrefixCheckbox");
    hexPrefixCheckbox = document.getElementById("hexPrefixCheckbox");
    asciiTextArea = document.getElementById("asciiTextArea");
    hexTextArea = document.getElementById("hexTextArea");
    asciiValueForHex = document.getElementById("asciiValueForHex");
    base64TextArea = document.getElementById("base64TextArea");
    binTextArea = document.getElementById("binTextArea");
    decTextArea = document.getElementById("decTextArea");
    lengthInput = document.getElementById("lengthInput");

    delimiterSelector.addEventListener("change", onDelimiterSelectionChange);
    userDefinedDelimiter.addEventListener("input", onDelimiterInput);
    
    hexPrefixCheckbox.addEventListener("change", convert);
    binPrefixCheckbox.addEventListener("change", convert);

    asciiTextArea.addEventListener("input", convert);
    hexTextArea.addEventListener("input", convert);
    hexTextArea.addEventListener("click", showASCIIrepresentation);
    base64TextArea.addEventListener("input", convert);
    binTextArea.addEventListener("input", convert);
    decTextArea.addEventListener("input", convert);
};

window.addEventListener('DOMContentLoaded', (event) => {
    loadPageData();
});

const asciiDescription = {
    "0x00": "Null",
    "0x01": "Start of Header",
    "0x02": "Start of Text",
    "0x03": "End of Text",
    "0x04": "End of Transmission",
    "0x05": "Enquiry",
    "0x06": "Acknowledge",
    "0x07": "Bell",
    "0x08": "Backspace",
    "0x09": "Horizontal Tab",
    "0x0A": "Newline / Line Feed",
    "0x0B": "Vertical Tab",
    "0x0C": "Form Feed",
    "0x0D": "Carriage Return",
    "0x0E": "Shift Out",
    "0x0F": "Shift In",
    "0x10": "Data Link Escape",
    "0x11": "Device Control 1",
    "0x12": "Device Control 2",
    "0x13": "Device Control 3",
    "0x14": "Device Control 4",
    "0x15": "Negative Acknowledge",
    "0x16": "Synchronize",
    "0x17": "End of Transmission Block",
    "0x18": "Cancel",
    "0x19": "End of Medium",
    "0x1A": "Substitute",
    "0x1B": "Escape",
    "0x1C": "File Separator",
    "0x1D": "Group Separator",
    "0x1E": "Record Separator",
    "0x1F": "Unit Separator",
    "0x20": "Space",
    "0x21": "Exclamation mark",
    "0x22": "Double quote",
    "0x23": "Hash",
    "0x24": "Dollar",
    "0x25": "Percent",
    "0x26": "Ampersand",
    "0x27": "Single quote",
    "0x28": "Left parenthesis",
    "0x29": "Right parenthesis",
    "0x2A": "Asterisk",
    "0x2B": "Plus",
    "0x2C": "Comma",
    "0x2D": "Minus",
    "0x2E": "Period",
    "0x2F": "Slash",
    "0x30": "Zero",
    "0x31": "One",
    "0x32": "Two",
    "0x33": "Three",
    "0x34": "Four",
    "0x35": "Five",
    "0x36": "Six",
    "0x37": "Seven",
    "0x38": "Eight",
    "0x39": "Nine",
    "0x3A": "Colon",
    "0x3B": "Semicolon",
    "0x3C": "Less than",
    "0x3D": "Equal sign",
    "0x3E": "Greater than",
    "0x3F": "Question mark",
    "0x40": "At sign",
    "0x41": "Uppercase A",
    "0x42": "Uppercase B",
    "0x43": "Uppercase C",
    "0x44": "Uppercase D",
    "0x45": "Uppercase E",
    "0x46": "Uppercase F",
    "0x47": "Uppercase G",
    "0x48": "Uppercase H",
    "0x49": "Uppercase I",
    "0x4A": "Uppercase J",
    "0x4B": "Uppercase K",
    "0x4C": "Uppercase L",
    "0x4D": "Uppercase M",
    "0x4E": "Uppercase N",
    "0x4F": "Uppercase O",
    "0x50": "Uppercase P",
    "0x51": "Uppercase Q",
    "0x52": "Uppercase R",
    "0x53": "Uppercase S",
    "0x54": "Uppercase T",
    "0x55": "Uppercase U",
    "0x56": "Uppercase V",
    "0x57": "Uppercase W",
    "0x58": "Uppercase X",
    "0x59": "Uppercase Y",
    "0x5A": "Uppercase Z",
    "0x5B": "Left square bracket",
    "0x5C": "backslash",
    "0x5D": "Right square bracket",
    "0x5E": "Caret / circumflex",
    "0x5F": "Underscore",
    "0x60": "Grave / accent",
    "0x61": "Lowercase a",
    "0x62": "Lowercase b",
    "0x63": "Lowercase c",
    "0x64": "Lowercase d",
    "0x65": "Lowercase e",
    "0x66": "Lowercase f",
    "0x67": "Lowercase g",
    "0x68": "Lowercase h",
    "0x69": "Lowercase i",
    "0x6A": "Lowercase j",
    "0x6B": "Lowercase k",
    "0x6C": "Lowercase l",
    "0x6D": "Lowercase m",
    "0x6E": "Lowercase n",
    "0x6F": "Lowercase o",
    "0x70": "Lowercase p",
    "0x71": "Lowercase q",
    "0x72": "Lowercase r",
    "0x73": "Lowercase s",
    "0x74": "Lowercase t",
    "0x75": "Lowercase u",
    "0x76": "Lowercase v",
    "0x77": "Lowercase w",
    "0x78": "Lowercase x",
    "0x79": "Lowercase y",
    "0x7A": "Lowercase z",
    "0x7B": "Left curly bracket",
    "0x7C": "Vertical bar",
    "0x7D": "Right curly bracket",
    "0x7E": "Tilde",
    "0x7F": "Delete"
}