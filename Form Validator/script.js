const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');
const formContainer = document.getElementById('container');
const checkBox = document.getElementById('checkbox');
const submitBtn = document.querySelector('button');

//show input error message
function showError(input, message){
const formControl = input.parentElement; 
formControl.className = 'form-control error'; //used to add red box around input that has an error
const small = formControl.querySelector('small');
small.innerText = message;

//add form shake error
formContainer.classList.add('form-error');

//remove error class after 0.5s to allow for repeated shake
setTimeout(function(){
formContainer.classList.remove('form-error');
}, 500);

}

//show input success message
function showSuccess(input){
const formControl = input.parentElement;
formControl.className = 'form-control success';

//remove form shake error
formContainer.classList.remove('form-error');

}

//check email is valid
function checkEmail(input) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(input.value.trim())) {
        showSuccess(input);
    } else {
        showError(input, 'Email is not valid');
    }
}

//Check input function
function checkRequired(inputArr){
    
inputArr.forEach(function(input) {
   
if (input.value.trim() === ""){
    showError(input, `${getLabelHtml(input)} is required`);
} else {
    showSuccess(input);
}
});
}

//check password match
function checkPasswordsMatch(input1, input2){
if(input1.value !== input2.value){
   showError(input2, `Passwords do not match`); 
}
}


//get label innerHTML
function getLabelHtml(input){
    return input.previousSibling.previousSibling.id;
}

//check input length
function checkLength(input, min, max){
    if (input.value.length < min) {
        showError(input, `${getLabelHtml(input)} must be at least ${min} characters`)
    } else if (input.value.length > max){
        showError(input, `${getLabelHtml(input)} must be less than ${max} characters`)

    }
}

function disableBtn(){
    if (checkBox.checked){
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

//Event listeneres

// SUBMIT form
form.addEventListener('submit', function(e){
e.preventDefault();

checkRequired([username, email, password, password2]);
checkLength(username, 3, 15); //input, min, max
checkLength(password, 6, 25);
checkEmail(email);
checkPasswordsMatch(password, password2);


})


// Disable submit button via checkbox
checkBox.addEventListener('change', disableBtn);

