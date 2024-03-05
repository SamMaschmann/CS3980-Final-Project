let nameInput = document.getElementById('name')
let amountInput = document.getElementById('amount')
let reasonInput = document.getElementById('reason')

let nameEditInput = document.getElementById('name-edit')
let amountEditInput = document.getElementById('amount-edit')
let reasonEditInput = document.getElementById('reason-edit')

const api = 'http://127.0.0.1:8000';

function tryAdd() {
    addDebt(nameInput.value, amountInput.value, reasonInput.value);
}

let addDebt = (person, amount, reason) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 201) {
            alert("Success!")
            window.location.href = "/";
        }
    }
    xhr.open('POST', `${api}/debts`, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify({ person, amount, reason }));
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

                rowElement.appendChild(nameCellElement);
                rowElement.appendChild(amountCellElement);
                rowElement.appendChild(reasonCellElement);

                tableBody.appendChild(rowElement);
            }
        }
    }
    xhr.open('GET', `${api}/debts`, true);
    xhr.send();
    

    const tableBody = table.querySelector("tbody");

    tableBody.innerHTML = "";
    for (const item of data) {
        const rowElement = document.createElement("tr");

        const nameCellElement = document.createElement("td");
        const amountCellElement = document.createElement("td");
        const reasonCellElement = document.createElement("td");

        nameCellElement.textContent = item.person
        amountCellElement.textContent = item.amount
        reasonCellElement.textContent = item.reason

        rowElement.appendChild(nameCellElement);
        rowElement.appendChild(amountCellElement);
        rowElement.appendChild(reasonCellElement);

        tableBody.appendChild(rowElement)
    }

}

loadTable(document.querySelector("table"));