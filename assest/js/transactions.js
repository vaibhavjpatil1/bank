
const STORAGE_KEY = "bankTransactions";

let transactions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
    {
        id: 1,
        description: "Monthly Salary",
        category: "Salary",
        type: "Credit",
        amount: 35000,
        date: "2026-11-01"
    },
    {
        id: 2,
        description: "Shopping",
        category: "Shopping",
        type: "Debit",
        amount: 2500,
        date: "2026-11-05"
    },
    {
        id: 3,
        description: "Electricity Bill",
        category: "Bills",
        type: "Debit",
        amount: 1200,
        date: "2026-11-08"
    },
    {
        id: 4,
        description: "Money Received",
        category: "Transfer",
        type: "Credit",
        amount: 5000,
        date: "2026-11-10"
    }
];

function saveTransactions() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function formatCurrency(amount) {
    return "₹" + Number(amount).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[char];
    });
}

// Display Transactions
function displayTransactions() {

    const table = document.getElementById("transactionTable");
    const search = document.getElementById("searchInput").value.toLowerCase();
    const typeFilter = document.getElementById("typeFilter").value;
    const categoryFilter = document.getElementById("categoryFilter").value;

    let filtered = transactions.filter(function (item) {

        const matchesSearch = item.description.toLowerCase().includes(search);
        const matchesType = typeFilter === "All" || item.type === typeFilter;
        const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;

        return matchesSearch && matchesType && matchesCategory;
    });

    table.innerHTML = "";

    if (filtered.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="6" class="empty-message">
                    No transactions found.
                </td>
            </tr>
        `;
    } else {

        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

        filtered.forEach(function (item) {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${escapeHTML(item.date)}</td>
                <td>${escapeHTML(item.description)}</td>
                <td>${escapeHTML(item.category)}</td>
                <td class="${item.type === "Credit" ? "credit" : "debit"}">
                    ${escapeHTML(item.type)}
                </td>
                <td class="${item.type === "Credit" ? "credit" : "debit"}">
                    ${item.type === "Credit" ? "+" : "-"}${formatCurrency(item.amount)}
                </td>
                <td>
                    <button class="action-btn edit-btn"
                        onclick="editTransaction(${item.id})">Edit</button>

                    <button class="action-btn delete-btn"
                        onclick="deleteTransaction(${item.id})">Delete</button>
                </td>
            `;

            table.appendChild(row);
        });
    }

    updateSummary();
}

// Update Summary
function updateSummary() {

    const total = transactions.length;

    const credit = transactions
        .filter(item => item.type === "Credit")
        .reduce((sum, item) => sum + Number(item.amount), 0);

    const debit = transactions
        .filter(item => item.type === "Debit")
        .reduce((sum, item) => sum + Number(item.amount), 0);

    document.getElementById("totalTransactions").textContent = total;
    document.getElementById("totalCredit").textContent = formatCurrency(credit);
    document.getElementById("totalDebit").textContent = formatCurrency(debit);
}

// Open Add Form
function openForm() {

    document.getElementById("transactionForm").reset();
    document.getElementById("transactionId").value = "";

    document.getElementById("modalTitle").textContent = "Add Transaction";

    document.getElementById("transactionDate").value =
        new Date().toISOString().split("T")[0];

    document.getElementById("transactionModal").style.display = "flex";
}

// Close Form
function closeForm() {
    document.getElementById("transactionModal").style.display = "none";
}

// Add or Update Transaction
document.getElementById("transactionForm").addEventListener("submit", function (e) {

    e.preventDefault();

    const id = document.getElementById("transactionId").value;

    const description = document.getElementById("description").value.trim();
    const category = document.getElementById("category").value;
    const type = document.getElementById("transactionType").value;
    const amount = Number(document.getElementById("amount").value);
    const date = document.getElementById("transactionDate").value;

    if (!description || !category || !type || !date || !Number.isFinite(amount) || amount <= 0) {
        alert("Please enter valid transaction details.");
        return;
    }

    const transactionData = {
        description,
        category,
        type,
        amount,
        date
    };

    if (id) {

        const index = transactions.findIndex(item => item.id === Number(id));

        if (index !== -1) {
            transactions[index] = {
                ...transactions[index],
                ...transactionData
            };
        }

        alert("Transaction updated successfully!");

    } else {

        transactions.push({
            id: Date.now(),
            ...transactionData
        });

        alert("Transaction added successfully!");
    }

    saveTransactions();
    displayTransactions();
    closeForm();
});

// Edit Transaction
function editTransaction(id) {

    const item = transactions.find(item => item.id === id);

    if (!item) return;

    document.getElementById("transactionId").value = item.id;
    document.getElementById("description").value = item.description;
    document.getElementById("category").value = item.category;
    document.getElementById("transactionType").value = item.type;
    document.getElementById("amount").value = item.amount;
    document.getElementById("transactionDate").value = item.date;

    document.getElementById("modalTitle").textContent = "Edit Transaction";

    document.getElementById("transactionModal").style.display = "flex";
}

// Delete Transaction
function deleteTransaction(id) {

    const confirmDelete = confirm("Are you sure you want to delete this transaction?");

    if (confirmDelete) {

        transactions = transactions.filter(item => item.id !== id);

        saveTransactions();
        displayTransactions();

        alert("Transaction deleted successfully!");
    }
}

// Sidebar Toggle
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("show");
}

// Initial Display
saveTransactions();
displayTransactions();
