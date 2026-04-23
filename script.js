document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    let cart = JSON.parse(localStorage.getItem('karina_cart')) || [];
    let favorites = JSON.parse(localStorage.getItem('karina_favorites')) || [];
    let isDark = localStorage.getItem('theme') === 'dark';
    let currentCategory = 'todos';
    let searchQuery = '';

    const books = [
        // Romance
        { id: 1, title: "O Silêncio das Estrelas", author: "Marina Silva", price: 45.00, category: "romance", image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&q=80&w=600" },
        { id: 2, title: "Entre Páginas e Destinos", author: "Lucas Oliveira", price: 52.90, category: "romance", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600" },
        { id: 3, title: "A Última Biblioteca", author: "Helena Santos", price: 39.90, category: "romance", image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=600" },
        { id: 4, title: "Sombras de Papel", author: "Ricardo Lima", price: 48.00, category: "romance", image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=600" },
        // Infantil
        { id: 5, title: "O Pequeno Explorador", author: "Ana Clara", price: 29.90, category: "infantil", image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=600" },
        { id: 6, title: "Contos de Magia", author: "Beto Souza", price: 35.50, category: "infantil", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=600" },
        // Cristão
        { id: 7, title: "Luz no Caminho", author: "Padre João", price: 42.00, category: "cristao", image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&q=80&w=600" },
        { id: 8, title: "Eternas Verdades", author: "Marta Rocha", price: 38.00, category: "cristao", image: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&q=80&w=600" },
        // Ajuda Profissional
        { id: 9, title: "Foco e Performance", author: "Dr. André", price: 59.90, category: "ajuda-profissional", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600" },
        { id: 10, title: "Liderança Ágil", author: "Carla Mendes", price: 65.00, category: "ajuda-profissional", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600" }
    ];

    // --- DOM Elements ---
    const productsGrid = document.getElementById('products-grid');
    const orbitalContainer = document.querySelector('.orbital-container');
    const bookTitle = document.getElementById('book-title');
    const bookAuthor = document.getElementById('book-author');
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotalValue = document.getElementById('cart-total-value');
    const themeToggle = document.getElementById('theme-toggle');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    // --- Initialization ---
    function init() {
        renderProducts();
        initOrbitalAnimation();
        updateCartUI();
        setupTheme();
        setupEventListeners();
        createParticles();
    }

    // --- Theme Logic ---
    function setupTheme() {
        if (isDark) document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeIcon();
    }

    function updateThemeIcon() {
        const icon = themeToggle.querySelector('i');
        icon.className = document.documentElement.getAttribute('data-theme') === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // --- Spherical Animation Logic ---
    let orbitalItems = [];
    let focalIndex = 0;

    function initOrbitalAnimation() {
        const heroBooks = books.slice(0, 5);
        heroBooks.forEach((book, index) => {
            const item = document.createElement('div');
            item.className = 'orbital-item state-entering';
            item.innerHTML = `<img src="${book.image}" alt="${book.title}">`;
            orbitalContainer.appendChild(item);
            orbitalItems.push({ element: item, book: book });
        });
        
        // Start the first cycle immediately
        cycleBooks();
        setInterval(cycleBooks, 5000); // 1s transition + 4s focus pause
    }

    let sphereRotation = 0;

    function cycleBooks() {
        orbitalItems.forEach((item, index) => {
            const el = item.element;
            // Remove all state classes
            el.classList.remove('state-entering', 'state-focused', 'state-leaving');
            
            if (index === focalIndex) {
                // Focus current book
                el.classList.add('state-focused');
                updateHeroContent(item.book);
            } else if (index === (focalIndex - 1 + orbitalItems.length) % orbitalItems.length) {
                // Animate previous book leaving (contornando)
                el.classList.add('state-leaving');
            } else {
                // Others wait at top
                el.classList.add('state-entering');
            }
        });

        // Rotate the sphere clockwise synchronously
        sphereRotation += 72;
        const sphere = document.querySelector('.hero-sphere');
        if (sphere) {
            sphere.style.setProperty('--sphere-rotation', `${sphereRotation}deg`);
        }

        focalIndex = (focalIndex + 1) % orbitalItems.length;
    }

    function updateHeroContent(book) {
        const info = document.getElementById('book-info');
        info.classList.remove('active');
        
        setTimeout(() => {
            bookTitle.textContent = book.title;
            bookAuthor.textContent = `Por ${book.author}`;
            
            const btnBuyHero = document.querySelector('.btn-buy-hero');
            if (btnBuyHero) {
                btnBuyHero.onclick = () => addToCart(book.id);
            }
            
            info.classList.add('active');
        }, 400);
    }

    // --- Product Rendering ---
    function renderProducts() {
        const filtered = books.filter(book => {
            const matchesCategory = currentCategory === 'todos' || 
                                   (currentCategory === 'favoritos' ? favorites.includes(book.id) : book.category === currentCategory);
            const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 book.author.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        productsGrid.innerHTML = filtered.map(book => `
            <div class="product-card" data-id="${book.id}">
                <button class="fav-btn ${favorites.includes(book.id) ? 'active' : ''}" onclick="toggleFavorite(${book.id})">
                    <i class="fas fa-heart"></i>
                </button>
                <div class="product-img">
                    <img src="${book.image}" alt="${book.title}">
                </div>
                <div class="product-details">
                    <h3>${book.title}</h3>
                    <p>${book.author}</p>
                    <p class="price">R$ ${book.price.toFixed(2)}</p>
                    <button class="btn-add-cart" onclick="addToCart(${book.id})">Adicionar ao Carrinho</button>
                </div>
            </div>
        `).join('');
    }

    // --- Cart Functions ---
    window.addToCart = (id) => {
        const book = books.find(b => b.id === id);
        const existing = cart.find(item => item.id === id);
        if (existing) {
            existing.qty++;
        } else {
            cart.push({ ...book, qty: 1 });
        }
        updateCartUI();
        saveCart();
        showNotification(`${book.title} adicionado!`);
    };

    function updateCartUI() {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
        cartItems.innerHTML = cart.length ? cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <p>R$ ${item.price.toFixed(2)}</p>
                    <div class="cart-item-qty">
                        <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="qty-btn" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
            </div>
        `).join('') : '<p style="text-align:center; padding: 2rem;">Seu carrinho está vazio.</p>';
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        cartTotalValue.textContent = total.toFixed(2).replace('.', ',');
    }

    window.updateQty = (id, delta) => {
        const item = cart.find(i => i.id === id);
        if (item) {
            item.qty += delta;
            if (item.qty <= 0) removeFromCart(id);
            else {
                updateCartUI();
                saveCart();
            }
        }
    };

    window.removeFromCart = (id) => {
        cart = cart.filter(i => i.id !== id);
        updateCartUI();
        saveCart();
    };

    function saveCart() { localStorage.setItem('karina_cart', JSON.stringify(cart)); }

    // --- Favorite Functions ---
    window.toggleFavorite = (id) => {
        const index = favorites.indexOf(id);
        if (index === -1) {
            favorites.push(id);
        } else {
            favorites.splice(index, 1);
        }
        localStorage.setItem('karina_favorites', JSON.stringify(favorites));
        renderProducts();
    };

    // --- Event Listeners ---
    function setupEventListeners() {
        // Theme Toggle
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const target = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', target);
            localStorage.setItem('theme', target);
            updateThemeIcon();
        });

        // Search
        const handleSearch = () => {
            searchQuery = searchInput.value;
            renderProducts();
            if (searchQuery) document.getElementById('produtos').scrollIntoView();
        };
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keyup', (e) => { if(e.key === 'Enter') handleSearch(); });

        // Category Tabs
        document.querySelectorAll('.tab-btn[data-category]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentCategory = btn.dataset.category;
                renderProducts();
            });
        });

        // Modals Control
        const cartModal = document.getElementById('cart-modal');
        const loginModal = document.getElementById('login-modal');
        const checkoutModal = document.getElementById('checkout-modal');

        document.getElementById('cart-toggle').addEventListener('click', (e) => {
            e.preventDefault();
            cartModal.classList.add('active');
        });
        
        document.getElementById('user-toggle').addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.classList.add('active');
        });

        // Login/Register Tab Switching
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const tabBtns = document.querySelectorAll('.login-tabs .tab-btn');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                if (btn.dataset.form === 'login') {
                    loginForm.style.display = 'block';
                    registerForm.style.display = 'none';
                } else {
                    loginForm.style.display = 'none';
                    registerForm.style.display = 'block';
                }
            });
        });

        // Form Submissions (Simulated)
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Login realizado com sucesso!');
            loginModal.classList.remove('active');
        });

        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Conta criada com sucesso!');
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
            tabBtns.forEach(b => b.classList.remove('active'));
            tabBtns[0].classList.add('active');
        });
        
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
            });
        });

        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
            }
        });

        document.getElementById('checkout-btn').addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Seu carrinho está vazio!');
                return;
            }
            cartModal.classList.remove('active');
            checkoutModal.classList.add('active');
        });

        document.getElementById('confirm-payment').addEventListener('click', () => {
            alert('Parabéns! Sua compra foi realizada com sucesso (Simulação).');
            cart = [];
            saveCart();
            updateCartUI();
            checkoutModal.classList.remove('active');
        });

        // Mobile Menu
        document.querySelector('.mobile-menu-btn').addEventListener('click', () => {
            document.querySelector('nav ul').classList.toggle('active');
        });
    }

    function createParticles() {
        const visual = document.querySelector('.hero-visual');
        if (!visual) return;
        for (let i = 0; i < 25; i++) {
            const p = document.createElement('div');
            p.className = 'magic-particle';
            const size = Math.random() * 4 + 2;
            p.style.width = `${size}px`;
            p.style.height = `${size}px`;
            p.style.left = `${Math.random() * 100}%`;
            p.style.top = `${Math.random() * 100}%`;
            p.style.animationDelay = `${Math.random() * 4}s`;
            p.style.animationDuration = `${Math.random() * 2 + 3}s`;
            visual.appendChild(p);
        }
    }

    function showNotification(msg) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; bottom: 30px; right: 30px; 
            background: var(--primary-pink); color: white; 
            padding: 12px 25px; border-radius: 8px; z-index: 4000;
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
            opacity: 0; transform: translateY(20px); transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        `;
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = 1; toast.style.transform = 'translateY(0)'; }, 50);
        setTimeout(() => { 
            toast.style.opacity = 0; 
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    init();
    // Mouse pink trail effect
    const mouseTrail = document.createElement('div');
    mouseTrail.className = 'mouse-trail';
    document.body.appendChild(mouseTrail);
    document.addEventListener('mousemove', (e) => {
        mouseTrail.style.left = `${e.clientX}px`;
        mouseTrail.style.top = `${e.clientY}px`;
    });
});
