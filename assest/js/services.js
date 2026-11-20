
const services = [
    {
        id: 1,
        name: "Savings Account",
        category: "Accounts",
        icon: "💰",
        description: "Open a savings account and manage your money securely."
    },
    {
        id: 2,
        name: "Current Account",
        category: "Accounts",
        icon: "🏦",
        description: "A banking account designed for business transactions."
    },
    {
        id: 3,
        name: "Debit Card",
        category: "Cards",
        icon: "💳",
        description: "Request a debit card for easy everyday payments."
    },
    {
        id: 4,
        name: "Credit Card",
        category: "Cards",
        icon: "💎",
        description: "Apply for a credit card with exciting benefits."
    },
    {
        id: 5,
        name: "Personal Loan",
        category: "Loans",
        icon: "💵",
        description: "Explore personal loan options for your financial needs."
    },
    {
        id: 6,
        name: "Home Loan",
        category: "Loans",
        icon: "🏠",
        description: "Get assistance with financing your dream home."
    },
    {
        id: 7,
        name: "Mobile Banking",
        category: "Digital Banking",
        icon: "📱",
        description: "Access banking services using your mobile device."
    },
    {
        id: 8,
        name: "Internet Banking",
        category: "Digital Banking",
        icon: "🌐",
        description: "Manage your account through online banking."
    },
    {
        id: 9,
        name: "Cheque Book",
        category: "Accounts",
        icon: "📒",
        description: "Request a new cheque book for your account."
    }
];

const STORAGE_KEY = "bankServiceApplications";

let applications = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Save Applications
function saveApplications() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
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

// Display Services
function displayServices() {

    const grid = document.getElementById("serviceGrid");

    const search = document.getElementById("serviceSearch").value.toLowerCase();

    const category = document.getElementById("serviceCategory").value;

    const filteredServices = services.filter(function (service) {

        const matchesSearch =
            service.name.toLowerCase().includes(search) ||
            service.description.toLowerCase().includes(search);

        const matchesCategory =
            category === "All" || service.category === category;

        return matchesSearch && matchesCategory;
    });

    grid.innerHTML = "";

    if (filteredServices.length === 0) {
        grid.innerHTML = `<p class="no-services">No services found.</p>`;
        return;
    }

    filteredServices.forEach(function (service) {

        const card = document.createElement("div");

        card.className = "service-card";

        card.innerHTML = `
            <div class="service-icon">${service.icon}</div>

            <span class="service-category">
                ${escapeHTML(service.category)}
            </span>

            <h3>${escapeHTML(service.name)}</h3>

            <p>${escapeHTML(service.description)}</p>

            <button class="apply-btn" onclick="openApplicationForm(${service.id})">
                Apply Now →
            </button>
        `;

        grid.appendChild(card);
    });
}

// Open Application Form
function openApplicationForm(serviceId) {

    const service = services.find(item => item.id === serviceId);

    if (!service) return;

    document.getElementById("applicationForm").reset();

    document.getElementById("serviceName").value = service.name;
    document.getElementById("selectedService").value = service.name;

    document.getElementById("applicationModal").style.display = "flex";
}

// Close Application Form
function closeApplicationForm() {
    document.getElementById("applicationModal").style.display = "none";
}

// Submit Application
document.getElementById("applicationForm").addEventListener("submit", function (e) {

    e.preventDefault();

    const name = document.getElementById("customerName").value.trim();
    const email = document.getElementById("customerEmail").value.trim();
    const mobile = document.getElementById("customerMobile").value.trim();
    const service = document.getElementById("serviceName").value;
    const details = document.getElementById("additionalDetails").value.trim();

    if (!name || !email || !/^[6-9][0-9]{9}$/.test(mobile)) {
        alert("Please enter valid application details.");
        return;
    }

    const application = {
        id: "APP" + Date.now(),
        service: service,
        name: name,
        email: email,
        mobile: mobile,
        details: details,
        date: new Date().toLocaleDateString("en-IN"),
        status: "Pending"
    };

    applications.push(application);

    saveApplications();
    displayApplications();

    closeApplicationForm();

    alert("Your application has been submitted successfully!");
});

// Display Applications
function displayApplications() {

    const table = document.getElementById("applicationTable");

    table.innerHTML = "";

    if (applications.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;padding:25px;">
                    No applications submitted yet.
                </td>
            </tr>
        `;

    } else {

        applications.forEach(function (app) {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${escapeHTML(app.id)}</td>
                <td>${escapeHTML(app.service)}</td>
                <td>${escapeHTML(app.name)}</td>
                <td>${escapeHTML(app.date)}</td>
                <td><span class="status">${escapeHTML(app.status)}</span></td>
                <td>
                    <button class="delete-btn" onclick="deleteApplication('${app.id}')">
                        Delete
                    </button>
                </td>
            `;

            table.appendChild(row);
        });
    }

    updateStatistics();
}

// Delete Application
function deleteApplication(id) {

    const confirmDelete = confirm("Are you sure you want to delete this application?");

    if (confirmDelete) {

        applications = applications.filter(app => app.id !== id);

        saveApplications();
        displayApplications();

        alert("Application deleted successfully!");
    }
}

// Update Statistics
function updateStatistics() {

    document.getElementById("totalServices").textContent = services.length;

    document.getElementById("totalApplications").textContent =
        applications.length;

    const pending = applications.filter(app => app.status === "Pending").length;

    document.getElementById("pendingApplications").textContent = pending;
}

// Sidebar Toggle
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("show");
}

// Initial Load
displayServices();
displayApplications();

// Close modal when clicking outside
document.getElementById("applicationModal").addEventListener("click", function (e) {
    if (e.target === this) {
        closeApplicationForm();
    }
});
