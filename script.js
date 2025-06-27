document.addEventListener('DOMContentLoaded', () => {

    const products = [
        { id: 1, name: 'Laptop ', price: 520, image: 'https://cdn.thewirecutter.com/wp-content/media/2024/11/cheapgaminglaptops-2048px-7981.jpg', category: 'Elektronikë' },
        { id: 2, name: 'Smartphone', price: 350, image: 'https://cdn.thewirecutter.com/wp-content/media/2024/05/smartphone-2048px-1013.jpg', category: 'Elektronikë' },
        { id: 3, name: 'Kmishe Pambuku', price: 25, image: 'https://storage.googleapis.com/fga-public/2021/09/15b423e1-96226800.jpg', category: 'Veshje' },
        { id: 4, name: 'Atlete', price: 40, image: 'https://cdn.officeshoes.ws/product_images/2023jz/big/mr530sg.jpg', category: 'Veshje' },
        { id: 5, name: 'Kufje Wireless', price: 45, image: 'https://e-baa.com/new/public/uploads/all/LPFqifvHJMBNFlyU9kkjYaGoIV6BD7gRa4hjY9tJ.webp', category: 'Elektronikë' },
        { id: 6, name: 'Xhakete Lekure', price: 100, image: 'https://lisi-m.com/wp-content/uploads/2024/04/5f037e91-e175-4b1f-bdeb-7d265e68c182-600x600.jpeg', category: 'Veshje' },
        { id: 7, name: 'Llambe Tavoline', price: 10, image: 'https://dyqan.taxi/wp-content/uploads/2022/02/llambe-tavoline-fleksibel-shitje-online-ne-dyqan-taxi-800x800.jpg', category: 'Shtëpi' },
        { id: 8, name: 'Set Filxhanesh', price: 22, image: 'https://bum.al/wp-content/uploads/2023/02/FILXHAN-JESHIL.jpg', category: 'Shtëpi' },
    ];

    let cart = [];

    const productGrid = document.getElementById('product-grid');
    const cartItemsList = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');
    const filtersContainer = document.getElementById('filters');
    const cartEmptyMsg = document.querySelector('.cart-empty-msg');

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            window.location.href = 'checkout.html';
        });
    }

    /**
      
      @param {string} filter 
     */
    function renderProducts(filter = 'all') {
        productGrid.innerHTML = ''; 
        const filteredProducts = products.filter(p => filter === 'all' || p.category === filter);

        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='https://placehold.co/400x400/cccccc/ffffff?text=Imazh+i+padisponueshëm';">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">${product.price.toLocaleString()} €</p>
                    <button class="add-to-cart-btn" data-product-id="${product.id}">Shto në Karrocë</button>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
    }

    
    function updateCartDisplay() {
        cartItemsList.innerHTML = ''; 

        if (cart.length === 0) {
            if (cartEmptyMsg) cartEmptyMsg.style.display = 'block';
        } else {
            if (cartEmptyMsg) cartEmptyMsg.style.display = 'none';
            cart.forEach(item => {
                const cartItem = document.createElement('li');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p class="price">${item.price.toLocaleString()} €</p>
                        <div class="quantity-controls">
                            <button class="quantity-change" data-product-id="${item.id}" data-action="decrease">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-change" data-product-id="${item.id}" data-action="increase">+</button>
                        </div>
                    </div>
                    <button class="remove-from-cart-btn" data-product-id="${item.id}">×</button>
                `;
                cartItemsList.appendChild(cartItem);
            });
        }
        calculateTotals();
        saveCartToLocalStorage();
    }

  
    function calculateTotals() {
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const tax = subtotal * 0.18; 
        const total = subtotal + tax;

        subtotalEl.textContent = `${subtotal.toLocaleString()} €`;
        taxEl.textContent = `${tax.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} €`;
        totalEl.textContent = `${total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} €`;
    }

    /**
     * 
     * @param {number} productId 
     */
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        const cartItem = cart.find(item => item.id === productId);

        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCartDisplay();
    }

    /**
     * 
     * @param {number} productId 
     * @param {string} action 
     */
    function updateQuantity(productId, action) {
        const cartItem = cart.find(item => item.id === productId);
        if (!cartItem) return;

        if (action === 'increase') {
            cartItem.quantity++;
        } else if (action === 'decrease') {
            cartItem.quantity--;
            if (cartItem.quantity <= 0) {
                removeFromCart(productId);
                return; 
            }
        }
        updateCartDisplay();
    }
    
    /**
     * 
     * @param {number} productId 
     */
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCartDisplay();
    }

    function saveCartToLocalStorage() {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }

    function loadCartFromLocalStorage() {
        const savedCart = localStorage.getItem('shoppingCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    }

    productGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = parseInt(e.target.dataset.productId);
            addToCart(productId);
        }
    });

    filtersContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            
            e.target.classList.add('active');
            
            const filter = e.target.dataset.filter;
            renderProducts(filter);
        }
    });

    cartItemsList.addEventListener('click', (e) => {
        const target = e.target;
        const productId = parseInt(target.dataset.productId);

        if (target.classList.contains('quantity-change')) {
            const action = target.dataset.action;
            updateQuantity(productId, action);
        }

        if (target.classList.contains('remove-from-cart-btn')) {
            removeFromCart(productId);
        }
    });
    
    loadCartFromLocalStorage();
    renderProducts();
    updateCartDisplay();
});
