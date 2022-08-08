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
    binTextArea, decTextArea, lengthInput;

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

const convert = e => {
    let data = [];
    type = e?.target.dataset.areatype;
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
    userDefinedDelimiter = document.getElementById("userDefinedDelimiter");
    delimiterSelector = document.getElementById("delimiterSelector");
    binPrefixCheckbox = document.getElementById("binPrefixCheckbox");
    hexPrefixCheckbox = document.getElementById("hexPrefixCheckbox");
    asciiTextArea = document.getElementById("asciiTextArea");
    hexTextArea = document.getElementById("hexTextArea");
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
    base64TextArea.addEventListener("input", convert);
    binTextArea.addEventListener("input", convert);
    decTextArea.addEventListener("input", convert);
};

window.addEventListener('DOMContentLoaded', (event) => {
    loadPageData();
});
