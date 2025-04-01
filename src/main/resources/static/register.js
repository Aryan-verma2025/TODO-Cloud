
let registerBtn, errorText;

function start(){
    registerBtn = document.getElementById("registerBtn");
    errorText = document.getElementById("errorText");
    registerBtn.addEventListener('click',signupUser);
}

async function signupUser(){

    errorText.innerText = "";

    const username = document.getElementById("username").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if(!(password === confirmPassword)){
        errorText.innerText = "Passwords do not match";
        return;
    }

    let response = await fetch("/register",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({name:name,username:username,password:password,email:email})
    });

    if(response.ok){
        registerBtn.innerText = "Successfully registered";
    }else if(response.status == 409){
        errorText.innerText = "Username is already registered";
    }else{
        errorText.innerText = "Something went wrong";
    }
}

start();
