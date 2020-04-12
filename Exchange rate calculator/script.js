const currencyEl_one = document.getElementById('currency-one');
const amountEl_one = document.getElementById('amount-one');
const currencyEl_two = document.getElementById('currency-two');
const amountEl_two = document.getElementById('amount-two');
let countryOne = 'usa';

const rateEl = document.getElementById('rate');
const swap = document.getElementById('swap');

const currency_one_flag = document.getElementById('currency-one-flag');
const currency_two_flag = document.getElementById('currency-two-flag');

//const addNewCurrency = document.querySelectorAll('.add-new-currency');

const mainRate = document.querySelectorAll('.main-x-rate')[0]; //node
const mainCurrency = mainRate.getAttribute('value');
const liveRatesArray = document.querySelectorAll('.live-x-rate');

const addNewCurrency = document.getElementById('add-new-btn'); // add new currency button
const removeNewCurrency = document.querySelectorAll('.btn.delete-btn'); //delete new currency button

//Fetch exchange rates and update the DOM
function calculate() {
    const currency_one = currencyEl_one.value;
    const currency_two = currencyEl_two.value;

    fetch(`https://api.exchangerate-api.com/v4/latest/${currency_one}`)
        .then(res => res.json())
        .then(data => {

            const rate = data.rates[currency_two];

            rateEl.innerText = `1 ${currency_one} = ${rate} ${currency_two}`;

            amountEl_two.value = (amountEl_one.value * rate).toFixed(2); //toFixed() changes to how ever many decimals passed in
        });
}

//Show live exchange rates
function showLiveRates() {


    fetch(`https://api.exchangerate-api.com/v4/latest/${mainCurrency}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);

            liveRatesArray.forEach(function (rate) {
                xchangeCurrency = rate.previousElementSibling.innerText

                if (mainCurrency === xchangeCurrency) {
                    rate.innerText = 1; //if there is AUD in list
                }
                //hasOwnProperty returns true or false
                //if data.rates has a key same as the xchange currency = true
                if (data.rates.hasOwnProperty(xchangeCurrency)) {
                    rate.innerText = data.rates[xchangeCurrency].toFixed(2);
                }
            });
        });
}

function newCurrencyRow() {

    exchangeRate = addNewCurrency.value;
    addToContainer = document.getElementById('add-to');

    fetch(`https://api.exchangerate-api.com/v4/latest/${exchangeRate}`)
        .then(res => res.json())
        .then(data => {
            console.log(data.base);
            // if theyre the same, make it 1
            if (data.base === 'USD') {
                rate = '1';
                console.log(rate);
            };
        })

    const newCurrencyRow = ` 

    <div class="live-rates-row img-invisible">
    <div class="live-rate main">
        <img class="flag" src="img/${exchangeRate}.svg" alt="flag">
        <h3 class="main-x-rate" value="AUD">1 ${exchangeRate}</h3>
        <button class='btn delete-btn'>Remove currency</button>

    </div>
    <div class="border-right"></div>
    <div class="live-rate">
        <img class="flag hidden" src="img/usd.svg" alt="flag">
        <h2 value="USD">USD</h2>
        <h3 class="live-x-rate">0.3</h3>
    </div>
    <div class="live-rate">
        <img class="flag hidden" src="img/eur.svg" alt="flag">
        <h2 value="EUR">EUR</h2>
        <h3 class="live-x-rate">0.63</h3>
    </div>
    <div class="live-rate">
        <img class="flag hidden" src="img/gbp.svg" alt="flag">
        <h2 value="GBP">GBP</h2>
        <h3 class="live-x-rate">0.63</h3>
    </div>
    <div class="live-rate">
        <img class="flag hidden" src="img/jpy.svg" alt="flag">
        <h2 value="JPY">JPY</h2>
        <h3 class="live-x-rate">0.63</h3>
    </div>
    <div class="live-rate">
        <img class="flag hidden" src="img/inr.svg" alt="flag">
        <h2 value="INR">INR</h2>
        <h3 class="live-x-rate">0.63</h3>
    </div>

</div>
    `;

    const newDiv = document.createElement('div');
    addToContainer.appendChild(newDiv);
    newDiv.innerHTML = newCurrencyRow;

    addNewCurrency.value = "Add new currency";

    //display proper rates according to selected currency -------- incomplete

}

function deleteNewCurrencyRow(e) {
    if (e.target.classList.contains('delete-btn')) {
        e.target.parentNode.parentNode.remove();
    }
}

//Event listeneres
currencyEl_one.addEventListener('change', calculate);
amountEl_one.addEventListener('input', calculate);
currencyEl_two.addEventListener('change', calculate);
amountEl_two.addEventListener('input', calculate);

swap.addEventListener('click', () => {
    const temp = currencyEl_one.value;
    currencyEl_one.value = currencyEl_two.value;
    currencyEl_two.value = temp;
    calculate();
})

//add new currency button
addNewCurrency.addEventListener('change', newCurrencyRow);

//remove currency button
document.addEventListener('click', deleteNewCurrencyRow)

calculate();
showLiveRates();
