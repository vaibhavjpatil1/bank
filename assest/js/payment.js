
/* Load Payment History */

let payments = JSON.parse(
    localStorage.getItem("bankPayments")
) || [];


/* Save Payments */

function savePayments() {
    localStorage.setItem(
        "bankPayments",
        JSON.stringify(payments)
    );
}


/* Select Payment Type */

function selectPayment(type) {

    document.getElementById("paymentType").value = type;

    document.getElementById("paymentForm").scrollIntoView({
        behavior: "smooth"
    });

}


/* Make Payment - Demo Only */

document.getElementById("paymentForm")
.addEventListener("submit", function(e) {

    e.preventDefault();

    let type = document.getElementById("paymentType").value;

    let recipient = document.getElementById("recipient").value.trim();

    let receiverDetails = document.getElementById("receiverDetails").value.trim();

    let amount = Number(document.getElementById("amount").value);

    let description = document.getElementById("description").value.trim();

    if (!type || !recipient || !receiverDetails ||
        !Number.isFinite(amount) || amount <= 0) {

        alert("Please enter valid payment details.");
        return;

    }

    let confirmPayment = confirm(
        "Confirm DEMO payment of ₹" + amount.toFixed(2) +
        " to " + recipient + "?"
    );

    if (!confirmPayment) return;

    let payment = {

        id: Date.now(),

        date: new Date().toLocaleDateString("en-IN"),

        recipient: recipient,

        receiverDetails: receiverDetails,

        type: type,

        amount: amount,

        description: description,

        status: "Successful"

    };

    payments.unshift(payment);

    savePayments();

    displayPayments();

    document.getElementById("paymentForm").reset();

    alert("Demo payment recorded successfully!");

});


/* Display Payments */

function displayPayments() {

    let table = document.getElementById("paymentTable");

    table.innerHTML = "";

    if (payments.length === 0) {

        let row = document.createElement("tr");
        let cell = document.createElement("td");

        cell.colSpan = 6;
        cell.textContent = "No payment records found.";
        cell.style.textAlign = "center";

        row.appendChild(cell);
        table.appendChild(row);

        return;
    }

    payments.forEach(function(payment) {

        let row = document.createElement("tr");

        let date = document.createElement("td");
        date.textContent = payment.date;

        let recipient = document.createElement("td");
        recipient.textContent = payment.recipient;

        let type = document.createElement("td");
        type.textContent = payment.type;

        let amount = document.createElement("td");
        amount.textContent = "₹" +
            Number(payment.amount).toLocaleString("en-IN");

        let status = document.createElement("td");

        let statusBadge = document.createElement("span");
        statusBadge.className = "payment-status";
        statusBadge.textContent = payment.status;

        status.appendChild(statusBadge);

        let action = document.createElement("td");

        let deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-payment";
        deleteBtn.textContent = "Delete";

        deleteBtn.onclick = function() {
            deletePayment(payment.id);
        };

        action.appendChild(deleteBtn);

        row.append(date, recipient, type, amount, status, action);

        table.appendChild(row);

    });

}


/* Delete Payment */

function deletePayment(id) {

    let confirmDelete = confirm(
        "Do you want to delete this payment record?"
    );

    if (confirmDelete) {

        payments = payments.filter(function(payment) {
            return payment.id !== id;
        });

        savePayments();

        displayPayments();

        alert("Payment record deleted!");

    }

}


/* Search Payments */

function searchPayments() {

    let search = document.getElementById("paymentSearch")
        .value.toLowerCase();

    let rows = document.querySelectorAll("#paymentTable tr");

    rows.forEach(function(row) {

        let text = row.innerText.toLowerCase();

        row.style.display = text.includes(search) ? "" : "none";

    });

}


/* Sidebar */

function toggleSidebar() {

    document.querySelector(".sidebar")
        .classList.toggle("show");

}


/* Initial Display */

displayPayments();
