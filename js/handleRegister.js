function handleRegister() {
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const username = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            const phoneNumber = document.getElementById("phoneNumber").value;
            const address = document.getElementById("address").value;
            const userRole = "user";

            // Retrieve existing users
            const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

            // Ensure the default admin exists
            const defaultAdmin = {
                username: "admin",
                email: "admin@admin.com",
                password: "admin",
                userRole: "admin"
            };
            const adminExists = existingUsers.some(user => user.username === defaultAdmin.username);
            if (!adminExists) {
                existingUsers.push(defaultAdmin);
            }

            // Check if the username or email already exists
            const userExists = existingUsers.some(user => user.username === username || user.email === email);
            if (userExists) {
                alert("A user with this username or email already exists.");
                return;
            }

            // Validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

            if (!emailRegex.test(email)) {
                alert("Invalid email format.");
                return;
            }

            if (!passwordRegex.test(password)) {
                alert("Password must be at least 8 characters long and include letters and numbers.");
                return;
            }

            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }

            // Save the new user
            const newUser = { username, email, password, phoneNumber, address, userRole };
            existingUsers.push(newUser);
            localStorage.setItem("users", JSON.stringify(existingUsers));
            alert("User registered successfully!");
            window.location.href = "login.html";
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    handleRegister();
});