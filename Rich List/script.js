
const main = document.getElementById('main');
const addUserBtn = document.getElementById('add-user');
const doubleBtn = document.getElementById('double');
const showMillionairesBtn = document.getElementById('show-millionaires');
const sortBtn = document.getElementById('sort');
const calculateWealthBtn = document.getElementById('calculate-wealth');
const clearBtn = document.getElementById('clear');

let data = [];

// fetch random user and add money
async function getRandomUser() {
    const res = await fetch('https://randomuser.me/api');
    const data = await res.json();

    const user = data.results[0];

    const newUser = {
        name: `${user.name.first} ${user.name.last}`,
        money: Math.floor(Math.random() * 1000000)
    };
    addData(newUser);
}

//double everyones money

function doubleMoney() {
    data = data.map(user => {
        return { ...user, money: user.money * 2 }
    })
    console.log(data);
    updateDOM();
}


//add new obj to data arr
function addData(obj) {
    data.push(obj);

    updateDOM();
}


// Sort richest user - RICHEST first
function sortByRichest() {
    data.sort((a, b) => b.money - a.money);
    updateDOM();
}

// Filter only millionaires 
function showMillionaires() {
    data = data.filter(user => user.money > 1000000);
    updateDOM();
}

//calculate the total wealth
function calculateWealth() {

    const wealth = data.reduce((acc, user) => (acc += user.money), 0);
    const wealthEl = document.createElement('div');
    const contains = document.getElementById('contains');

    if (formatMoney(wealth) === '0.00') {
        return
    }

    // prevent showing amount more than once
    if (document.body.contains(contains)) {
        return;
    }

    // //if div is already present, dont do anything

    wealthEl.innerHTML = `<h3 id="contains">Total Wealth: <strong>${formatMoney(wealth)}</strong></h3>`;
    main.appendChild(wealthEl);
}


//Update Dom
function updateDOM(providedData = data) {
    //clear main div
    main.innerHTML = '<h2><strong>Personal</strong> <i class="fa fa-money"></i> Wealth</h2>';

    providedData.forEach(item => {
        const element = document.createElement('div');
        element.classList.add('person');
        element.innerHTML = `<strong>${item.name}</strong>$${formatMoney(item.money)}`;
        main.appendChild(element);
    })
}

// Clear DOM
function clearData() {
    data = [];
    updateDOM();
}

// Format number as money
function formatMoney(number) {
    return (number).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Event listeners

addUserBtn.addEventListener('click', getRandomUser);
doubleBtn.addEventListener('click', doubleMoney);
sortBtn.addEventListener('click', sortByRichest);
showMillionairesBtn.addEventListener('click', showMillionaires);
calculateWealthBtn.addEventListener('click', calculateWealth);
clearBtn.addEventListener('click', clearData);