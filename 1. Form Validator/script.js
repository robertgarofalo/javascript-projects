const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');


//show input error message
function showError(input, message){
const formControl = input.parentElement; 
formControl.className = 'form-control error'; //used to add red box around input that has an error
const small = formControl.querySelector('small');
small.innerText = message;
}

//show input success message
function showSuccess(input){
const formControl = input.parentElement;
formControl.className = 'form-control success';
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

//Event listeneres
form.addEventListener('submit', function(e){
e.preventDefault();


checkRequired([username, email, password, password2]);
checkLength(username, 3, 15); //input, min, max
checkLength(password, 6, 25);
checkEmail(email);
checkPasswordsMatch(password, password2);
/*

        if(username.value === ""){
            showError(username, 'Username is required');
        } else {
            showSuccess(username);
            }

        if(email.value === ""){
            showError(email, 'Email is required');
            }  else if (!isValidEmail(email.value)){
                showError(email, 'Email is not valid');
            }else {
                showSuccess(email);
            }

        if(password.value === ""){
            showError(password, 'Password is required');
            } else {
                showSuccess(password);
            }

        if(password2.value === ""){
            showError(password2, 'Confirm password');
            } else {
                showSuccess(password2);
            }
*/
})

