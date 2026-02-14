// Common Header Component - Dynamically injects consistent header across all pages
const HEADER_CONFIG = {
    logoText: 'Balaji Sweets',
    logoImage: 'images/logo.jpg',
    navLinks: [
        { href: 'our-story', text: 'OUR STORY' },
        { href: 'menu', text: 'MENU' },
        { href: 'specials', text: 'SPECIALS' },
        { href: 'festive-gifting', text: 'FESTIVE GIFTING' },
        { href: 'feedback', text: 'FEEDBACK' },
        { href: 'contact', text: 'CONTACT' }
    ]
};

function injectCommonHeader() {
    const headerContainer = document.getElementById('header-container');
    if (!headerContainer) return;

    // Check if header already injected
    if (headerContainer.querySelector('header')) return;

    const isMobile = window.innerWidth <= 600;
    
    let navLinksHTML = HEADER_CONFIG.navLinks.map(link => 
        `<a href="${link.href}">${link.text}</a>`
    ).join('');

    let headerHTML = `
    <div class="top-bar">
        <span>We cater for all your special occasions</span>
    </div>

    <header>
        <nav>
            <div class="nav-column-left">
                <img src="${HEADER_CONFIG.logoImage}" alt="Balaji Logo" class="site-logo">
            </div>

            <div class="nav-column-center">
                <div class="nav-logo-text">${HEADER_CONFIG.logoText}</div>
            </div>

            <div class="nav-column-right">
                <div class="hamburger" id="menuBtn">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>

            <div class="nav-menu" id="sideNav">
                <button class="close-btn" id="closeNavBtn" aria-label="Close menu">×</button>
                ${navLinksHTML}
            </div>
        </nav>
    </header>
    `;

    headerContainer.innerHTML = headerHTML;
    initMobileMenu();
}

function initMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const sideNav = document.getElementById('sideNav');
    const closeNavBtn = document.getElementById('closeNavBtn');

    if (!menuBtn || !sideNav) return;

    // Toggle mobile drawer
    menuBtn.addEventListener('click', (e) => {
        sideNav.classList.toggle('active');
        e.stopPropagation();
    });

    // Close when clicking outside of the drawer - use event delegation
    // This is more reliable than setTimeout
    document.addEventListener('click', function closeMenuOnClickOutside(e) {
        if (sideNav.classList.contains('active')) {
            // Check if click is outside the sideNav and not on the hamburger button
            if (!sideNav.contains(e.target) && e.target !== menuBtn && !menuBtn.contains(e.target)) {
                sideNav.classList.remove('active');
            }
        }
    });

    // Close button inside drawer
    if (closeNavBtn) {
        closeNavBtn.addEventListener('click', (e) => {
            sideNav.classList.remove('active');
            e.stopPropagation();
        });
        closeNavBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                sideNav.classList.remove('active');
            }
        });
    }
}

// Simple Header for sub-pages (no hamburger, just logo and back link)
function injectSimpleHeader() {
    const headerContainer = document.getElementById('header-container');
    if (!headerContainer) return;

    if (headerContainer.querySelector('header')) return;

    headerContainer.innerHTML = `
    <header>
        <div class="wrap">
            <div class="logo">Balaji Sweets</div>
            <nav>
                <a href="index">Home</a>
            </nav>
        </div>
    </header>
    `;
}

// Auto-inject on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Delay slightly to ensure DOM is ready
        setTimeout(injectCommonHeader, 0);
    });
} else {
    setTimeout(injectCommonHeader, 0);
}

