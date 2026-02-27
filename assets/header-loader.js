/**
 * Header Loader - Dynamically loads shared header template across all pages
 * Usage: Add <div id="header-container"></div> at the start of <body>
 *        Add <script src="assets/header-loader.js"></script> before closing </body>
 */

(function() {
    'use strict';

    // Determine the relative path to assets based on current page location
    function getAssetsPath() {
        const pathname = window.location.pathname;
        const depth = (pathname.match(/\//g) || []).length;
        // If file is in root: /index.html (depth 1), assets is ./assets
        // If file is in root: /index.html (depth 2 after domain), assets is ./assets
        // If file is in subdirectory: /subdir/page.html, assets is ../assets
        return depth > 2 ? '../assets/' : './assets/';
    }

    const assetsPath = getAssetsPath();
    const container = document.getElementById('header-container');

    if (!container) {
        console.warn('Header container not found. Add <div id="header-container"></div> to your page.');
        return;
    }

    // Fetch and insert the header template
    fetch(assetsPath + 'header.html')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load header');
            return response.text();
        })
        .then(html => {
            container.innerHTML = html;
            initializeHeader();
        })
        .catch(error => {
            console.error('Error loading header:', error);
            container.innerHTML = '<p style="color: red; padding: 20px;">Failed to load navigation header</p>';
        });

    /**
     * Initialize header functionality after template is loaded
     */
    function initializeHeader() {
        const menuBtn = document.getElementById('menuBtn');
        const sideNav = document.getElementById('sideNav');
        const closeNavBtn = document.getElementById('closeNavBtn');

        if (!menuBtn || !sideNav) {
            console.warn('Header elements not found after loading');
            return;
        }

        // Toggle mobile drawer
        menuBtn.addEventListener('click', (e) => {
            sideNav.classList.toggle('active');
            e.stopPropagation();
        });

        // Close when clicking outside of the drawer
        document.addEventListener('click', (e) => {
            if (!sideNav.contains(e.target) && sideNav.classList.contains('active')) {
                sideNav.classList.remove('active');
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

        // Close drawer when a navigation link is clicked
        const navLinks = sideNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                sideNav.classList.remove('active');
            });
        });
    }
})();
