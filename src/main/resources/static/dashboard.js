
let popupHeadingText, popupWindow, popupCancel, saveTaskButton, taskContainer,updateBtn, filterStatus, filterPriority;
let newTitle, newDescription, newPriority, newStatus, newDueDate;
let authToken;

function start(){
    init();
    fetchTasks();
}

function init(){
    popupWindow = document.querySelector(".popup");
    popupHeadingText = document.getElementById("popupHeadingText");
    popupCancel = document.getElementById("popupCancel");
    saveTaskButton = document.getElementById("saveTaskButton");
    newTitle = document.getElementById("newTitle");
    newDescription = document.getElementById("newDescription");
    newPriority = document.getElementById("newPriority");
    newStatus = document.getElementById("newStatus");
    newDueDate = document.getElementById("newDueDate");
    taskContainer = document.getElementById("taskContainer");
    updateBtn = document.getElementById("updateButton");
    filterPriority = document.getElementById("filterPriority");
    filterStatus = document.getElementById("filterStatus");

    authToken = localStorage.getItem("authToken");

    popupCancel.addEventListener('click',closePopup);
    saveTaskButton.addEventListener('click',saveTask);
    updateBtn.addEventListener('click',updateTask);

    document.getElementById("taskContainer").addEventListener('click',(event)=>{
     
        const card = event.target.closest("[data-task-id]"); // Find the card
    
        if (!card) return; // If no card found, exit
    
        const action = event.target.dataset.action;
       
        if(action == "delete"){
            card.lastElementChild.classList.remove("hide");
    
        }else if(action == "cancelDelete"){
            card.lastElementChild.classList.add("hide");
        }else if(action == "confirmDelete"){
            card.lastElementChild.classList.add("hide");
            deleteTask(card);
        }else if(action == "edit"){
            
            const title = card.querySelector("p[data-info='title']").innerText;
            const description = card.querySelector("p[data-info='description']").innerText;
            const priority = card.querySelector("b[data-info='priority']").innerText;
            const dueDate = stringToTime(card.querySelector("p[data-info='dueDate']").innerText);
            const status = card.querySelector("select[data-info='status']").value;
    
            showPopup("Edit Task", true, title, description, priority, status, dueDate, card.getAttribute("data-task-id"));
    
           
            
        }
    });
    
    document.getElementById("taskContainer").addEventListener('change',(event)=>{
        if(event.target.dataset.action == "updateStatus"){
    
            const card = event.target.closest("[data-task-id]");
            const taskId = card.getAttribute("data-task-id");
            const newStatus = event.target.value;
    
            updateStatus(taskId, newStatus, event.target);
        }
    });
    
    document.getElementById("taskContainer").addEventListener("mousedown", (event) => {
        if (event.target.dataset.action === "updateStatus") {
            event.target.dataset.oldValue = event.target.value;
        }
    });
    
    document.getElementById("options").addEventListener('change',(event)=>{
    
       
    
        const priority = filterPriority.value;
        const status = filterStatus.value;
    
        const action = event.target.dataset.action;
        if(action == "priority" || action == "status"){
            getTasksByFilter(status, priority);
        }
    });
    
    document.getElementById("options").addEventListener('click',(event)=>{
        const action = event.target.dataset.action;
       
        if(action == "createTask"){
            showPopup("Create New Task", false);
        }
    });

}

async function fetchTasks(){

    let response = await fetch("http://localhost:8081/get-all-tasks",{
        method:"GET",
        headers:{
            "Authorization":`Bearer ${localStorage.getItem("authToken")}`
        }
    });

    if(response.ok){

        taskContainer.innerHTML = "";

        const tasks = await response.json();

        tasks.forEach(task=>{
            taskCard = taskToCard(task);

        taskContainer.innerHTML += taskCard;
        });
    }
}


function showPopup(popupTitle, hasValues, title, description, priority, status, dueDate, id){

    newTitle.value = newDescription.value = newDueDate.value ='';


    popupWindow.classList.remove("hide");
    popupHeadingText.innerText = popupTitle;

    if(hasValues){
        newTitle.value = title;
        newDescription.value = description;
        newStatus.value = status;
        newPriority.value = priority;
        newDueDate.value = dueDate;

        saveTaskButton.classList.add("hide");
        updateBtn.classList.remove("hide");
        updateBtn.setAttribute("data-id",id);
    }else{
        saveTaskButton.classList.remove("hide");
        updateBtn.classList.add("hide");
    }
    

}

function closePopup(){
    popupWindow.classList.add("hide");
}

function formatTime(time){
    //Converts js time to String DD-MM-YYYY HH:MM:SS
    let date = new Date(time);

    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let year = date.getFullYear();

    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

function saveTask(){
    popupWindow.classList.add("hide");

    fetch("http://localhost:8081/create-task",{
        method:'POST',
        headers:{"Content-Type":"application/json",
                 "Authorization":`Bearer ${authToken}`
        },
        body:JSON.stringify({name:newTitle.value, description:newDescription.value, priority:newPriority.value, status:newStatus.value, dueDate:formatTime(newDueDate.value)})
    }).then(response=>{
       
        if(response.ok){
            fetchTasks();
        }else if(response.status == 401){

        }
    }).catch(error=>{
        console.error(error);
    });


}

function deleteTask(card){
    const taskId = card.getAttribute("data-task-id");

    fetch("http://localhost:8081/delete-task",{
        method:"DELETE",
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${authToken}`
        },
        body:JSON.stringify({id:Number.parseInt(taskId)})
    }).then(response=>{
        if(response.ok){
            card.remove();
        }else{
            console.error("Error Deleting Task");
        }
    }).catch(error=>{
        console.error(error);
    })
}

function taskToCard(task){

    const dueDateTime = new Date(stringToTime(task.dueDate));
    const currentDate = new Date();

    return `<div class="glass card ${ (dueDateTime > currentDate)?"":"card-expired" } " data-task-id="${task.id}">

            <div class="cardOption">
                <button class="btn-unicode" data-action="delete">ⓧ</button>
                <button class="btn-unicode" data-action="edit">🖉</button>
            </div>

            <div class="cardDetail">
                <span class="t-center">
                    <p class="text-s-grey">Priority</p>
                    <p class="item-pill"><b data-info="priority">${task.priority}</b></p>
                </span>

                <span class="t-center">
                    <p class="text-s-grey">Status</p>
                    <select class="sel-pill" data-action="updateStatus" data-info="status" data-oldValue="">

                        ${
                            (()=>{
                                let ret = "";
                            ["TODO", "RUNNING", "BLOCKER", "DONE"].forEach(element=>{
                                if(task.status == element){
                                    ret += `<option selected value="${element}">${element}</option>`;
                                }else{
                                    ret += `<option value="${element}">${element}</option>`;
                                }
                            })
                            
                            return ret;
                            })()

                        }
                    </select>
                </span>

                <span class="t-center">
                    <p class="text-s-grey">Due Date</p>
                    <p class="item-pill" data-info="dueDate">${task.dueDate}</p>
                </span>

            </div>

            <div class="titleContainer">
                <p class="taskTitleText" data-info="title">
                    ${task.name}
                </p>
            </div>
            <div class="descriptionContainer">
                <p class="taskDescriptionText" data-info="description">
                    ${task.description}
                </p>
            </div>

            <div class="overlay hide">
                <p class="text-m-purple">Delete this task?</p>
                <div style="display: flex;flex-direction: row;">
                    <button class="confirmBtn" data-action="confirmDelete">YES</button>
                    <button class="confirmBtn" data-action="cancelDelete">NO</button>
                </div>
                
            </div>
            
        </div>`;
}


function stringToTime(dateString) {
    
    // Convert "DD-MM-YYYY HH:MM:SS" to "YYYY-MM-DDTHH:MM"
    let parts = dateString.split(" ");
    let dateParts = parts[0].split("-"); // Split "DD-MM-YYYY"
    let timeParts = parts[1].split(":"); // Split "HH:MM:SS"

    return`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${timeParts[0]}:${timeParts[1]}`;
    
}

function updateTask(event){
    const taskId = event.target.dataset.id;
    popupWindow.classList.add("hide");

    fetch("http://localhost:8081/update-task",{
        method:'POST',
        headers:{"Content-Type":"application/json",
                 "Authorization":`Bearer ${authToken}`
        },
        body:JSON.stringify({id:taskId,name:newTitle.value, description:newDescription.value, priority:newPriority.value, status:newStatus.value, dueDate:formatTime(newDueDate.value)})
    }).then(response=>{
  
        if(response.ok){
            const priority = filterPriority.value;
            const status = filterStatus.value;
            getTasksByFilter(status,priority);
        }else{
            console.error("error updating task"); 
        }
    }).catch(error=>{
        console.error(error);
    });
}

function updateStatus(taskId, status, element){

    fetch("http://localhost:8081/update-task-status",{
        method:'PUT',
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${authToken}`
        },
        body:JSON.stringify({id:taskId,status:status})
    }).then(response=>{
        if(response.status != 201){
            element.value = element.dataset.oldValue;
        }
    }).catch(error=>{
        console.error(error);
        element.value = element.dataset.oldValue;
    });
}

async function  getTasksByFilter(status, priority){
    let response = await fetch(`http://localhost:8081/get-tasks/${priority}/${status}`,{
        method:"GET",
        headers:{
            "Authorization":`Bearer ${localStorage.getItem("authToken")}`
        }
    });

    if(response.ok){

        taskContainer.innerHTML = "";

        const tasks = await response.json();

        tasks.forEach(task=>{
            taskCard = taskToCard(task);

        taskContainer.innerHTML += taskCard;
        });
    }
}

start();

