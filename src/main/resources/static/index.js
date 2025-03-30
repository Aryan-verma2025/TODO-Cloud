let loginButton, errorText;

function start(){
    loginButton = document.getElementById("loginBtn");
    errorText = document.getElementById("errorText");
    loginButton.addEventListener('click',loginUser);
}

async function loginUser(){
    errorText.innerText = "";
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if(username == "" || password == ""){
        return;
    }

    let response = await fetch("/login",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({username:username,password:password})
    });

    if(response.ok){
        const token = await response.text();
        localStorage.setItem("authToken",token);
        window.location.href="/dashboard.html";
    }else if(response.status == 401){
        errorText.innerText = "Invalid Username or Password";
    }else{
        errorText.innerText = "Something went wrong";
    }
}

start();
