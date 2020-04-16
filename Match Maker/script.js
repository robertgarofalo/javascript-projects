let preferencesContainer = document.getElementById('container-one');
let loadingContainer = document.getElementById('loading-container');
let resultsContainer = document.getElementById('results-container');
let resultBlock = document.getElementById('result-block');
let sexInpt = document.getElementById('sex');
let ageFromInpt = document.getElementById('age-from');
let ageToInpt = document.getElementById('age-to');
let countryInpt = document.getElementById('country');
let searchBtn = document.getElementById('search-btn');
let clearBtn = document.getElementById('clear-btn');
let randomBtn = document.getElementById('random-btn');

let likesArr = [
    ' walks along the beach in the middle of winter',
    ' skinny dipping',
    ' getting drunk Monday to Saturday',
    ' using road rage as a way to vent',
    ' pineapple on pizza and anchovies in cakes',
    ' flatulence in public',
    ' burping contents',
    ' to be annoying most of the time',
    ' screaming at randoms from the car',
    ' coding with their feet',
    ' streaking at the local football games',
    ' popping other people\'s pimples'
]

let totalMatchesCount = document.getElementById('total-matches');

let imgPath = document.getElementById('img-path');
let nameResult = document.getElementById('name-result');
let ageResult = document.getElementById('age-result');
let countryResult = document.getElementById('country-result');
let likesResult = document.getElementById('likes');

let likeBtn = document.getElementById('like-btn');
let dislikeBtn = document.getElementById('dislike-btn');
let homeBtn = document.getElementById('home-btn');

let modalHeading = document.querySelector('.modal-title');
let modalText = document.getElementById('modal-text');
let modalQuit = document.getElementById('modal-quit');
let modalContinue = document.getElementById('continue');
let modalButtonsStart = document.getElementById('modal-start');
let modalButtonsLast = document.getElementById('modal-last');

let randomNum;

// clear search fields
function clearSearch() {
    sexInpt.value = "";
    ageFromInpt.value = "";
    ageToInpt.value = "";
    countryInpt.value = "";
}



//Correct buttons being display in modal

function correctModalButtons(container, buttonShow, buttonHide) {

    if (window.getComputedStyle(container, null).getPropertyValue("display") === "flex") {

        //show buttons
        buttonShow.style.display = "block";

        //hide buttons
        buttonHide.style.display = "none";
    }
}

//Fetch random user API based on SEARCH
function searchApi() {
    fetch(`https://randomuser.me/api?results=1000&gender=${sexInpt.value}`)
        .then(res => res.json())
        .then(data => {
            let users = [];
            users = data.results.filter(user =>
                user.dob.age > ageFromInpt.value && user.dob.age < ageToInpt.value && user.location.country === countryInpt.value);
            console.log(users)
            if (users.length === 0) {
                likeBtn.click();
                modalHeading.textContent = "Sorry!";
                modalText.textContent = 'No search results were found. Please try again';
                console.log('0 search results');
                clearSearch();
            } else {
                loadingMatch();
                setTimeout(function () { showResultsContainer(users) }, 6000);
            };
        }).catch((error) => {
            likeBtn.click();
            modalHeading.textContent = "Error!";
            modalText.textContent = error;
            console.error('Error:', error);
        });
}

//Fetch random userAPI based on RANDOM 
function randomApi() {
    fetch(`https://randomuser.me/api?results=${randomNum}`)
        .then(res => res.json())
        .then(data => {
            let users = [];
            users = data.results;
            console.log(users)
            loadingMatch();
            setTimeout(function () { showResultsContainer(users) }, 6000);
        }).catch((error) => {
            likeBtn.click();
            modalHeading.textContent = "Error!";
            modalText.textContent = error;
            console.error('Error:', error);
        });
}

//Loading match container func
function loadingMatch() {
    if (preferencesContainer.style.display = "flex") {
        fadeOut(preferencesContainer);
    };
    setTimeout(function () { fadeIn(loadingContainer) }, 0600);
    loadingTextFunc();
}

function loadingTextFunc() {
    let loadingText = document.getElementById('loading-text');
    let dot = '.';
    let dotArr = [];
    const addDot = setInterval(function () {
        dotArr.push(dot);
        loadingText.textContent = dotArr.join('');
        if (dotArr.length === 3) {
            dotArr = [];
        }
    }, 900);

    setTimeout(function () {
        clearInterval(addDot);
    }, 6000);
}

//Hide preferences container and display results container with users func
function showResultsContainer(arr) {

    if (arr.length < 2) {
        totalMatchesCount.innerHTML = `<strong>1</strong> ideal match!`;
    } else {
        totalMatchesCount.innerHTML = `<strong>${arr.length}</strong> ideal matches!`;
    }

    let userIndex = 0;
    fadeOut(loadingContainer);
    setTimeout(function () { fadeIn(resultsContainer) }, 1000);
    setTimeout(function () { displayToDom(userIndex) }, 800);


    //add results to the DOM
    function displayToDom(userIndex = 0) {
        let img = arr[userIndex].picture.large;
        let name = arr[userIndex].name.first;
        let age = arr[userIndex].dob.age;
        let country = arr[userIndex].location.country;
        let likes = likesArr[Math.floor(Math.random() * likesArr.length)];

        imgPath.src = img;
        nameResult.textContent = name;
        ageResult.textContent = age;
        countryResult.textContent = country;
        likesResult.textContent = likes;
    }

    //Like button
    likeBtn.addEventListener('click', function () {

        modalHeading.textContent = "Success!";
        modalText.innerHTML = `Your match has been notified! Get ready for some sexy time tonight! <i class="far fa-laugh-wink"></i>`;


    });

    //Dislike button
    dislikeBtn.addEventListener('click', function () {
        userIndex++;
        fadeOut(resultBlock);
        setTimeout(function () { fadeIn(resultBlock) }, 1000)
        setTimeout(function () { displayToDom(userIndex) }, 800);
    })

    //Return to home screen
    homeBtn.addEventListener('click', function () {
        fadeOut(resultsContainer);
        setTimeout(function () { fadeIn(preferencesContainer) }, 1000)
        users = [];
        clearSearch();

    })
}

// Fade out container func
function fadeOut(element) {
    element.style.display = "flex";
    element.style.opacity = 1;
    var tick = function () {
        element.style.opacity = +element.style.opacity - 0.05;
        if (+element.style.opacity > 0) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
        } else {
            if (!element.classList.contains('keep-block')) {
                element.style.display = "none"
            }
        }
    };
    tick();
}

// Fade in container func
function fadeIn(element) {
    element.style.display = "flex";
    element.style.opacity = 0.3;

    correctModalButtons(preferencesContainer, modalButtonsStart, modalButtonsLast);
    correctModalButtons(resultsContainer, modalButtonsLast, modalButtonsStart);

    var tick = function () {
        element.style.opacity = +element.style.opacity + 0.05;
        if (+element.style.opacity < 1) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
        }
    };
    tick();
}


//Global Event Listeners

//SEACH BUTTON
searchBtn.addEventListener('click', function () {
    if (sexInpt.value === "" || ageFromInpt.value === "" || ageToInpt.value === "" || countryInpt.value === "") {
        likeBtn.click();
        modalHeading.textContent = "Error!";
        modalText.textContent = "Incomplete or missing field. Please try again";
        console.log('Incomplete or missing field');

    } else if (ageFromInpt.value > ageToInpt.value) {
        likeBtn.click();
        modalHeading.textContent = "Error!";
        modalText.textContent = 'The FROM age value must be less than the TO age value';
        console.log('The from value must be less than the to value');
    } else {
        searchApi();
    }
});

//PREFERENCES SCREEN BUTTONS
clearBtn.addEventListener('click', clearSearch);

randomBtn.addEventListener('click', function () {
    randomNum = Math.floor(Math.random() * (60 - 30)) + 30;
    randomApi();
})

// MODAL BUTTONS
modalContinue.addEventListener('click', function () {
    dislikeBtn.click();
})

modalQuit.addEventListener('click', function () {
    homeBtn.click();
    console.log('modal quit button pressed');
})

/*

 - Complete styling

 Responsiveness



*/