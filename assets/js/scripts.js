const firstCurrencySelector = document.querySelector('#selector-1');
const secondCurrencySelector = document.querySelector('#selector-2');
const firstCurrencyInput = document.querySelector('#input-1');
const secondCurrencyInput = document.querySelector('#input-2');

window.addEventListener('load', event => {
    populateSelectElement();

    firstCurrencyInput.addEventListener('input', event => {
        const firstCurrency = firstCurrencySelector.value;
        const secondCurrency = secondCurrencySelector.value;
        let firstValue = Number(event.target.value);

        setSecondValue(firstCurrency, secondCurrency, firstValue);
    });

    secondCurrencyInput.addEventListener('input', event => {
        const firstCurrency = firstCurrencySelector.value;
        const secondCurrency = secondCurrencySelector.value;
        let secondValue = Number(event.target.value);

        setFirstValue(firstCurrency, secondCurrency, secondValue);
    });

    if ('serviceWorker' in navigator) {
        try {
            navigator.serviceWorker.register('sw.js');
            console.log('SW registered');
        } catch (e) {
            console.log('SW registration failed');
        }
    }
});

async function populateSelectElement() {
    const res = await fetch(`https://free.currencyconverterapi.com/api/v5/currencies`).then(res => res.json());
    
    firstCurrencySelector.innerHTML = getCurrencies(res.results);
    secondCurrencySelector.innerHTML = getCurrencies(res.results);
}

function getCurrencies(obj) {
    let options = '';
    for (let currency in obj) {
        options += `<option value="${obj[currency].id}">${obj[currency].currencyName}</option>`;
    }
    return options;
}

async function setFirstValue(currency1, currency2, val2) {
    const res = await fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${currency2}_${currency1}`).then(res => res.json());
    const val = res.results[`${currency2}_${currency1}`].val;
    firstCurrencyInput.value = Number(val) * val2;
}

async function setSecondValue(currency1, currency2, val1) {
    const res = await fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${currency1}_${currency2}`).then(res => res.json());
    const val = res.results[`${currency1}_${currency2}`].val;
    secondCurrencyInput.value = Number(val) * val1;
}