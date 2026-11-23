// ==========================================
// SERVICES DATA
// ==========================================

const services = [

    {
        id: 1,
        name: "Home Cleaning",
        price: 499,
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80"
    },

    {
        id: 2,
        name: "Salon at Home",
        price: 699,
        image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"
    },

    {
        id: 3,
        name: "AC Repair",
        price: 399,
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"
    },

    {
        id: 4,
        name: "Plumbing Service",
        price: 349,
        image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=800&q=80"
        //"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn-2n2tHuvMPZiFRsh4dDefMD5Vhdf1Q-vSV-sw1jIWw&s"
    },

    {
        id: 5,
        name: "Car Wash",
        price: 299,
        image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn-2n2tHuvMPZiFRsh4dDefMD5Vhdf1Q-vSV-sw1jIWw&s"
    },

    {
        id: 6,
        name: "Electrician",
        price: 449,
        image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80"
    }

];


// ==========================================
// CART AND SELECTION ARRAYS
// ==========================================

let cart = [];

let selectedIds = [];


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const serviceGrid =
    document.getElementById("serviceGrid");

const cartItems =
    document.getElementById("cartItems");

const cartCount =
    document.getElementById("cartCount");

const totalAmount =
    document.getElementById("totalAmount");

const selectionText =
    document.getElementById("selectionText");

const toast =
    document.getElementById("toast");


// ==========================================
// FORMAT PRICE
// ==========================================

function formatPrice(amount) {

    return `₹${amount.toLocaleString("en-IN")}`;

}


// ==========================================
// SHOW TOAST MESSAGE
// ==========================================

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(function () {

        toast.classList.remove("show");

    }, 2200);

}


// ==========================================
// DISPLAY SERVICES
// ==========================================

function renderServices() {

    serviceGrid.innerHTML = "";


    services.forEach(function(service) {

        const isSelected =
            selectedIds.includes(service.id);


        const card =
            document.createElement("article");


        card.className = "service-card";


        card.dataset.id = service.id;


        card.innerHTML = `

            <img
                class="service-image"
                src="${service.image}"
                alt="${service.name}"
            >


            <div class="service-content">

                <h3>
                    ${service.name}
                </h3>


                <p>
                    Professional and reliable
                    service at your doorstep.
                </p>


                <div class="service-footer">

                    <span class="price">
                        ${formatPrice(service.price)}
                    </span>


                    <div class="service-actions">

                        <button
                            class="skip-btn"
                            data-action="skip"
                        >
                            Skip Item
                        </button>


                        <button
                            class="add-btn ${isSelected ? "selected" : ""}"
                            data-action="add"
                        >
                            ${isSelected ? "Selected" : "Add Item"}
                        </button>

                    </div>

                </div>

            </div>

        `;


        serviceGrid.appendChild(card);

    });

}


// ==========================================
// DISPLAY CART
// ==========================================

function renderCart() {

    cartCount.textContent =
        cart.length;


    // If cart is empty

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <div class="empty-icon">
                    🛒
                </div>

                <h2>
                    No items added yet
                </h2>

                <p>
                    Choose a service from the
                    right and add it to your cart.
                </p>

            </div>

        `;

    }


    // If cart has items

    else {

        cartItems.innerHTML = "";


        cart.forEach(function(item) {

            const cartItem =
                document.createElement("div");


            cartItem.className =
                "cart-item";


            cartItem.innerHTML = `

                <div>

                    <h3>
                        ${item.name}
                    </h3>

                    <p>
                        ${formatPrice(item.price)}
                    </p>

                </div>


                <button
                    class="remove-btn"
                    data-remove-id="${item.id}"
                >
                    Remove
                </button>

            `;


            cartItems.appendChild(cartItem);

        });

    }


    // Calculate total

    const total =
        cart.reduce(function(sum, item) {

            return sum + item.price;

        }, 0);


    totalAmount.textContent =
        formatPrice(total);

}


// ==========================================
// UPDATE SELECTED SERVICE TEXT
// ==========================================

function updateSelectionText() {

    if (selectedIds.length === 0) {

        selectionText.textContent =
            "Add items to your cart to continue.";

    }

    else {

        selectionText.textContent =
            `${selectedIds.length} service${selectedIds.length > 1 ? "s" : ""} selected.`;

    }

}


// ==========================================
// ADD / REMOVE ITEM FROM SELECTION
// ==========================================

function addItem(id) {

    // If item is not selected

    if (!selectedIds.includes(id)) {

        selectedIds.push(id);

        showToast("Service selected.");

    }

    // If item is already selected

    else {

        selectedIds =
            selectedIds.filter(function(selectedId) {

                return selectedId !== id;

            });

        showToast("Service removed from selection.");

    }


    renderServices();

    updateSelectionText();

}


// ==========================================
// ADD SELECTED ITEMS TO CART
// ==========================================

function addSelectedToCart() {

    if (selectedIds.length === 0) {

        showToast(
            "Please select at least one service."
        );

        return;
    }


    selectedIds.forEach(function(id) {

        const service =
            services.find(function(item) {

                return item.id === id;

            });


        // Avoid duplicate items

        if (!cart.some(function(item) {

            return item.id === id;

        })) {

            cart.push(service);

        }

    });


    renderCart();

    showToast(
        "Selected services added to cart."
    );

}


// ==========================================
// SERVICE BUTTON CLICK
// ==========================================

serviceGrid.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest("button");


        if (!button) {
            return;
        }


        const card =
            button.closest(".service-card");


        const id =
            Number(card.dataset.id);


        const action =
            button.dataset.action;


        // Add Item

        if (action === "add") {

            addItem(id);

        }


        // Skip Item

        if (action === "skip") {

            card.classList.add("skipped");

            showToast(
                "Service skipped."
            );

        }

    }
);


// ==========================================
// REMOVE ITEM FROM CART
// ==========================================

cartItems.addEventListener(
    "click",
    function(event) {

        const removeButton =
            event.target.closest("[data-remove-id]");


        if (!removeButton) {
            return;
        }


        const id =
            Number(removeButton.dataset.removeId);


        cart =
            cart.filter(function(item) {

                return item.id !== id;

            });


        selectedIds =
            selectedIds.filter(function(selectedId) {

                return selectedId !== id;

            });


        renderCart();

        renderServices();

        updateSelectionText();


        showToast(
            "Item removed from cart."
        );

    }
);


// ==========================================
// ADD TO CART BUTTON
// ==========================================

document
    .getElementById("addToCartBtn")
    .addEventListener(
        "click",
        addSelectedToCart
    );


// ==========================================
// BOOK NOW BUTTON
// ==========================================

document
    .getElementById("bookNowBtn")
    .addEventListener(
        "click",
        function() {

            if (cart.length === 0) {

                showToast(
                    "Add a service to the cart first."
                );

                return;
            }


            document
                .getElementById("booking")
                .scrollIntoView({

                    behavior: "smooth",

                    block: "start"

                });

        }
    );


// ==========================================
// BOOKING FORM
// ==========================================

document
    .getElementById("bookingForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            // Check cart

            if (cart.length === 0) {

                showToast(
                    "Please add a service before booking."
                );

                return;
            }


            // Get user name

            const name =
                document
                    .getElementById("fullName")
                    .value
                    .trim();


            // Show confirmation

            showToast(
                `Booking confirmed for ${name}!`
            );


            // Reset form

            event.target.reset();


            // Empty cart

            cart = [];

            selectedIds = [];


            renderCart();

            renderServices();

            updateSelectionText();

        }
    );


// ==========================================
// LOGOUT BUTTON
// ==========================================

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        function() {

            showToast(
                "You have been logged out."
            );

        }
    );


// ==========================================
// INITIAL DISPLAY
// ==========================================

renderServices();

renderCart();

updateSelectionText();