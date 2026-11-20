
/* Display Current Date */

const dateElement = document.getElementById("date");

const today = new Date();

dateElement.innerHTML = today.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
});


/* Toggle Sidebar */

function toggleSidebar() {
    document.querySelector(".sidebar").classList.toggle("show");
}


/* Search Transactions */

function searchTransactions() {

    let input = document.getElementById("search").value.toLowerCase();

    let rows = document.querySelectorAll("#transactionBody tr");

    rows.forEach(function(row) {

        let text = row.innerText.toLowerCase();

        if (text.includes(input)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }

    });

}


/* Quick Actions */

function quickAction(action) {

    if (action === "Check Balance") {
        alert("Your Total Balance: ₹60,980.00");
    }

    else if (action === "Send Money") {
        alert("Send Money option selected!");
    }

    else if (action === "Scan & Pay") {
        alert("Scan & Pay option selected!");
    }

    else if (action === "Recharge") {
        alert("Recharge option selected!");
    }

    else if (action === "Bill Payment") {
        alert("Bill Payment option selected!");
    }

    else {
        alert("More Banking Services");
    }

}


/* View All Transactions */

function showAllTransactions() {

    alert("You are viewing all available demo transactions.");

}


/* Enable Security */

function enableSecurity() {

    alert("Two-Factor Authentication demo enabled!");

}


/* Logout */

function logout() {

    let confirmLogout = confirm("Are you sure you want to logout?");

    if (confirmLogout) {
        alert("Logged out successfully!");
    }

}


/* Account Overview Chart */

const ctx = document.getElementById("accountChart");

new Chart(ctx, {

    type: "doughnut",

    data: {

        labels: [
            "Savings Account",
            "Current Account",
            "Fixed Deposit"
        ],

        datasets: [{
            data: [60, 25, 15],
            backgroundColor: [
                "#0860df",
                "#00b58a",
                "#583cda"
            ],
            borderWidth: 0
        }]

    },

    options: {

        responsive: true,

        maintainAspectRatio: true,

        cutout: "65%",

        plugins: {

            legend: {
                display: false
            }

        }

    }

});
