document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');

    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });

    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    // --- 360 Showcase Logic ---
    const books = [
        {
            title: "O Silêncio das Estrelas",
            author: "Por Marina Silva",
            image: "images/book1.png"
        },
        {
            title: "Entre Páginas e Destinos",
            author: "Por Lucas Oliveira",
            image: "images/book2.png"
        },
        {
            title: "A Última Biblioteca",
            author: "Por Helena Santos",
            image: "images/book3.png"
        },
        {
            title: "Sombras de Papel",
            author: "Por Ricardo Lima",
            image: "images/book4.png"
        }
    ];

    let currentIndex = 0;
    const bookElement = document.getElementById('book-element');
    const showcaseImg = document.getElementById('showcase-img');
    const showcaseImgBack = document.getElementById('showcase-img-back');
    const bookTitle = document.getElementById('book-title');
    const bookAuthor = document.getElementById('book-author');
    const bookInfo = document.getElementById('book-info');

    // Initial state
    bookInfo.classList.add('active');

    function updateShowcase() {
        currentIndex = (currentIndex + 1) % books.length;
        const currentBook = books[currentIndex];

        // 1. Start rotation
        bookElement.classList.add('rotating');
        
        // Hide info temporarily
        bookInfo.classList.remove('active');

        // 2. Midway through rotation (around 2s), update images
        // The rotation takes 4s total (defined in CSS)
        setTimeout(() => {
            showcaseImg.src = currentBook.image;
            showcaseImgBack.src = currentBook.image;
            bookTitle.textContent = currentBook.title;
            bookAuthor.textContent = currentBook.author;
        }, 2000);

        // 3. End of rotation
        setTimeout(() => {
            bookElement.classList.remove('rotating');
            bookInfo.classList.add('active');
        }, 4000);
    }

    // Cycle timing: 4s rotation + 3s pause = 7s total interval
    setInterval(updateShowcase, 7000);

    // --- Smooth Anchor Navigation ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
