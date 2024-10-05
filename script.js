let entries = JSON.parse(localStorage.getItem('entries')) || [];
const entryList = document.getElementById('entryList');
const totalIncome = document.getElementById('totalIncome');
const totalExpenses = document.getElementById('totalExpenses');
const netBalance = document.getElementById('netBalance');

document.getElementById('addEntry').addEventListener('click', addEntry);
document.querySelectorAll('input[name="filter"]').forEach(input => {
    input.addEventListener('change', filterEntries);
});

// Load entries on page load
document.addEventListener('DOMContentLoaded', () => {
    displayEntries();
    calculateTotals();
});

function addEntry() {
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;

    if (!description || isNaN(amount)) return;

    const entry = { description, amount, type, id: Date.now() };
    entries.push(entry);
    localStorage.setItem('entries', JSON.stringify(entries));
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';

    displayEntries();
    calculateTotals();
}

function displayEntries() {
    const filter = document.querySelector('input[name="filter"]:checked').value;
    entryList.innerHTML = '';

    entries
        .filter(entry => filter === 'all' || entry.type === filter)
        .forEach(entry => {
            const li = document.createElement('li');
            li.innerHTML = `
            <div><span>${entry.description} - $${entry.amount.toFixed(2)} (${entry.type})</span></div>
            <div> <button onclick="editEntry(${entry.id})">Edit</button>
                <button onclick="deleteEntry(${entry.id})">Delete</button></div>   
            `;
            entryList.appendChild(li);
        });
}

function calculateTotals() {
    const totalIncomeVal = entries.reduce((sum, entry) => entry.type === 'income' ? sum + entry.amount : sum, 0);
    const totalExpensesVal = entries.reduce((sum, entry) => entry.type === 'expense' ? sum + entry.amount : sum, 0);
    const netBalanceVal = totalIncomeVal - totalExpensesVal;

    totalIncome.textContent = totalIncomeVal.toFixed(2);
    totalExpenses.textContent = totalExpensesVal.toFixed(2);
    netBalance.textContent = netBalanceVal.toFixed(2);
}

function deleteEntry(id) {
    entries = entries.filter(entry => entry.id !== id);
    localStorage.setItem('entries', JSON.stringify(entries));
    displayEntries();
    calculateTotals();
}

function editEntry(id) {
    const entry = entries.find(entry => entry.id === id);
    if (entry) {
        document.getElementById('description').value = entry.description;
        document.getElementById('amount').value = entry.amount;
        document.getElementById('type').value = entry.type;
        deleteEntry(id); // Remove entry for editing
    }
}

function filterEntries() {
    displayEntries();
}
