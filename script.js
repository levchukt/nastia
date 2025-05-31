document.addEventListener('DOMContentLoaded', () => {
    // Shopping Cart Class
    class ShoppingCart {
        constructor() {
            this.items = {};
            this.cartCounter = document.querySelector('.cart-counter');
            this.loadCartFromCookies();
        }

        addItem(item) {
            if (this.items[item.title]) {
                this.items[item.title].quantity += 1;
            } else {
                this.items[item.title] = item;
                this.items[item.title].quantity = 1;
            }
            this.updateCounter();
            this.saveCartToCookies();
        }

        updateQuantity(itemTitle, newQuantity) {
            if (this.items[itemTitle]) {
                this.items[itemTitle].quantity = newQuantity;
                if (this.items[itemTitle].quantity <= 0) {
                    delete this.items[itemTitle];
                }
                this.updateCounter();
                this.saveCartToCookies();
            }
        }

        updateCounter() {
            let count = 0;
            for (let key in this.items) {
                count += this.items[key].quantity;
            }
            if (this.cartCounter) {
                this.cartCounter.innerHTML = count;
            }
        }

        saveCartToCookies() {
            let cartJSON = JSON.stringify(this.items);
            document.cookie = `cart=${cartJSON}; max-age=${60 * 60 * 24 * 7}; path=/`;
        }

        loadCartFromCookies() {
            let cartCookie = getCookieValue('cart');
            if (cartCookie && cartCookie !== '') {
                this.items = JSON.parse(cartCookie);
                this.updateCounter();
            }
        }

        calculateTotal() {
            let total = 0;
            for (let key in this.items) {
                total += this.items[key].price * this.items[key].quantity;
            }
            return total;
        }
    }

    // Get Cookie Value
    function getCookieValue(cookieName) {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(cookieName + '=')) {
                return cookie.substring(cookieName.length + 1);
            }
        }
        return '';
    }

    // Initialize cart
    let cart = new ShoppingCart();

    // Cart Navigation
    const cartBtn = document.querySelector('.cart-btn-header');
    if (cartBtn) {
        cartBtn.addEventListener("click", function (e) {
            e.preventDefault();
            window.location.assign('cart.html');
        });
    }
});


document.addEventListener('DOMContentLoaded', () => {
    // Search Products
    function searchProducts(event) {
        event.preventDefault();
        let query = document.querySelector('.inp') ? document.querySelector('.inp').value.toLowerCase() : '';
        let productsList = document.querySelector('.items');
        productsList.innerHTML = '';

        getProducts().then(function (products) {
            products.forEach(function (product) {
                if (product.title.toLowerCase().includes(query)) {
                    productsList.innerHTML += getCardHTML(product);
                }
            });

            let buyButtons = document.querySelectorAll('.ca .buy');
            if (buyButtons) {
                buyButtons.forEach(function (button) {
                    button.addEventListener('click', addToCart);
                });
            }
        });
    }

    let searchForm = document.querySelector('#search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', searchProducts);
    }

    // Fetch Products
    async function getProducts() {
        try {
            let response = await fetch("items.json");
            let products = await response.json();
            return products;
        } catch (error) {
            console.error('Error fetching items.json:', error);
            return [
                { title: "Rose Bouquet", description: "Elegant red roses", price: 500, image: "image (2).png" },
                { title: "Tulip Arrangement", description: "Vibrant mixed tulips", price: 400, image: "image (3).png" },
                { title: "Lily Basket", description: "Pure white lilies", price: 600, image: "image (4).png" },
                { title: "Sunflower Bunch", description: "Bright sunflowers", price: 350, image: "image (5).png" },
                { title: "Orchid Pot", description: "Exotic purple orchids", price: 700, image: "image (6).png" },
                { title: "Daisy Mix", description: "Cheerful daisies", price: 300, image: "image (7).png" },
                { title: "Carnation Bouquet", description: "Soft pink carnations", price: 450, image: "image (8).png"},
                { title: "Peony Arrangement", description: "Lush peonies", price: 800, image: "image (9).png" },
                { title: "Mixed Floral Box", description: "Assorted flowers", price: 550, image: "image (10).png" }
            ];
        }
    }

    // Generate Product Card HTML
    function getCardHTML(product) {
        let productData = JSON.stringify(product);
        return `
        <div class="ca">
            <img src="foto/${product.image}" alt="${product.title}">
            <div class="text">${product.title}</div>
            <p class="cost">${product.price} грн</p>
            <div class="buy" data-product='${productData}'>Buy</div>
        </div>
        `;
    }

    // Load Products
    getProducts().then(function (products) {
        let productsList = document.querySelector('.items');
        if (productsList) {
            productsList.innerHTML = '';
            products.forEach(function (product) {
                productsList.innerHTML += getCardHTML(product);
            });
        }

        let buyButtons = document.querySelectorAll('.ca .buy');
        if (buyButtons) {
            buyButtons.forEach(function (button) {
                button.addEventListener('click', addToCart);
            });
        }
    });

    // Add to Cart function
    function addToCart(event) {
        const productData = event.target.getAttribute('data-product');
        const product = JSON.parse(productData);
        cart.addItem(product);
    }

    // Review Functionality
    const reviewForm = document.querySelector('#review-form');
    const reviewsList = document.querySelector('.reviews-list');

    function loadReviews() {
        if (!reviewsList) return;
        
        const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        reviewsList.innerHTML = '';
        reviews.forEach(review => {
            reviewsList.innerHTML += `
            <div class="review">
                <p class="review-name">${review.name}</p>
                <p>${review.text}</p>
            </div>
            `;
        });
    }

    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.querySelector('#review-name').value.trim();
            const text = document.querySelector('#review-text').value.trim();
            if (name && text) {
                const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
                reviews.push({ name, text });
                localStorage.setItem('reviews', JSON.stringify(reviews));
                reviewForm.reset();
                loadReviews();
            }
        });
    }

    loadReviews();
});