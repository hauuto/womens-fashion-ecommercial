// Load header and footer
async function loadHeaderFooter() {
    try {
        const header = await fetch('../html/components/header.html').then(res => res.text());
        const footer = await fetch('../html/components/footer.html').then(res => res.text());
        document.getElementsByTagName('header')[0].innerHTML = header;
        document.getElementsByTagName('footer')[0].innerHTML = footer;

        // Add scroll animation to dynamically loaded header
        setTimeout(() => {
            const navbar = document.getElementById('navBar');
            if (navbar) {
                let lastScrollTop = 0;
                window.addEventListener("scroll", function () {
                    const st = window.scrollY || document.documentElement.scrollTop;
                    if (st > lastScrollTop) {
                        navbar.style.top = "-100px"; // Hide navbar on scroll down
                    } else {
                        navbar.style.top = "0"; // Show navbar on scroll up
                    }
                    lastScrollTop = st <= 0 ? 0 : st; // Prevent negative values
                });
            }
        }, 0); // Ensure the DOM is updated before accessing `navBar`

        console.log('Header and footer loaded successfully.');
    } catch (error) {
        console.error('Error loading header or footer:', error);
    }
}

// Initialize functions
document.addEventListener('DOMContentLoaded', function () {
    loadHeaderFooter();
});