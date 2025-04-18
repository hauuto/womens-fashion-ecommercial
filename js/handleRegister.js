/**
 * Handles user registration.
 */
function handleRegister() {
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const username = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            const userRole = "user" // Get user role

            // Regex validation
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

            // Save to local storage
            const userInfo = { username, email, password, userRole };
            window.location.href = "login.html";
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    handleRegister();
});