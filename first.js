// let display = document.querySelector(".display");
// let btn = document.querySelectorAll(".btn");

// btn.forEach((button) => {
//     button.addEventListener("click", () => {
//     let value = button.innerText;

//     if(value === "="){
//        calculate();
//     } 
//         else if (value === "X"){
//             display.value += "*";
//     } 
//         else if (value === "c"){
//             display.value = "";
//     }
//         else if (value === "⌫"){
//             display.value = display.value.slice(0,-1);
//         }

//        else {
//             display.value += value;
//     }

//     });
// });


// function calculate() {
//     try {
//         display.value = Function('"use strict"; return (' + display.value + ')')();
//     } catch {
//         display.value = "Error";
//     }
// }



let display = document.querySelector(".display");
let btn = document.querySelectorAll(".btn");
let historyBtn = document.querySelector(".historybtn");
let popup = document.getElementById("historyPopup");
let closeBtn = document.querySelector(".close");
let historyList = document.getElementById("historyList");
let historyclearbtn = document.querySelector(".clearbtn");
let saveHistoryBtn = document.querySelector(".saveHistoryBtn");

// Date Filter Elements
let fromDateInput = document.getElementById("fromDate");
let toDateInput = document.getElementById("toDate");
let filterBtn = document.getElementById("filterBtn");
let resetFilterBtn = document.getElementById("resetFilterBtn");


// Load history from localStorage
let historyData = JSON.parse(localStorage.getItem("calcHistory")) || [];

// ================= SAVE HISTORY =================
function saveHistory(expression, result) {

    if (isNaN(result)) return;

    let entry = {
        calculation: expression + " = " + result,
        time: new Date().toISOString()
    };

    historyData.push(entry);
    localStorage.setItem("calcHistory", JSON.stringify(historyData));
    loadHistory();
}

// ================= LOAD FULL HISTORY =================
function loadHistory() {

    historyList.innerHTML = "";

    if (historyData.length === 0) {

        let li = document.createElement("li");
        li.textContent = "No History Yet";
        li.style.textAlign = "center";
        li.style.opacity = "0.7";

        historyList.appendChild(li);
        return;
    }


    historyData.forEach((item, index) => {

        let li = document.createElement("li");
        let formattedTime = new Date(item.time).toLocaleString('en-IN', { hour12: false });;

        li.innerHTML = `
            ${item.calculation}
            <small style="opacity:0.7;font-size:12px;">
                (${formattedTime})
            </small>
        `;

        li.addEventListener("click", () => {
            let expression = item.calculation.split("=")[0].trim();
            display.value = expression;
            popup.style.display = "none";
        });

        historyList.appendChild(li);
    });
}

// ================= DATE FILTER =================
function filterHistoryByDate() {

    let fromDateValue = fromDateInput.value;
    let toDateValue = toDateInput.value;

    if (!fromDateValue || !toDateValue) {
        alert("Please select both dates");
        return;
    }

    let fromDate = new Date(fromDateValue);
    let toDate = new Date(toDateValue);

    toDate.setHours(23,59,59,999);

    let filteredData = historyData.filter(item => {

        let itemDate = new Date(item.time);
        return itemDate >= fromDate && itemDate <= toDate;

    });

    displayFilteredHistory(filteredData);
}

// ================= DISPLAY FILTERED =================
function displayFilteredHistory(data){

    historyList.innerHTML = "";

    if(data.length === 0){

        let li = document.createElement("li");
        li.textContent = "No History Found In Selected Date Range";
        li.style.textAlign = "center";
        li.style.opacity = "0.7";

        historyList.appendChild(li);
        return;
    }


    data.forEach(item => {

        let resultValue = parseFloat(item.calculation.split("=")[1]);

        if(isNaN(resultValue)) return;
    });

    data.forEach(item => {

        let li = document.createElement("li");
        let formattedTime = new Date(item.time).toLocaleString('en-IN', { hour12: false });;

               
           let parts = item.calculation.split("=");

           let resultValue = parseFloat(parts[1]);

           let resultHTML = parts[1];

               if (!isNaN(resultValue)) {
                   if (resultValue >= 0) {
                       resultHTML = `<span class="positivehistory">${parts[1]}</span>`;
                   } else {
                       resultHTML = `<span class="negativehistory">${parts[1]}</span>`;
                   }  
                }

                li.innerHTML = `
                        ${parts[0]} = ${resultHTML}
                    <small style="opacity:0.7;font-size:12px;">
                        (${formattedTime})
                    </small>
                `;    



        li.addEventListener("click", () => {

            let expression = item.calculation.split("=")[0].trim();
            display.value = expression;
            popup.style.display = "none";

        });

        historyList.appendChild(li);

    });
}

// ================= DELETE BY DATE =================
function deleteHistoryByDate() {

    let fromDateValue = fromDateInput.value;
    let toDateValue = toDateInput.value;

    if (!fromDateValue || !toDateValue) {
        alert("Please select both dates");
        return;
    }

    let confirmDelete = confirm("Are you sure to delete selected date history?");
    if (!confirmDelete) return;

    let fromDate = new Date(fromDateValue);
    let toDate = new Date(toDateValue);

    toDate.setHours(23,59,59,999);

    historyData = historyData.filter(item => {
        let itemDate = new Date(item.time);
        return !(itemDate >= fromDate && itemDate <= toDate);
    });

    localStorage.setItem("calcHistory", JSON.stringify(historyData));

    loadHistory();
}


// ================= POPUP EVENTS =================
historyBtn.addEventListener("click",()=>{

    popup.style.display = "block";
    loadHistory();

});

closeBtn.addEventListener("click",()=>{
    popup.style.display = "none";
});

window.addEventListener("click",(e)=>{
    if(e.target == popup){
        popup.style.display = "none";
    }
});

// ================= CLEAR HISTORY =================

historyclearbtn.addEventListener("click",()=>{

    let confirmClear = confirm("Are you sure you want to clear history?");

    if(confirmClear){
        historyData = [];
        localStorage.removeItem("calcHistory");
        loadHistory();
    }

});


// ================= SAVE TXT =================
saveHistoryBtn.addEventListener("click",()=>{

    if(historyData.length === 0){
        alert("No history to save!");
        return;
    }

    let textData = "";

    historyData.forEach((item,index)=>{

        let formattedTime = new Date(item.time).toLocaleString('en-IN', { hour12: false });;
        textData += `${index+1}. ${item.calculation} (${formattedTime})\n`;

    });

    let blob = new Blob([textData],{type:"text/plain"});
    let link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "calculator-history.txt";
    link.click();

});

// ================= FILTER EVENTS =================
filterBtn.addEventListener("click",filterHistoryByDate);

resetFilterBtn.addEventListener("click",()=>{

    fromDateInput.value="";
    toDateInput.value="";
    loadHistory();

});

let deleteRangeBtn = document.getElementById("deleteRangeBtn");

deleteRangeBtn.addEventListener("click", deleteHistoryByDate);

// ================= BUTTON CLICK =================
btn.forEach(button=>{

    button.addEventListener("click",()=>{

        let value = button.innerText;

        if(value === "="){

            try{

                let expression = display.value;
                let result = eval(expression);
                result = parseFloat(result.toFixed(2));

                saveHistory(expression,result);
                display.value = result;

            }
            catch{

                display.value = "Error";

            }

        }

        else if(value === "X"){
            display.value += "*";
        }

        else if(value === "c"){
            display.value = "";
        }

        else if(value === "⌫"){
            display.value = display.value.slice(0,-1);
        }

        else{
            display.value += value;
        }

    });

});

// ================= KEYBOARD SUPPORT =================
document.addEventListener("keydown",(e)=>{

    if(e.target === fromDateInput || e.target === toDateInput){
        return;
    }

    let key = e.key;

    if(key === "Enter"){

        try{

            let expression = display.value;
            let result = eval(expression);
            result = parseFloat(result.toFixed(2));

            saveHistory(expression,result);
            display.value = result;

        }
        catch{

            display.value = "Error";

        }

    }

    else if(key === "Backspace"){
        display.value = display.value.slice(0,-1);
    }

    else if(key === "Escape"){
        display.value = "";
    }

    else if(/[\d+\-*/.]/.test(key)){
        display.value += key;
    }

});






// buttons access


let body = document.querySelector("body");
let btns = document.querySelector("#modeBtn");

btns.addEventListener("click", () => {
    let currentColor = localStorage.getItem("colortheme");

    if (currentColor === "black") {
        localStorage.setItem("colortheme", "white");
    } else if (currentColor === "white") {
        localStorage.setItem("colortheme", "skyblue");
    }  else if (currentColor === "skyblue"){
        localStorage.setItem("colortheme", "pink");
    } else {
        localStorage.setItem("colortheme","black");
    }

    bodycolor();
});

let bodycolor = () => {
    let color = localStorage.getItem("colortheme");
    body.style.background = color;
}

bodycolor();






//set timeout methode


// let normal = document.querySelector("#normal");

// let timeoutId;
// normal.addEventListener("click",() => {
//    timeoutId = setTimeout(() => {
//         alert("btn was clicked");
//     },1000)
// })

// let stop1 = document.querySelector("#stop");

// stop1.addEventListener("click" ,() => {
// clearTimeout(timeoutId);
// })



// let users = [
//  {id: 1 , name:"harsh",age:22},
//  {id: 2 , name:"aadi", age:9},
// ];


// for(let user of users){
//     console.log(user);
// }

// for(let i=0; i < users.length; i++){
//     console.log(users[i]);
// }



