
const STORAGE_KEY = "bankSupportTickets";

let tickets = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Save Tickets
function saveTickets() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
}

// Escape HTML
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

// Submit Ticket
document.getElementById("ticketForm").addEventListener("submit", function (e) {

    e.preventDefault();

    const name = document.getElementById("customerName").value.trim();
    const email = document.getElementById("customerEmail").value.trim();
    const category = document.getElementById("issueCategory").value;
    const priority = document.getElementById("priority").value;
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !category || !priority || !subject || !message) {
        alert("Please fill all required fields.");
        return;
    }

    const ticket = {
        id: "TKT" + Date.now(),
        name: name,
        email: email,
        category: category,
        priority: priority,
        subject: subject,
        message: message,
        date: new Date().toLocaleDateString("en-IN"),
        status: "Open"
    };

    tickets.push(ticket);

    saveTickets();
    displayTickets();

    document.getElementById("ticketForm").reset();

    alert("Support ticket submitted successfully!\nTicket ID: " + ticket.id);
});

// Display Tickets
function displayTickets() {

    const table = document.getElementById("ticketTable");

    const search = document.getElementById("ticketSearch").value.toLowerCase();

    const filteredTickets = tickets.filter(function (ticket) {

        return (
            ticket.id.toLowerCase().includes(search) ||
            ticket.subject.toLowerCase().includes(search) ||
            ticket.category.toLowerCase().includes(search)
        );
    });

    table.innerHTML = "";

    if (filteredTickets.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7" class="empty-ticket">
                    No support tickets found.
                </td>
            </tr>
        `;

        return;
    }

    filteredTickets.slice().reverse().forEach(function (ticket) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHTML(ticket.id)}</td>

            <td>${escapeHTML(ticket.subject)}</td>

            <td>${escapeHTML(ticket.category)}</td>

            <td class="priority-${ticket.priority.toLowerCase()}">
                ${escapeHTML(ticket.priority)}
            </td>

            <td>${escapeHTML(ticket.date)}</td>

            <td>
                <span class="ticket-status">
                    ${escapeHTML(ticket.status)}
                </span>
            </td>

            <td>
                <button class="delete-ticket-btn"
                    onclick="deleteTicket('${ticket.id}')">
                    Delete
                </button>
            </td>
        `;

        table.appendChild(row);
    });
}

// Delete Ticket
function deleteTicket(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this support ticket?"
    );

    if (!confirmDelete) return;

    tickets = tickets.filter(ticket => ticket.id !== id);

    saveTickets();
    displayTickets();

    alert("Support ticket deleted successfully!");
}

// FAQ Toggle
function toggleFAQ(button) {

    const currentItem = button.parentElement;

    const wasOpen = currentItem.classList.contains("active");

    document.querySelectorAll(".faq-item").forEach(function (item) {
        item.classList.remove("active");
        item.querySelector(".faq-question span").textContent = "+";
    });

    if (!wasOpen) {
        currentItem.classList.add("active");
        button.querySelector("span").textContent = "−";
    }
}

// Sidebar Toggle
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("show");
}

// Initial Display
displayTickets();
