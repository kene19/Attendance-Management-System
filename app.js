const attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || {};
const storedViewDate = localStorage.getItem('viewDate');
const viewDate = document.getElementById('viewDate');
const bgcolor = "rgba(75, 224, 37, 0.671)";
const vidate = new Date();
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let y = vidate.getFullYear();
let m = months[vidate.getMonth()];
let d = vidate.getDate();
document.getElementById("show").innerHTML = `${m} / ${d} / ${y}`;

if (storedViewDate) {
    viewDate.value = storedViewDate;
    updateTable();
}

document.getElementById('attendanceForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const id = document.getElementById('id').value;
    const dateInput = document.querySelector('.date');
    const date = dateInput.value;

    if (date === '') {
        dateInput.classList.add("inval");
        console.log("Please enter a date.");
    } else {
        dateInput.classList.remove("inval");
        localStorage.setItem('viewDate', date);
        addRecord(name, id, date);
        document.getElementById('attendanceForm').reset();
    }
});

viewDate.addEventListener('change', function () {
    localStorage.setItem("viewDate", viewDate.value);
    updateTable();
});

function addRecord(name, id, date) {
    if (!attendanceData[date]) {
        attendanceData[date] = [];
    }
    const checkboxStates = [false, false, false, false, false, false];

    attendanceData[date].push({ name, id, checkboxStates });

    localStorage.setItem('attendanceData', JSON.stringify(attendanceData));

    if (viewDate.value === date) {
        updateTable();
    }
}

function countChecked(checkboxStates) {
    return checkboxStates.filter(state => state).length;
}

function updateTable() {
    const tableBody = document.getElementById('attendanceTableBody');
    tableBody.innerHTML = '';

    if (attendanceData[viewDate.value]) {
        let count = 0;

        attendanceData[viewDate.value].forEach((record, index) => {
            const newRow = document.createElement('tr');
            const noCell = document.createElement('td');
            const nameCell = document.createElement('td');
            const idCell = document.createElement('td');
            const actionsCell = document.createElement('td');
            actionsCell.className = "Delete";

            count++;
            noCell.textContent = count;
            noCell.className = "noCell";
            nameCell.textContent = record.name;
            idCell.textContent = record.id;

            const deleteButton = document.createElement('img');
            deleteButton.src = "d.png";
            deleteButton.className = "delete";
            deleteButton.addEventListener('click', function () {
                deleteRecord(viewDate.value, index);
            });
            actionsCell.appendChild(deleteButton);

            newRow.appendChild(noCell);
            newRow.appendChild(nameCell);
            newRow.appendChild(idCell);
            newRow.appendChild(actionsCell);

            // Checkboxes
            for (let i = 0; i < 6; i++) {
                const checkboxCell = document.createElement('td');
                checkboxCell.className = 'checkbox';
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';

                checkbox.checked = record.checkboxStates[i];
                checkbox.addEventListener('click', () => {
                    record.checkboxStates[i] = checkbox.checked;
                    checkboxCell.style.backgroundColor = checkbox.checked ? bgcolor : "#fff";
                    updateCheckedCount(index, countChecked(record.checkboxStates));
                    localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
                });

                checkboxCell.appendChild(checkbox);
                if (record.checkboxStates[i]) {
                    checkboxCell.style.backgroundColor = bgcolor;
                }

                newRow.appendChild(checkboxCell);
            }

            // Checked Count
            const checkedCountCell = document.createElement('td');
            checkedCountCell.className = "CheckedCount";
            checkedCountCell.textContent = ` ${countChecked(record.checkboxStates)}/6`;
            newRow.appendChild(checkedCountCell);

            tableBody.appendChild(newRow);
        });
    } else {
        const noDataRow = document.createElement('tr');
        const noDataCell = document.createElement('td');
        noDataCell.colSpan = 11;
        noDataCell.className = "nodata";
        noDataCell.style.textAlign = 'center';
        noDataCell.textContent = 'No data...';
        noDataRow.appendChild(noDataCell);
        tableBody.appendChild(noDataRow);
    }
}

function updateCheckedCount(rowIndex, count) {
    const tableBody = document.getElementById('attendanceTableBody');
    const rows = tableBody.getElementsByTagName('tr');
    if (rows[rowIndex]) {
        const cells = rows[rowIndex].getElementsByTagName('td');
        if (cells[10]) {
            cells[10].textContent = `${count}/6`;

            console.log(count);
        }
    }
}

function deleteRecord(date, index) {
    attendanceData[date].splice(index, 1);
    if (attendanceData[date].length === 0) {
        delete attendanceData[date];
    }
    localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
    updateTable();
}

function searchRecords() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const tableBody = document.getElementById('attendanceTableBody');
    let count = 0;
    tableBody.innerHTML = '';

    if (attendanceData[viewDate.value]) {
        attendanceData[viewDate.value].filter(record =>
            record.name.toLowerCase().includes(searchTerm) || record.id.toLowerCase().includes(searchTerm)
        ).forEach((record, index) => {
            const newRow = document.createElement('tr');
            const noCell = document.createElement('td');
            const nameCell = document.createElement('td');
            const idCell = document.createElement('td');
            const actionsCell = document.createElement('td');
            actionsCell.className = "Delete";

            count++;
            noCell.textContent = count;
            noCell.className = "noCell";
            nameCell.textContent = record.name;
            idCell.textContent = record.id;

            // Actions
            const deleteButton = document.createElement('img');
            deleteButton.src = "d.png";
            deleteButton.className = "delete";
            deleteButton.addEventListener('click', function () {
                deleteRecord(viewDate.value, index);
            });
            actionsCell.appendChild(deleteButton);

            newRow.appendChild(noCell);
            newRow.appendChild(nameCell);
            newRow.appendChild(idCell);
            newRow.appendChild(actionsCell);

            // Checkboxes
            for (let i = 0; i < 6; i++) {
                const checkboxCell = document.createElement('td');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkboxCell.className = 'checkbox';
                checkbox.checked = record.checkboxStates[i];
                checkbox.addEventListener('click', () => {
                    record.checkboxStates[i] = checkbox.checked;
                    checkboxCell.style.backgroundColor = checkbox.checked ? bgcolor : "#fff";
                    localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
                    updateCheckedCount(index, countChecked(record.checkboxStates));
                });

                checkboxCell.appendChild(checkbox);
                if (record.checkboxStates[i]) {
                    checkboxCell.style.backgroundColor = bgcolor;
                }
                newRow.appendChild(checkboxCell);
            }

            // Checked Count
            const checkedCountCell = document.createElement('td');
            checkedCountCell.textContent = ` ${countChecked(record.checkboxStates)}/6`;

            newRow.appendChild(checkedCountCell);

            tableBody.appendChild(newRow);
        });
    } else {
        const noDataRow = document.createElement('tr');
        const noDataCell = document.createElement('td');
        noDataCell.colSpan = 11;
        noDataCell.className = "nodata";
        noDataCell.style.textAlign = 'center';
        noDataCell.textContent = 'No data...';
        noDataRow.appendChild(noDataCell);
        tableBody.appendChild(noDataRow);
    }
}
