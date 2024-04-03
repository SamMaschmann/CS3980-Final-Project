
let nameInput = document.getElementById('name');
let amountInput = document.getElementById('amount');
let reasonInput = document.getElementById('reason');

let nameEditInput = document.getElementById('name-edit');
let amountEditInput = document.getElementById('amount-edit');
let reasonEditInput = document.getElementById('reason-edit');
let updateid = [];

const api = 'http://127.0.0.1:5173';

function tryAdd() {
    const debtType = document.getElementById('debtType').value;
    if (debtType === 'debt') {
        addDebt(nameInput.value, amountInput.value, reasonInput.value);
    } else if (debtType === 'request') {
        addPaymentRequest(nameInput.value, amountInput.value, reasonInput.value);
    }
}

let addDebt = (person, amount, reason) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 201) {
            alert("Debt added successfully!");
            window.location.href = "/";
        }
    }
    xhr.open('POST', `${api}/debts`, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify({ person, amount, reason }));
}


let addPaymentRequest = (recipient, amount, reason) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 201) {
            alert("Payment request added successfully!");
            window.location.href = "/";
        }
    }
    xhr.open('POST', `${api}/payment-requests`, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify({ recipient, amount, reason }));
}



async function loadTable(table){
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const data = JSON.parse(xhr.responseText)

            const tableBody = table.querySelector("tbody");

            tableBody.innerHTML = "";
            for (const item of data) {
                const rowElement = document.createElement("tr");

                const nameCellElement = document.createElement("td");
                const amountCellElement = document.createElement("td");
                const reasonCellElement = document.createElement("td");

                nameCellElement.textContent = item.person
                amountCellElement.textContent = '$' + item.amount
                reasonCellElement.textContent = item.reason


                const updateButton = document.createElement('button');
                const deleteButton = document.createElement('button');

                updateButton.innerText = "Update"
                deleteButton.innerText = "Delete"
                updateButton.style.backgroundColor = "#42b0ff"
                deleteButton.style.backgroundColor = "#ff2200"
                updateButton.style.borderRadius = 12
                deleteButton.style.borderRadius = 12

                updateButton.addEventListener("click", function() {
                    beginUpdate(item.id)
                });
                deleteButton.addEventListener("click", function(){
                    deleteDebt(item.id);
                });


                rowElement.appendChild(nameCellElement);
                rowElement.appendChild(amountCellElement);
                rowElement.appendChild(reasonCellElement);
                rowElement.appendChild(updateButton);
                rowElement.appendChild(deleteButton);

                tableBody.appendChild(rowElement);
            }
        }
    }
    xhr.open('GET', `${api}/debts`, true);
    xhr.send();
}

let deleteDebt = (id) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            loadTable(document.querySelector("table"));
        }
    };
    xhr.open('DELETE', `${api}/debts/${id}`, true);
    xhr.send();
};

let beginUpdate = (id) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            window.location.href = "/updateDebt";
        }
    };
    xhr.open('PUT', `${api}/updateDebts/${id}`, true);
    xhr.send();
}


function tryUpdateDebt(){
    updateDebt(nameEditInput.value, amountEditInput.value, reasonEditInput.value)
}

let updateDebt = (person, amount, reason) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            
            window.location.href = "/";
            loadTable(document.querySelector("table"));
        
        }
    };
    xhr.open('PUT', `${api}/debts`, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify({ person, amount, reason }));
}

loadTable(document.querySelector("table"));