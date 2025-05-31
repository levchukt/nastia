document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.querySelector('.cart-items-container');
    const cartTotalElement = document.getElementById('cart_total');
    const orderBtn = document.getElementById('orderBtn');
    const cartCounter = document.querySelector('.cart-counter');

    // Get cart from cookies
    function getCartFromCookies() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'cart') {
                return JSON.parse(decodeURIComponent(value));
            }
        }
        return {};
    }

    // Display cart items
    function displayCartItems() {
        const cart = getCartFromCookies();
        let total = 0;
        let itemsHTML = '';

        for (const [title, item] of Object.entries(cart)) {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            itemsHTML += `
                <div class="cart-item">
                    <img src="foto/${item.image}" alt="${title}" width="100">
                    <div class="cart-item-details">
                        <h3>${title}</h3>
                        <p>${item.price} грн × ${item.quantity}</p>
                        <p>Сума: ${itemTotal} грн</p>
                        <div class="cart-item-controls">
                            <button class="quantity-btn minus" data-title="${title}">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn plus" data-title="${title}">+</button>
                            <button class="remove-btn" data-title="${title}">Видалити</button>
                        </div>
                    </div>
                </div>
            `;
        }

        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = itemsHTML || '<p>Ваш кошик порожній</p>';
        }

        if (cartTotalElement) {
            cartTotalElement.textContent = total;
        }

        if (cartCounter) {
            const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
            cartCounter.textContent = totalItems;
        }

        addCartItemEventListeners();
    }

    // Update cart item quantity
    function updateCartItem(title, newQuantity) {
        const cart = getCartFromCookies();
        
        if (cart[title]) {
            if (newQuantity <= 0) {
                delete cart[title];
            } else {
                cart[title].quantity = newQuantity;
            }
            
            document.cookie = `cart=${JSON.stringify(cart)}; max-age=${60 * 60 * 24 * 7}; path=/`;
            displayCartItems();
        }
    }

    // Remove item from cart
    function removeCartItem(title) {
        updateCartItem(title, 0);
    }

    // Add event listeners to cart buttons
    function addCartItemEventListeners() {
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const title = e.target.getAttribute('data-title');
                const cart = getCartFromCookies();
                const currentQuantity = cart[title]?.quantity || 0;
                updateCartItem(title, currentQuantity - 1);
            });
        });

        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const title = e.target.getAttribute('data-title');
                const cart = getCartFromCookies();
                const currentQuantity = cart[title]?.quantity || 0;
                updateCartItem(title, currentQuantity + 1);
            });
        });

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const title = e.target.getAttribute('data-title');
                removeCartItem(title);
            });
        });
    }

    // Order button handler
    if (orderBtn) {
        orderBtn.addEventListener('click', () => {
            const cart = getCartFromCookies();
            if (Object.keys(cart).length === 0) {
                alert('Ваш кошик порожній!');
                return;
            }
            
            alert('Замовлення оформлено! Дякуємо за покупку!');
            document.cookie = 'cart=; max-age=0; path=/';
            displayCartItems();
        });
    }

    // Initialize cart display
    displayCartItems();
});