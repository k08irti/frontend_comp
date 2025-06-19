document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');
    const body = document.body;
    const cartCountSpan = document.getElementById('cart-count'); // Get the cart count span

    // Removed Loader Functionality


    // --- Mobile Navigation Toggle ---
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            body.classList.toggle('nav-open');
        });
    }

    // --- Cart Functions ---
    function getCart() {
        const cart = localStorage.getItem('makeupCart'); // Using 'makeupCart' key
        return cart ? JSON.parse(cart) : [];
    }

    function saveCart(cart) {
        localStorage.setItem('makeupCart', JSON.stringify(cart)); // Using 'makeupCart' key
        updateCartCount(); // Update count whenever cart is saved
    }

    function addToCart(product) {
        const cart = getCart();
        // Check if product already exists in cart (optional: could add quantity)
        // For simplicity, adding as separate items for now
        cart.push(product);
        saveCart(cart);
    }

    function removeFromCart(index) {
        const cart = getCart();
        if (index > -1 && index < cart.length) {
            cart.splice(index, 1);
            saveCart(cart);
            displayCart(); // Refresh the display
        }
    }

    function clearCart() {
        localStorage.removeItem('makeupCart'); // Remove the cart from local storage
        updateCartCount(); // Update count to 0
        displayCart(); // Refresh the display (will show empty message)
        alert("Order processed! Your cart has been cleared."); // Optional: Confirmation message
    }


    function updateCartCount() {
        if (cartCountSpan) {
            const cart = getCart();
            const itemCount = cart.length;
            // Display count only if greater than 0
            cartCountSpan.textContent = itemCount > 0 ? itemCount : '';
             // Add/remove class based on item count
            if (itemCount > 0) {
                cartCountSpan.classList.add('has-items');
            } else {
                cartCountSpan.classList.remove('has-items');
            }
        }
    }


    // --- Add to Cart Functionality (on products.html) ---
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const productItem = event.target.closest('.product-item');
                if (productItem) {
                    const productName = productItem.dataset.name;
                    const productPrice = parseFloat(productItem.dataset.price);

                    if (productName && !isNaN(productPrice)) {
                        addToCart({ name: productName, price: productPrice });
                        // alert(`${productName} added to cart!`); // Removed alert for smoother experience
                    } else {
                        console.error("Could not get product data from element.");
                    }
                }
            });
        });
    }

    // --- Display Cart Functionality (on cart.html) ---
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalContainer = document.getElementById('cart-total-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const processOrderBtn = document.getElementById('process-order-btn'); // Get the process button

    if (cartItemsContainer && cartTotalContainer) {
        displayCart();

        // Add event listener for the process order button
        if (processOrderBtn) {
            processOrderBtn.addEventListener('click', clearCart);
        }
    }

    function displayCart() {
        const cart = getCart();
        cartItemsContainer.innerHTML = ''; // Clear current content
        let total = 0;

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            cartTotalContainer.style.display = 'none';
            if (processOrderBtn) processOrderBtn.style.display = 'none'; // Hide button if cart is empty
        } else {
            emptyCartMessage.style.display = 'none';
            cartTotalContainer.style.display = 'block';
            if (processOrderBtn) processOrderBtn.style.display = 'block'; // Show button if cart has items

            cart.forEach((item, index) => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>Price: $${item.price.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <button class="remove-item" data-index="${index}">X</button> <!-- Added remove button -->
                `;
                cartItemsContainer.appendChild(itemElement);
                total += item.price;
            });

            cartTotalContainer.innerHTML = `Total: $${total.toFixed(2)}`;

            // Add event listeners for remove buttons AFTER they are added to the DOM
            cartItemsContainer.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', (event) => {
                    const indexToRemove = parseInt(event.target.dataset.index);
                    removeFromCart(indexToRemove);
                });
            });
        }
    }

    // --- Initial Load ---
    updateCartCount(); // Update cart count on page load

});