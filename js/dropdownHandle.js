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
                <a class="dropdown-item" href="../html/admin_dashboard.html">Dashboard</a>
                <a class="dropdown-item" href="#">Admin Profile</a>
                <a class="dropdown-item" href="../html/logout.html">Logout</a>
            `;
            triggerButton.innerHTML = `<i class="fa-solid fa-user-shield"></i>`;
        } else if (userRole === "user") {
            console.log("Setting dropdown for user");
            dropdownMenu.innerHTML = `
                <a class="dropdown-item" href="../html/user_settings.html">Settings</a>
                <a class="dropdown-item" href="#">User Profile</a>
                <a class="dropdown-item" href="../html/logout.html">Logout</a>
            `;
            triggerButton.innerHTML = `<i class="fa-solid fa-user"></i>`;
        } else {
            console.log("No user role found, default dropdown remains");
        }
    }, 2000); // Delay of 2 seconds
});