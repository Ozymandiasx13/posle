let products = [];

document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    setupCart();
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

    // Setup event listeners for the "Add to Cart" buttons
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
    const cartIcon = document.querySelector('.number-of-items .noi');
    
    closeCartButton.addEventListener('click', () => {
        cartSidebar.style.transform = 'translateX(100%)';
    });
    
    document.querySelector('.fa-shopping-cart').addEventListener('click', () => {
        cartSidebar.style.transform = 'translateX(0)';
        displayCartItems();
    });

    clearCartButton.addEventListener('click', () => {
        localStorage.removeItem('cart');
        displayCartItems();
        updateTotal();
        updateCartCount();
    });

    displayCartItems();
    updateTotal();
    updateCartCount();

    // Setup cart count
    updateCartCount();

    // Setup event listeners for plus and minus buttons
    setupPlusMinusButtons();
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
    updateCartCount();
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => item.id === id);

    if (index !== -1) {
        cart.splice(index, 1);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateTotal();
    updateCartCount();
}

function decreaseQuantity(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => item.id === id);

    if (index !== -1) {
        cart[index].quantity -= 1;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateTotal();
    updateCartCount();
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
            <p>Broj osoba: 
                <button class="plus-minus" data-id="${item.sys.id}" data-action="decrease">-</button>
                ${cartItem.quantity}
                <button class="plus-minus" data-id="${item.sys.id}" data-action="increase">+</button>
            </p>
        `;

        cartContent.appendChild(cartDiv);
    });

    // Setup event listeners for plus and minus buttons in the cart
    setupPlusMinusButtons();
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

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const numberOfItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.noi').textContent = numberOfItems;
}

function setupPlusMinusButtons() {
    const plusMinusButtons = document.querySelectorAll('.plus-minus');

    plusMinusButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            const action = button.dataset.action;

            if (action === 'increase') {
                addToCart(id);
            } else if (action === 'decrease') {
                decreaseQuantity(id);
            }
        });
    });
}