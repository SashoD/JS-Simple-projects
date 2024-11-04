const inputBox = document.querySelector(".inputField input")
const addBtn = document.querySelector(".inputField button");
const todoList = document.querySelector(".todoList");
const delAllBtn = document.querySelector(".footer button")


inputBox.onkeyup=()=>{
    let userData = inputBox.value;
    if(userData.trim()!=0){
        addBtn.classList.add("active")
    }else{
        addBtn.classList.remove("active")
    }
}

showTasks()

addBtn.onclick = ()=>{
    let userData = inputBox.value;
    let getLocalStorage = localStorage.getItem("New Todo");
    if(getLocalStorage == null){
        listArr = [];
    }else{
        listArr = JSON.parse(getLocalStorage);
    }
    listArr.push(userData);
    localStorage.setItem("New Todo",JSON.stringify(listArr))
    showTasks()
}


function showTasks(){
    let getLocalStorage = localStorage.getItem("New Todo");
    if(getLocalStorage == null){
        listArr = [];
    }else{
        listArr = JSON.parse(getLocalStorage);
    }
    const pendingNumb = document.querySelector(".pendingNumb");
    pendingNumb.textContent = listArr.length;
    if(listArr.length > 0){
        delAllBtn.classList.add("active");
    }else{
        delAllBtn.classList.remove("active")
    }
    let newLitag = '';
    listArr.forEach((e,index)=> {
        newLitag += `<li>
        ${e} <span onclick = "deleteTask(${index})"><i class="fas fa-trash"></i></span>
        </li>`;
    });
    todoList.innerHTML = newLitag;
    inputBox.value= "";
}

function deleteTask(index){
    let getLocalStorage = localStorage.getItem("New Todo");
    listArr = JSON.parse(getLocalStorage);
    listArr.splice(index,1)
    localStorage.setItem("New Todo",JSON.stringify(listArr))
    showTasks();
}

delAllBtn.onclick = ()=>{
    listArr = [];
    localStorage.setItem("New Todo",JSON.stringify(listArr))
    showTasks();
}
