
const offers = [
    {
        id: 1,
        name: "Shopping Discount",
        category: "Shopping",
        icon: "🛍️",
        discount: "20% OFF",
        description: "Enjoy a discount on selected online shopping purchases.",
        code: "SHOP20",
        expiry: "30 November 2026"
    },
    {
        id: 2,
        name: "Travel Special",
        category: "Travel",
        icon: "✈️",
        discount: "15% OFF",
        description: "Save on selected flight and travel bookings.",
        code: "TRAVEL15",
        expiry: "15 December 2026"
    },
    {
        id: 3,
        name: "Food & Dining",
        category: "Food",
        icon: "🍕",
        discount: "25% OFF",
        description: "Get a discount on selected food and dining orders.",
        code: "FOOD25",
        expiry: "20 December 2026"
    },
    {
        id: 4,
        name: "Banking Rewards",
        category: "Banking",
        icon: "🏦",
        discount: "₹500 BONUS",
        description: "Explore a demo reward for eligible banking activities.",
        code: "BANK500",
        expiry: "31 December 2026"
    },
    {
        id: 5,
        name: "Movie Offer",
        category: "Entertainment",
        icon: "🎬",
        discount: "30% OFF",
        description: "Enjoy savings on selected movie ticket bookings.",
        code: "MOVIE30",
        expiry: "25 December 2026"
    },
    {
        id: 6,
        name: "Online Shopping",
        category: "Shopping",
        icon: "🎁",
        discount: "₹300 OFF",
        description: "Save on selected online purchases.",
        code: "SAVE300",
        expiry: "31 December 2026"
    },
    {
        id: 7,
        name: "Hotel Booking",
        category: "Travel",
        icon: "🏨",
        discount: "10% OFF",
        description: "Get a discount on selected hotel reservations.",
        code: "HOTEL10",
        expiry: "31 December 2026"
    },
    {
        id: 8,
        name: "Restaurant Deal",
        category: "Food",
        icon: "🍽️",
        discount: "₹200 OFF",
        description: "Enjoy a demo discount at selected restaurants.",
        code: "DINE200",
        expiry: "20 December 2026"
    },
    {
        id: 9,
        name: "Entertainment Deal",
        category: "Entertainment",
        icon: "🎮",
        discount: "20% OFF",
        description: "Save on selected entertainment purchases.",
        code: "PLAY20",
        expiry: "31 December 2026"
    }
];

const STORAGE_KEY = "bankClaimedOffers";

let claimedOffers = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Save Claimed Offers
function saveClaimedOffers() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(claimedOffers));
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

// Check if Offer is Claimed
function isClaimed(id) {
    return claimedOffers.some(item => item.id === id);
}

// Display Offers
function displayOffers() {

    const grid = document.getElementById("offerGrid");

    const search = document.getElementById("offerSearch").value.toLowerCase();

    const category = document.getElementById("offerCategory").value;

    const filteredOffers = offers.filter(function (offer) {

        const matchesSearch =
            offer.name.toLowerCase().includes(search) ||
            offer.description.toLowerCase().includes(search);

        const matchesCategory =
            category === "All" || offer.category === category;

        return matchesSearch && matchesCategory;
    });

    grid.innerHTML = "";

    if (filteredOffers.length === 0) {
        grid.innerHTML = `<p class="no-offers">No offers found.</p>`;
        return;
    }

    filteredOffers.forEach(function (offer) {

        const claimed = isClaimed(offer.id);

        const card = document.createElement("div");

        card.className = "offer-card";

        card.innerHTML = `
            <div class="offer-card-top">
                <div class="offer-icon">${offer.icon}</div>
                <span class="discount-label">
                    ${escapeHTML(offer.discount)}
                </span>
            </div>

            <div class="offer-card-body">

                <span class="offer-category">
                    ${escapeHTML(offer.category)}
                </span>

                <h3>${escapeHTML(offer.name)}</h3>

                <p>${escapeHTML(offer.description)}</p>

                <div class="offer-code">
                    <strong>${escapeHTML(offer.code)}</strong>

                    <button class="copy-btn"
                        onclick="copyCoupon('${offer.code}')">
                        Copy
                    </button>
                </div>

                <button class="claim-btn"
                    onclick="claimOffer(${offer.id})"
                    ${claimed ? "disabled" : ""}>
                    ${claimed ? "✓ Already Claimed" : "Claim Offer"}
                </button>

                <div class="offer-expiry">
                    ⏰ Valid until ${escapeHTML(offer.expiry)}
                </div>

            </div>
        `;

        grid.appendChild(card);
    });
}

// Claim Offer
function claimOffer(id) {

    const offer = offers.find(item => item.id === id);

    if (!offer || isClaimed(id)) {
        return;
    }

    const confirmClaim = confirm(
        "Do you want to claim the " + offer.name + " offer?"
    );

    if (!confirmClaim) return;

    claimedOffers.push({
        id: offer.id,
        name: offer.name,
        category: offer.category,
        code: offer.code,
        date: new Date().toLocaleDateString("en-IN")
    });

    saveClaimedOffers();

    displayOffers();
    displayClaimedOffers();

    alert("Offer claimed successfully!");
}

// Copy Coupon Code
function copyCoupon(code) {

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(code)
            .then(() => alert("Coupon code copied: " + code))
            .catch(() => fallbackCopy(code));
    } else {
        fallbackCopy(code);
    }
}

// Fallback Copy
function fallbackCopy(code) {

    const textArea = document.createElement("textarea");

    textArea.value = code;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";

    document.body.appendChild(textArea);

    textArea.select();

    try {
        document.execCommand("copy");
        alert("Coupon code copied: " + code);
    } catch (error) {
        alert("Copy failed. Please copy manually: " + code);
    }

    textArea.remove();
}

// Display Claimed Offers
function displayClaimedOffers() {

    const table = document.getElementById("claimedTable");

    table.innerHTML = "";

    if (claimedOffers.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;padding:25px;">
                    No offers claimed yet.
                </td>
            </tr>
        `;

    } else {

        claimedOffers.forEach(function (offer) {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${escapeHTML(offer.name)}</td>
                <td><strong>${escapeHTML(offer.code)}</strong></td>
                <td>${escapeHTML(offer.category)}</td>
                <td>${escapeHTML(offer.date)}</td>
                <td>
                    <button class="remove-btn"
                        onclick="removeClaimedOffer(${offer.id})">
                        Remove
                    </button>
                </td>
            `;

            table.appendChild(row);
        });
    }

    updateStatistics();
}

// Remove Claimed Offer
function removeClaimedOffer(id) {

    const confirmDelete = confirm("Remove this claimed offer?");

    if (!confirmDelete) return;

    claimedOffers = claimedOffers.filter(item => item.id !== id);

    saveClaimedOffers();

    displayOffers();
    displayClaimedOffers();
}

// Update Statistics
function updateStatistics() {

    document.getElementById("totalOffers").textContent = offers.length;

    document.getElementById("claimedOffers").textContent =
        claimedOffers.length;

    const categories = new Set(offers.map(item => item.category));

    document.getElementById("totalCategories").textContent =
        categories.size;
}

// Sidebar Toggle
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("show");
}

// Initial Display
displayOffers();
displayClaimedOffers();
