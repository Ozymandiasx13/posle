let products = [];

document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    setupCart();
    displayCartItems();
    updateTotal();
});

async function loadProducts() {
    const productContainer = document.querySelector('.product-container');
    const response = await fetch('products.json');
    const data = await response.json();
    products = data.items;

    products.forEach(item => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product-card');

        productDiv.innerHTML = `
            <div class="product-content">
                <img src="${item.fields.image.fields.file.url}" alt="${item.fields.title}">
                <h3 class="product-name">${item.fields.title}</h3>
                <p class="product-pricing">Cijena po osobi ${item.fields.price.toFixed(2)}€</p>
            </div>
            <button class="add-to-cart" data-id="${item.sys.id}">Dodaj u Košaricu</button>
        `;

        productContainer.appendChild(productDiv);
    });

    setupAddToCartButtons();
}

function setupAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            addToCart(id);
        });
    });
}

function setupCart() {
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCartButton = document.querySelector('.close-cart');
    const clearCartButton = document.querySelector('.clear-cart-btn');

    closeCartButton.addEventListener('click', () => {
        cartSidebar.style.transform = 'translateX(100%)';
    });

    document.querySelector('.fa-shopping-cart').addEventListener('click', () => {
        cartSidebar.style.transform = 'translateX(0)';
        displayCartItems();
        updateTotal();
    });

    clearCartButton.addEventListener('click', () => {
        localStorage.removeItem('cart');
        displayCartItems();
        updateTotal();
    });

    displayCartItems();
    updateTotal();
}

function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemExists = cart.some(item => item.id === id);

    if (itemExists) {
        cart = cart.map(item => {
            if (item.id === id) item.quantity += 1;
            return item;
        });
    } else {
        cart.push({ id, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateTotal();
}

function displayCartItems() {
    const cartContent = document.querySelector('.cart-content');
    cartContent.innerHTML = '';
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    cart.forEach(cartItem => {
        const item = products.find(product => product.sys.id === cartItem.id);

        const cartDiv = document.createElement('div');
        cartDiv.classList.add('cart-item');

        cartDiv.innerHTML = `
            <img src="${item.fields.image.fields.file.url}" alt="${item.fields.title}">
            <h4>${item.fields.title}</h4>
            <p>€${item.fields.price.toFixed(2)}</p>
            <p>Broj osoba: ${cartItem.quantity}</p>
            <button class="plus-minus" data-id="${cartItem.id}" data-action="minus">-</button>
            <button class="plus-minus" data-id="${cartItem.id}" data-action="plus">+</button>
        `;

        cartContent.appendChild(cartDiv);
    });

    document.querySelectorAll('.plus-minus').forEach(button => {
        button.addEventListener('click', (event) => {
            const id = button.dataset.id;
            const action = button.dataset.action;
            updateCartItemQuantity(id, action);
        });
    });
}

function updateCartItemQuantity(id, action) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.map(item => {
        if (item.id === id) {
            if (action === 'plus') {
                item.quantity += 1;
            } else if (action === 'minus' && item.quantity > 1) {
                item.quantity -= 1;
            }
        }
        return item;
    });

    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateTotal();
}

function updateTotal() {
    const totalSum = document.querySelector('.total-sum span');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;

    cart.forEach(cartItem => {
        const item = products.find(product => product.sys.id === cartItem.id);
        total += item.fields.price * cartItem.quantity;
    });

    totalSum.textContent = total.toFixed(2);
}
function displayCartItems() {
    const cartContent = document.querySelector('.cart-content');
    cartContent.innerHTML = '';
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const numberOfItems = cart.length;

    const numberOfItemsDisplay = document.querySelector('.number-of-items .noi');
    numberOfItemsDisplay.textContent = numberOfItems;
}
