
// https://finnhub.io/docs/api
// https://canvasjs.com/docs/charts/chart-options/colorset/

//GLOBAL VARIABLES

const apiKey = 'bqjufkvrh5r9t8htdhkg'
const table = document.getElementById('table');
const addNewScreenButton = document.getElementById('add-new-screen-btn');
const closeAddScreenButton = document.getElementById('close-add-screen-btn');
const addNewScreen = document.getElementById('add-new-screen');
const addNewStockButton = document.getElementById('add-new-stock-button');

const deleteButton = document.querySelectorAll('.delete-button');

//Form input VARIABLES
const tickerCodeInput = document.getElementById('ticker-code');
const stockNameInput = document.getElementById('stock-name');
const noOfUnitsInput = document.getElementById('number-of-units');
const purchasedAtInput = document.getElementById('purchase-price');

const usdTotal = document.getElementById('total-usd');
const audTotal = document.getElementById('total-aud');

// Stocks Arr - used to map through so promise.all can function
let stocksArr = [];

// Fetch data function
function fetchData(stockObject) {

    // Sort stocks by name alphabetically
    stocksArr.sort(function (a, b) {
        var textA = a.ticker.toUpperCase();
        var textB = b.ticker.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    })

    let fetchDataArr = stocksArr.map(stock => {
        return stock['fetch'];
    })

    Promise.all(fetchDataArr)
        .then(function (data) {
            addDataToDom(data, stockObject);
        }).catch(function (error) {
            console.log(error);
        })

};

function addDataToDom(data, stockObject) {
    console.log('stockobject ', stockObject);
    console.log('data ', data);
    let allTrs = table.querySelectorAll('tr');

    allTrs.forEach(tr => {
        if (tr.id !== "header-row")
            tr.remove();
    })

    // use index (i) of data to match with the correct objects index
    data.forEach((stock, i) => {

        let tr = document.createElement('tr');
        tr.classList.add('row-style');
        tr.innerHTML = `
                    <td class="ticker">${stocksArr[i].ticker}</td>
                    <td class="stock-name">${stocksArr[i].name}</td>
                    <td class="no-of-units">${stocksArr[i].noOfUnits}</td>
                    <td class="purchase-price">$${stocksArr[i].purchasedAt}</td>                  
                    <td class="current-price">$${stock.c}</td> 
                    <td class="current-gain-loss">$${((stocksArr[i].noOfUnits * stock.c) - (stocksArr[i].noOfUnits * stocksArr[i].purchasedAt)).toFixed(2)}</td> 
                    <td class="previous-day-close">$${stock.pc}</td>
                    <td class="previous-gain-loss">$${((stocksArr[i].noOfUnits * stock.pc) - (stocksArr[i].noOfUnits * stocksArr[i].purchasedAt)).toFixed(2)}</td> 
                    <td><i class="edit-button fa fa-pencil"></i></td>              
                    <td><i class="delete-button fa fa-trash"></i></td>              
                    `;
        table.appendChild(tr);

    })


    //add up the total current profit and loss
    addCurrentProfitLoss();

}

function addCurrentProfitLoss() {


    let total = 0;
    let allCurrentGainLoss = document.querySelectorAll('.current-gain-loss');

    allCurrentGainLoss.forEach(item => {
        let amount = +item.innerText.substring(1);
        total = total + amount;
    })

    usdTotal.innerHTML = `$${total.toFixed(2)}<span class="currency"> USD</span>`;

    if (Math.sign(total) === -1) {
        usdTotal.classList.add('negative');
        usdTotal.classList.remove('positive');

        audTotal.classList.add('negative');
        audTotal.classList.remove('positive');
    } else if (Math.sign(total) === 1) {
        usdTotal.classList.add('positive');
        usdTotal.classList.remove('negative');

        audTotal.classList.add('positive');
        audTotal.classList.remove('negative');
    } else {
        usdTotal.classList.remove('positive');
        usdTotal.classList.remove('negative');

        audTotal.classList.remove('positive');
        audTotal.classList.remove('negative');
    }

    //convert USD to AUD
    convertUSDtoAUD(total);
}

//Convert USD rate to AUD
function convertUSDtoAUD(usdTotal) {



    fetch(`https://api.exchangerate-api.com/v4/latest/usd`)
        .then(res => res.json())
        .then(data => {
            const audAmount = data.rates['AUD'] * usdTotal;
            audTotal.innerHTML = `$${audAmount.toFixed(2)}<span class="currency"> AUD</span>`
        });
}

// PIE CHART

window.onload = function () {

    var chart = new CanvasJS.Chart("chartContainer", {
        interactivityEnabled: false,
        backgroundColor: "#272953",
        animationEnabled: false,
        title: {
            text: "Portfolio",
            fontColor: "#fff",
            fontFamily: "tahoma"
        },
        data: [{
            type: "pie",
            startAngle: 240,
            yValueFormatString: "##0.00\"%\"",
            indexLabel: "{label} {y}",
            dataPoints: [
                { y: 79.45, label: "Google", indexLabelFontColor: "#fff" },
                { y: 7.31, label: "Tesla", indexLabelFontColor: "#fff" },
                { y: 7.06, label: "Apple", indexLabelFontColor: "#fff" },
                { y: 4.91, label: "Uber", indexLabelFontColor: "#fff" },
                { y: 1.26, label: "Verizon", indexLabelFontColor: "#fff" },
                { y: 1.26, label: "Microsoft", indexLabelFontColor: "#fff" }
            ]
        }]
    });
    chart.render();
}

// Constantly get current date and time
getDateAndTime();
setInterval(getDateAndTime, 1000);

// https://tecadmin.net/get-current-date-time-javascript/

function getDateAndTime() {
    let day = document.getElementById('day');
    let time = document.getElementById('current-time');
    let date = document.getElementById('date');

    let today = new Date();

    //======================================
    //Current day of the week
    let weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    let currentDay = weekday[today.getDay()];
    day.textContent = currentDay;

    //======================================
    // Current Date 
    //Date
    function ordinal_suffix_of(i) {
        var j = i % 10,
            k = i % 100;
        if (j == 1 && k != 11) {
            return i + "st";
        }
        if (j == 2 && k != 12) {
            return i + "nd";
        }
        if (j == 3 && k != 13) {
            return i + "rd";
        }
        return i + "th";
    }

    let currentDate = `${ordinal_suffix_of(today.getDate())}`;


    //Month
    let month = new Array(12);
    month[0] = 'January';
    month[1] = 'February';
    month[2] = 'March';
    month[3] = 'April';
    month[4] = 'May';
    month[5] = 'June';
    month[6] = 'July';
    month[7] = 'August';
    month[8] = 'September';
    month[9] = 'October';
    month[10] = 'November';
    month[11] = 'December';

    //Entire Date
    let todaysDate = currentDate + ' ' + month[today.getMonth()] + ' ' + today.getFullYear();
    date.textContent = todaysDate;

    //======================================
    //Current time

    let currentTime = String(today.getHours()).padStart(2, '0') + ":" + String(today.getMinutes()).padStart(2, '0') + ":" + String(today.getSeconds()).padStart(2, '0');
    time.textContent = currentTime;

};

// Get weather

window.addEventListener('load', () => {
    let long;
    let lat;
    let temperatureDegree = document.querySelector('.temperature-degree');
    let tempDescription = document.querySelector('.description')
    let location = document.querySelector('.city');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {

            if (navigator.geoloction === false) {
                lat = -37.788057599999995
                long = 144.91648
            } else {
                long = position.coords.longitude;
                lat = position.coords.latitude;
            }
            const proxy = 'https://cors-anywhere.herokuapp.com/';
            const api = `${proxy}https://api.darksky.net/forecast/b3e4dd9c89d69551b401216516ef1675/${lat},${long}`;

            console.log('lat ', lat)
            console.log(long)

            //fetch data and then save to json
            fetch(api)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    const { temperature, summary } = data.currently;
                    const { timezone } = data;
                    let celsius = Math.floor((temperature - 32) * (5 / 9));

                    temperatureDegree.innerHTML = `${celsius}<span> &#176C </span>`;
                    tempDescription.textContent = summary;
                    location.textContent = timezone;
                    // CELSIUS FORMULA                   


                });

        });
    }

});

// Close pop up add new stock screen
function closeAddScreen() {
    addNewScreen.style.display = "none";
}

// Open up pop up add new stock screen
function addNewScreenOpen() {
    addNewScreen.style.display = "block";
}

function createFetchData() {

    //that string's data is then extracted
    let tickerCode = tickerCodeInput.value.trim().toUpperCase();

    let stockObject = {
        ticker: tickerCodeInput.value.toUpperCase(),
        name: stockNameInput.value.toUpperCase(),
        noOfUnits: +noOfUnitsInput.value,
        purchasedAt: +purchasedAtInput.value,
        fetch: fetch(`https://finnhub.io/api/v1/quote?symbol=${tickerCode}&token=${apiKey}`).then(res => res.json())
    }

    stocksArr.push(stockObject);
    fetchData(stockObject);

    // Reset input values
    tickerCodeInput.value = "";
    stockNameInput.value = "";
    noOfUnitsInput.value = "";
    purchasedAtInput.value = "";

    closeAddScreen();
}

function deleteStock(e) {
    //remove the stock row in the DOM
    let currentRow = e.target.parentNode.parentNode;
    currentRow.remove();
    // console.log(currentRow);
    // console.log('text ', currentRow.childNodes[1].textContent);

    stocksArr.forEach(stock => {
        if (currentRow.childNodes[1].textContent === stock['ticker']) {
            stocksArr.pop(stock);
        }
    })

    addCurrentProfitLoss()

}

//EVENT LISTENERS
closeAddScreenButton.addEventListener('click', closeAddScreen);
addNewScreenButton.addEventListener('click', addNewScreenOpen);
addNewStockButton.addEventListener('click', createFetchData);

document.addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('delete-button')) {
        deleteStock(e);
    }

})


// FUNCTIONALITY TO DO
// save data to local storage
// add total gain/loss column cells  


// NOTES
//stock propogation - refer to document.addeventlistener 