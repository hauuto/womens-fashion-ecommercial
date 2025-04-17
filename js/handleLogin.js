/**
 * Handles user login.
 */
function handleLogin() {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            // Retrieve user info from local storage
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));

            if (!userInfo) {
                alert("No user found. Please register first.");
                return;
            }

            if (userInfo.email === email && userInfo.password === password) {
                alert("Login successful!");
                window.location.href = "homepage.html";
            } else {
                alert("Invalid email or password.");
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    handleLogin();
});