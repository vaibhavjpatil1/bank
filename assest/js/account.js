
/* Default Account Data */

let accounts = JSON.parse(localStorage.getItem("bankAccounts"));

if (!accounts) {
    accounts = [
        {
            holder: "Vaibhav Jadhav",
            number: "123456789012",
            type: "Savings",
            balance: 42750
        },
        {
            holder: "Vaibhav Jadhav",
            number: "123456789013",
            type: "Current",
            balance: 18230
        },
        {
            holder: "Vaibhav Jadhav",
            number: "123456789014",
            type: "Fixed Deposit",
            balance: 100000
        }
    ];

    saveAccounts();
}


/* Save Data */

function saveAccounts() {
    localStorage.setItem("bankAccounts", JSON.stringify(accounts));
}


/* Display Accounts */

function displayAccounts() {

    let container = document.getElementById("accountsGrid");

    container.innerHTML = "";

    let total = 0;

    accounts.forEach((account, index) => {

        total += Number(account.balance);

        let icon = account.type === "Savings" ? "💳" :
                   account.type === "Current" ? "💵" : "🐷";

        let box = document.createElement("div");
        box.className = "account-box";

        let top = document.createElement("div");
        top.className = "account-top";

        let iconBox = document.createElement("div");
        iconBox.className = "account-icon";
        iconBox.textContent = icon;

        let type = document.createElement("div");
        type.className = "account-type";
        type.textContent = account.type + " Account";

        top.append(iconBox, type);

        let holder = document.createElement("p");
        holder.textContent = "Account Holder: " + account.holder;

        let number = document.createElement("p");
        number.textContent = "Account No: •••• " + account.number.slice(-4);

        let balance = document.createElement("h2");
        balance.textContent = Number(account.balance).toLocaleString(
            "en-IN",
            { style: "currency", currency: "INR" }
        );

        let actions = document.createElement("div");
        actions.className = "account-actions";

        let view = document.createElement("button");
        view.className = "view-btn";
        view.textContent = "View";
        view.onclick = () => viewAccount(index);

        let edit = document.createElement("button");
        edit.className = "edit-btn";
        edit.textContent = "Edit";
        edit.onclick = () => editAccount(index);

        let del = document.createElement("button");
        del.className = "delete-btn";
        del.textContent = "Delete";
        del.onclick = () => deleteAccount(index);

        actions.append(view, edit, del);

        box.append(top, holder, number, balance, actions);

        container.appendChild(box);

    });

    document.getElementById("totalBalance").textContent =
        total.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR"
        });

    saveAccounts();
}


/* Open Form */

function openForm() {

    document.getElementById("accountForm").reset();

    document.getElementById("editIndex").value = "";

    document.getElementById("formTitle").textContent =
        "Add New Account";

    document.getElementById("accountModal").style.display = "flex";

}


/* Close Form */

function closeForm() {
    document.getElementById("accountModal").style.display = "none";
}


/* Add and Update Account */

document.getElementById("accountForm").addEventListener("submit", function(e) {

    e.preventDefault();

    let holder = document.getElementById("holderName").value.trim();

    let number = document.getElementById("accountNumber").value.trim();

    let type = document.getElementById("accountType").value;

    let balance = Number(document.getElementById("accountBalance").value);

    let editIndex = document.getElementById("editIndex").value;

    if (!holder || !/^\d{12}$/.test(number) ||
        !type || !Number.isFinite(balance) || balance < 0) {

        alert("Please enter valid account details.");
        return;

    }

    let duplicate = accounts.some((account, index) =>
        account.number === number && String(index) !== editIndex
    );

    if (duplicate) {
        alert("Account number already exists!");
        return;
    }

    let accountData = {
        holder: holder,
        number: number,
        type: type,
        balance: balance
    };

    if (editIndex !== "") {

        accounts[Number(editIndex)] = accountData;

        alert("Account updated successfully!");

    } else {

        accounts.push(accountData);

        alert("New account added successfully!");

    }

    saveAccounts();

    displayAccounts();

    closeForm();

});


/* Edit Account */

function editAccount(index) {

    let account = accounts[index];

    document.getElementById("editIndex").value = index;

    document.getElementById("holderName").value = account.holder;

    document.getElementById("accountNumber").value = account.number;

    document.getElementById("accountType").value = account.type;

    document.getElementById("accountBalance").value = account.balance;

    document.getElementById("formTitle").textContent =
        "Edit Account";

    document.getElementById("accountModal").style.display = "flex";

}


/* Delete Account */

function deleteAccount(index) {

    let confirmDelete = confirm(
        "Are you sure you want to delete this account?"
    );

    if (confirmDelete) {

        accounts.splice(index, 1);

        saveAccounts();

        displayAccounts();

        alert("Account deleted successfully!");

    }

}


/* View Account */

function viewAccount(index) {

    let account = accounts[index];

    document.getElementById("accountDetails").innerHTML = `
        <p><strong>Account Holder:</strong> ${escapeHTML(account.holder)}</p>
        <p><strong>Account Number:</strong> ${escapeHTML(account.number)}</p>
        <p><strong>Account Type:</strong> ${escapeHTML(account.type)}</p>
        <p><strong>Available Balance:</strong> ₹${Number(account.balance).toLocaleString("en-IN")}</p>
        <p><strong>Status:</strong> Active (Demo)</p>
    `;

    document.getElementById("detailsModal").style.display = "flex";

}


/* Escape HTML */

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}


/* Close Details */

function closeDetails() {
    document.getElementById("detailsModal").style.display = "none";
}


/* Sidebar */

function toggleSidebar() {
    document.querySelector(".sidebar").classList.toggle("show");
}


/* Initial Display */

displayAccounts();
