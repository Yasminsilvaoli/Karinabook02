document.addEventListener('DOMContentLoaded', () => {
    console.log('KarinaBook: DOM Content Loaded. Initializing...');
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
        updateCartUI();
        setupTheme();
        setupEventListeners();
        createParticles();
        initCheckoutSimulation();
        setupBookQuotes();
        initOrbitalAnimation();
        
        // Setup Hero Button
        const btnBuyHero = document.querySelector('.btn-buy-hero');
        if (btnBuyHero) {
            btnBuyHero.onclick = () => addToCart(1); // Default to first book
        }
        
        // Debugging badge (visible confirmation)
        const badge = document.createElement('div');
        badge.style.cssText = 'position:fixed; top:10px; right:10px; background:rgba(0,0,0,0.5); color:lime; padding:5px 10px; border-radius:5px; font-size:10px; z-index:9999; pointer-events:none;';
        badge.textContent = 'System Active';
        document.body.appendChild(badge);
        setTimeout(() => badge.remove(), 5000);

        console.log('KarinaBook: Initialization complete.');
    }

    // --- Book Quotes Logic ---
    const bookQuotes = [
        "“Entre páginas e sonhos, cada história revela novos mundos.”",
        "“A leitura transforma o comum em extraordinário.”",
        "“Descubra aventuras, emoções e infinitas possibilidades.”",
        "“Um livro é um sonho que você segura nas mãos.”",
        "“Ler é viajar sem sair do lugar.”",
        "“Grandes histórias começam com o virar de uma página.”",
        "“O conhecimento é a única riqueza que ninguém pode tirar.”",
        "“Cada livro lido é um degrau na escada da sabedoria.”",
        "“A alma que lê é uma alma que nunca está sozinha.”",
        "“Livros são espelhos da alma e janelas para o mundo.”",
        "“Onde há um livro, há um caminho para a liberdade.”",
        "“Ler é um ato de coragem e descoberta constante.”",
        "“As palavras têm o poder de mudar o seu destino.”"
    ];

    let currentQuoteIndex = 0;

    function setupBookQuotes() {
        const book = document.getElementById('interactive-book');
        if (!book) return;

        book.addEventListener('click', () => {
            currentQuoteIndex = (currentQuoteIndex + 1) % bookQuotes.length;
            
            const leftP = document.querySelector('#book-page-left p');
            const rightP = document.querySelector('#book-page-right p');
            
            // Back faces (left side when flipped)
            const b1 = document.querySelector('#book-page-flip-b p');
            const b2 = document.querySelector('#book-page-flip-2b p');
            const b3 = document.querySelector('#book-page-flip-3b p');
            const b4 = document.querySelector('#book-page-flip-4b p');
            const b5 = document.querySelector('#book-page-flip-5b p');

            // Front faces (right side when flipping/closed)
            const f1 = document.querySelector('#book-page-flip-f p');
            const f2 = document.querySelector('#book-page-flip-2f p');
            const f3 = document.querySelector('#book-page-flip-3f p');
            const f4 = document.querySelector('#book-page-flip-4f p');
            const f5 = document.querySelector('#book-page-flip-5f p');

            if (leftP) leftP.textContent = bookQuotes[currentQuoteIndex];
            if (rightP) rightP.textContent = bookQuotes[(currentQuoteIndex + 1) % bookQuotes.length];
            
            if (b1) b1.textContent = bookQuotes[(currentQuoteIndex + 2) % bookQuotes.length];
            if (b2) b2.textContent = bookQuotes[(currentQuoteIndex + 3) % bookQuotes.length];
            if (b3) b3.textContent = bookQuotes[(currentQuoteIndex + 4) % bookQuotes.length];
            if (b4) b4.textContent = bookQuotes[(currentQuoteIndex + 5) % bookQuotes.length];
            if (b5) b5.textContent = bookQuotes[(currentQuoteIndex + 6) % bookQuotes.length];

            if (f1) f1.textContent = bookQuotes[(currentQuoteIndex + 7) % bookQuotes.length];
            if (f2) f2.textContent = bookQuotes[(currentQuoteIndex + 8) % bookQuotes.length];
            if (f3) f3.textContent = bookQuotes[(currentQuoteIndex + 9) % bookQuotes.length];
            if (f4) f4.textContent = bookQuotes[(currentQuoteIndex + 10) % bookQuotes.length];
            if (f5) f5.textContent = bookQuotes[(currentQuoteIndex + 11) % bookQuotes.length];
            
            // Visual feedback
            book.style.transform = 'scale(1.05) rotateX(15deg) rotateY(-5deg)';
            setTimeout(() => {
                book.style.transform = '';
            }, 200);
        });
    }

    // --- Theme Logic ---
    function setupTheme() {
        if (isDark) document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeIcon();
    }

    function updateThemeIcon() {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = document.documentElement.getAttribute('data-theme') === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // --- Spherical Animation Logic ---
    let orbitalItems = [];
    let focalIndex = 0;

    function initOrbitalAnimation() {
        if (!orbitalContainer) return;
        const heroBooks = books.slice(0, 5);
        heroBooks.forEach((book, index) => {
            const item = document.createElement('div');
            item.className = 'orbital-item state-entering';
            item.innerHTML = `<img src="${book.image}" alt="${book.title}">`;
            orbitalContainer.appendChild(item);
            orbitalItems.push({ element: item, book: book });
        });
        
        console.log(`KarinaBook: Orbital animation initialized with ${orbitalItems.length} items.`);
        
        if (orbitalItems.length > 0) {
            // Start the first cycle immediately
            cycleBooks();
            setInterval(cycleBooks, 5000); // 1s transition + 4s focus pause
        } else {
            console.error('KarinaBook: No orbital items to animate.');
        }
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
                
                // Butterfly interaction
                interactButterfly();
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

    function interactButterfly() {
        const butterflies = document.querySelectorAll('.butterfly-container');
        if (butterflies.length === 0) return;
        const randomIdx = Math.floor(Math.random() * butterflies.length);
        const b = butterflies[randomIdx];
        
        b.classList.add('state-interacting');
        
        setTimeout(() => {
            b.classList.remove('state-interacting');
        }, 4000);
    }

    function updateHeroContent(book) {
        const info = document.getElementById('book-info');
        if (!info) return;
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
        
        // Final Contact Form Submission (via Formspree AJAX)
        const contactForm = document.querySelector('#contato form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const submitBtn = contactForm.querySelector('.btn-submit');
                const originalText = submitBtn.textContent;
                const formData = new FormData(contactForm);
                
                submitBtn.disabled = true;
                submitBtn.textContent = 'Enviando...';
                
                fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                }).then(response => {
                    if (response.ok) {
                        showNotification('Mensagem enviada com sucesso! Karina receberá em breve.');
                        contactForm.reset();
                    } else {
                        showNotification('Ops! Ocorreu um erro. Verifique os campos e tente novamente.');
                    }
                }).catch(() => {
                    showNotification('Erro de conexão ao enviar a mensagem.');
                }).finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                });
            });
        }
        
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
                showNotification('Seu carrinho está vazio!');
                return;
            }
            cartModal.classList.remove('active');
            checkoutModal.classList.add('active');
        });
        // Mobile Menu
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navUl = document.querySelector('nav ul');
        
        if (mobileMenuBtn && navUl) {
            mobileMenuBtn.addEventListener('click', () => {
                navUl.classList.toggle('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.className = navUl.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
                }
            });

            // Close menu when clicking a link
            navUl.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navUl.classList.remove('active');
                    const icon = mobileMenuBtn.querySelector('i');
                    if (icon) icon.className = 'fas fa-bars';
                });
            });
        }
    }

    function initCheckoutSimulation() {
        const checkoutModal = document.getElementById('checkout-modal');
        const paymentForm = document.getElementById('payment-form');
        if (!paymentForm) return;

        const cardVisual = document.getElementById('card-visual');
        const cardNumInput = document.getElementById('card-number');
        const cardNameInput = document.getElementById('card-name');
        const cardExpiryInput = document.getElementById('card-expiry');
        const cardCvvInput = document.getElementById('card-cvv');
        
        const numDisplay = document.getElementById('card-number-display');
        const nameDisplay = document.getElementById('card-name-display');
        const expiryDisplay = document.getElementById('card-expiry-display');
        const cvvDisplay = document.getElementById('card-cvv-display');
        const frontLogo = document.getElementById('card-logo-front');

        const btnSubmit = document.getElementById('confirm-payment');
        const btnText = btnSubmit.querySelector('.btn-text');
        const loader = btnSubmit.querySelector('.loader');

        // Card Logic
        cardNumInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            let formatted = '';
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) formatted += ' ';
                formatted += value[i];
            }
            e.target.value = formatted;
            numDisplay.textContent = formatted || '#### #### #### ####';
            
            if (value.startsWith('4')) frontLogo.innerHTML = '<i class="fab fa-cc-visa"></i>';
            else if (value.startsWith('5')) frontLogo.innerHTML = '<i class="fab fa-cc-mastercard"></i>';
            else if (value.startsWith('3')) frontLogo.innerHTML = '<i class="fab fa-cc-amex"></i>';
            else frontLogo.innerHTML = '';
        });

        cardNameInput.addEventListener('input', (e) => {
            nameDisplay.textContent = e.target.value.toUpperCase() || 'NOME NO CARTÃO';
        });

        cardExpiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
            expiryDisplay.textContent = value || 'MM/AA';
        });

        cardCvvInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            e.target.value = value;
            cvvDisplay.textContent = '*'.repeat(value.length) || '***';
        });

        cardCvvInput.addEventListener('focus', () => cardVisual.classList.add('flipped'));
        cardCvvInput.addEventListener('blur', () => cardVisual.classList.remove('flipped'));

        // Payment Method Toggle
        const methodChips = document.querySelectorAll('.method-chip');
        const cardFields = document.getElementById('card-details-fields');
        const pixFields = document.getElementById('pix-details');
        const pixStatus = document.getElementById('pix-status');

        methodChips.forEach(chip => {
            chip.addEventListener('click', () => {
                methodChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                const radio = chip.querySelector('input');
                radio.checked = true;

                if (radio.value === 'pix') {
                    cardFields.style.display = 'none';
                    pixFields.style.display = 'block';
                    cardVisual.style.opacity = '0.3';
                    btnText.textContent = 'Gerar QR Code';
                    pixStatus.style.display = 'none'; // Hide status until generated
                } else {
                    cardFields.style.display = 'block';
                    pixFields.style.display = 'none';
                    cardVisual.style.opacity = '1';
                    btnText.textContent = 'Confirmar Pagamento';
                }
            });
        });

        // Pix Copy Logic
        document.getElementById('btn-copy-pix').addEventListener('click', () => {
            const pixCode = document.getElementById('pix-code');
            pixCode.select();
            document.execCommand('copy');
            showNotification('Código Pix copiado!');
        });

        // Pix Simulate Paid Button
        document.getElementById('btn-simulate-paid').addEventListener('click', () => {
            const total = document.getElementById('cart-total-value').textContent;
            showNotification(`Pix de R$ ${total} recebido!`);
            
            setTimeout(() => {
                showNotification('Compra realizada com sucesso! Preparando seu pedido...');
                setTimeout(() => {
                    finishPurchase();
                }, 2000);
            }, 1500);
        });

        // Form Submit
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const method = paymentForm.querySelector('input[name="payment"]:checked').value;

            if (method === 'pix') {
                if (pixStatus.style.display === 'none') {
                    // Phase 1: Generate
                    btnSubmit.disabled = true;
                    btnText.textContent = 'Gerando...';
                    loader.style.display = 'inline-block';
                    
                    setTimeout(() => {
                        pixStatus.style.display = 'block';
                        btnSubmit.disabled = false;
                        btnText.textContent = 'Já paguei!';
                        loader.style.display = 'none';
                        showNotification('QR Code gerado! Cole o código no seu app.');
                    }, 1500);
                } else {
                    // Phase 2: Wait for simulated bank confirm
                    btnSubmit.disabled = true;
                    btnText.textContent = 'Aguardando confirmação...';
                    loader.style.display = 'inline-block';
                    
                    setTimeout(() => {
                        const total = document.getElementById('cart-total-value').textContent;
                        showNotification(`Pix de R$ ${total} recebido!`);
                        
                        setTimeout(() => {
                            showNotification('Compra realizada com sucesso! Preparando seu pedido...');
                            setTimeout(() => {
                                finishPurchase();
                            }, 2000);
                        }, 1500);
                    }, 20000); // 20 seconds "tolerance" as requested
                }
            } else {
                // Manual validation check for card fields
                const num = cardNumInput.value;
                const name = cardNameInput.value;
                const exp = cardExpiryInput.value;
                const cvv = cardCvvInput.value;

                if (!num || !name || !exp || !cvv) {
                    showNotification('Por favor, preencha todos os dados do cartão!');
                    return;
                }

                // Card flow
                btnSubmit.disabled = true;
                btnText.textContent = 'Processando...';
                loader.style.display = 'inline-block';

                setTimeout(() => {
                    finishPurchase();
                }, 2500);
            }
        });

        function finishPurchase() {
            alert('Parabéns! Sua compra foi realizada com sucesso.');
            cart = [];
            saveCart();
            updateCartUI();
            checkoutModal.classList.remove('active');
            
            // Reset for next time
            btnSubmit.disabled = false;
            btnText.textContent = 'Confirmar Pagamento';
            loader.style.display = 'none';
            paymentForm.reset();
            numDisplay.textContent = '#### #### #### ####';
            nameDisplay.textContent = 'NOME NO CARTÃO';
            expiryDisplay.textContent = 'MM/AA';
            cvvDisplay.textContent = '***';
            frontLogo.innerHTML = '';
            pixFields.style.display = 'none';
            cardFields.style.display = 'block';
            cardVisual.style.opacity = '1';
        }
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
