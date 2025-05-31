document.addEventListener('DOMContentLoaded', () => {
    let cart_list = document.querySelector('.itemscard');
    let orderBtn = document.querySelector("#orderBtn");
    let cart_total = document.querySelector("#cart_total");

    if (typeof cart === 'undefined') {
        console.error('Cart is not defined. Ensure script.js is loaded before cart.js.');
        let cart = new ShoppingCart();
    }

    function get_item(item) {
        return `
        <div class="ca">
            <img src="foto/${item.image}" alt="${item.title}">
            <div class="text">${item.title}</div>
            <p class="cost">${item.price} грн</p>
            <input type="number" data-item="${item.title}" value="${item.quantity}" min="0" style="width: 60px; border-radius: 5px; border: 2px solid #E6A7A7; padding: 5px; font-family: 'Island Moments', sans-serif;">
        </div>
        `;
    }

    function showCartList() {
        cart_list.innerHTML = '';
        for (let key in cart.items) {
            cart_list.innerHTML += get_item(cart.items[key]);
        }
        if (cart_total) {
            cart_total.innerHTML = cart.calculateTotal().toFixed(2);
        }
    }

    showCartList();

    cart_list.addEventListener('change', (event) => {
        let target = event.target;
        if (target.tagName === 'INPUT' && target.type === 'number') {
            const itemTitle = target.getAttribute('data-item');
            const newQuantity = parseInt(target.value);
            if (!isNaN(newQuantity)) {
                cart.updateQuantity(itemTitle, newQuantity);
                showCartList();
            }
        }
    });
});