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






document.addEventListener("DOMContentLoaded", function () {
    const defaultAdmin = {
        username: "admin",
        email: "admin@admin.com",
        password: "admin", // Ensure this meets your password validation rules
        userRole: "admin"
    };

    // Check if the default admin already exists
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    const adminExists = existingUsers.some(user => user.username === defaultAdmin.username);

    if (!adminExists) {
        existingUsers.push(defaultAdmin);
        localStorage.setItem("users", JSON.stringify(existingUsers));
        console.log("Default admin created:", defaultAdmin);
    } else {
        console.log("Default admin already exists.");
    }
});



document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");

    setTimeout(() => {
        const userRole = sessionStorage.getItem("userRole");
        console.log("User role:", userRole);

        const dropdownMenu =  document.getElementById("dropdownMenu");
        const triggerButton = document.getElementById("triggerId");

        if (!dropdownMenu || !triggerButton) {
            console.error("Dropdown menu or trigger button not found");
            return;
        }

        if (userRole === "admin") {
            console.log("Setting dropdown for admin");
            dropdownMenu.innerHTML = `
                <a class="dropdown-item" href="../html/admin-manage.html">Manage</a>
                <a class="dropdown-item" href="../html/logout.html">Logout</a>
            `;
            triggerButton.innerHTML = `<i class="fa-solid fa-user-shield"></i>`;
        } else if (userRole === "user") {
            console.log("Setting dropdown for user");
            dropdownMenu.innerHTML = `
                <a class="dropdown-item" href="../html/user-profile.html">User Profile</a>
                <a class="dropdown-item" href="../html/logout.html">Logout</a>
            `;
            triggerButton.innerHTML = `<i class="fa-solid fa-user"></i>`;
        } else {
            console.log("No user role found, default dropdown remains");
        }
    }, 200); // Delay of 2 seconds
});


// Add event listeners to dropdown items
document.addEventListener('DOMContentLoaded', () => {
    const dropdownItems = document.querySelectorAll('.dropdown-menu .nav-link');

    dropdownItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            const filter = item.textContent.trim().toLowerCase(); // Get the filter name
            window.location.href = `../html/collection.html`; // Redirect with filter
        });
    });
});





