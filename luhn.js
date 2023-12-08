// define the elements to use them later 
let cardInput, luhnResult;

const luhnCheck = num => {
    const arr = (num + '')
        .replace(/ |-/g, '')
        .split('')
        .reverse()
        .map(x => parseInt(x));
    const lastDigit = arr.splice(0, 1)[0];
    let sum = arr.reduce((acc, val, i) => (i % 2 !== 0 ? acc + val : acc + ((val * 2) % 9) || 9), 0);
    sum += lastDigit;
    return sum % 10 === 0;
};

const runCheck = () => {
    luhnResult.textContent = luhnCheck(cardInput.value) ?
        "✔️ luhn passes" : "❌ luhn fails";
}

const loadPageData = () => {
    const formatAsCardNumber = e => {
        e.target.value= e.target.value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ');
        return true;
    };
    cardInput = document.getElementById("cardNumber");
    luhnResult = document.getElementById("luhnResult");

    cardInput.addEventListener("input", runCheck);
    cardInput.addEventListener("keypress", formatAsCardNumber);

    runCheck();
};


window.addEventListener('DOMContentLoaded', (event) => {
    loadPageData();
});
