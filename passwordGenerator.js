const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
const numberChars = '0123456789';
const simpleSymbols = '!#$%&()*+,-./:;<=>?@[]^_{|}~';
const problematicSymbols = ' \'"\\`';

// Generate non-ASCII characters from code points
const generateNonAsciiChars = () => {
    let nonAsciiChars = '';
    
    // Common displayable Unicode ranges
    const displayableRanges = [
        // Latin-1 Supplement (excluding control characters)
        [0x00A1, 0x00FF],
        // Latin Extended-A
        [0x0100, 0x017F],
        // Latin Extended-B (selected)
        [0x0180, 0x01FF],
        // Currency Symbols
        [0x20A0, 0x20CF],
        // Letterlike Symbols
        [0x2100, 0x214F],
        // Arrows
        [0x2190, 0x21FF],
        // Mathematical Operators
        [0x2200, 0x22FF],
        // Box Drawing
        [0x2500, 0x257F],
        // Geometric Shapes
        [0x25A0, 0x25E6]
    ];
    
    // Add characters from each range
    for (const [start, end] of displayableRanges) {
        for (let i = start; i <= end; i++) {
            try {
                const char = String.fromCodePoint(i);
                nonAsciiChars += char;
            } catch (e) {
                // Skip invalid code points
                console.log(`Skipping invalid code point: ${i}`);
            }
        }
    }
    
    return nonAsciiChars;
};

const nonAsciiChars = generateNonAsciiChars();

// DOM elements
let passwordDisplay, lengthSlider, lengthValue, 
    uppercaseCheck, lowercaseCheck, numbersCheck, 
    simpleSymbolsCheck, problematicSymbolsCheck,
    nonAsciiCharsCheck, generateBtn, copyBtn;

// Generate a random password based on selected options
const generatePassword = () => {
    // Get current settings
    const length = parseInt(lengthSlider.value);
    const useUppercase = uppercaseCheck.checked;
    const useLowercase = lowercaseCheck.checked;
    const useNumbers = numbersCheck.checked;
    const useSimpleSymbols = simpleSymbolsCheck.checked;
    const useProblematicSymbols = problematicSymbolsCheck.checked;
    const useNonAsciiChars = nonAsciiCharsCheck.checked;
    
    // Validate that at least one character type is selected
    if (!useUppercase && !useLowercase && !useNumbers && 
        !useSimpleSymbols && !useProblematicSymbols && !useNonAsciiChars) {
        passwordDisplay.textContent = "Please select at least one character type";
        return;
    }
    
    // Build character pool based on selected options
    let charPool = '';
    if (useUppercase) charPool += uppercaseChars;
    if (useLowercase) charPool += lowercaseChars;
    if (useNumbers) charPool += numberChars;
    if (useSimpleSymbols) charPool += simpleSymbols;
    if (useProblematicSymbols) charPool += problematicSymbols;
    if (useNonAsciiChars) charPool += nonAsciiChars;
    
    // Generate the password
    let password = '';
    
    // Ensure at least one character from each selected type is included
    if (useUppercase) password += getRandomChar(uppercaseChars);
    if (useLowercase) password += getRandomChar(lowercaseChars);
    if (useNumbers) password += getRandomChar(numberChars);
    if (useSimpleSymbols) password += getRandomChar(simpleSymbols);
    if (useProblematicSymbols) password += getRandomChar(problematicSymbols);
    if (useNonAsciiChars) password += getRandomChar(nonAsciiChars);
    
    // Fill remaining length with random characters
    while (password.length < length) {
        password += getRandomChar(charPool);
    }
    
    // Shuffle the password to ensure randomness in character placement
    password = shuffleString(password);
    
    // Trim if we added too many characters (due to ensuring character types)
    if (password.length > length) {
        password = password.substring(0, length);
    }
    
    // Display the password
    passwordDisplay.textContent = password;
};

// Get a random character from a string
const getRandomChar = (charSet) => {
    return charSet.charAt(Math.floor(Math.random() * charSet.length));
};

// Shuffle a string (Fisher-Yates algorithm)
const shuffleString = (str) => {
    const array = str.split('');
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array.join('');
};

const copyToClipboard = () => {
    if (passwordDisplay.textContent && 
        !passwordDisplay.textContent.includes('Please select')) {
        
        navigator.clipboard.writeText(passwordDisplay.textContent)
            .then(() => {
                // Visual feedback that copy was successful
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 1500);
            })
            .catch(err => {
                console.error('Failed to copy password: ', err);
            });
    }
};

// Update the displayed length value when slider changes
const updateLengthDisplay = () => {
    lengthValue.textContent = lengthSlider.value;
    // Regenerate password when length changes
    generatePassword();
};

const loadPageData = () => {
    // Get DOM elements
    passwordDisplay = document.getElementById('passwordDisplay');
    lengthSlider = document.getElementById('lengthSlider');
    lengthValue = document.getElementById('lengthValue');
    uppercaseCheck = document.getElementById('uppercaseCheck');
    lowercaseCheck = document.getElementById('lowercaseCheck');
    numbersCheck = document.getElementById('numbersCheck');
    simpleSymbolsCheck = document.getElementById('simpleSymbolsCheck');
    problematicSymbolsCheck = document.getElementById('problematicSymbolsCheck');
    nonAsciiCharsCheck = document.getElementById('nonAsciiCharsCheck');
    generateBtn = document.getElementById('generateBtn');
    copyBtn = document.getElementById('copyBtn');
    
    // Add event listeners
    lengthSlider.addEventListener('input', updateLengthDisplay);
    generateBtn.addEventListener('click', generatePassword);
    copyBtn.addEventListener('click', copyToClipboard);
    
    // Character type checkboxes should trigger password regeneration
    uppercaseCheck.addEventListener('change', generatePassword);
    lowercaseCheck.addEventListener('change', generatePassword);
    numbersCheck.addEventListener('change', generatePassword);
    simpleSymbolsCheck.addEventListener('change', generatePassword);
    problematicSymbolsCheck.addEventListener('change', generatePassword);
    nonAsciiCharsCheck.addEventListener('change', generatePassword);
    
    updateLengthDisplay();
    generatePassword();
};

window.addEventListener('DOMContentLoaded', loadPageData);