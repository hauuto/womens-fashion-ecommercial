function handleLogin() {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            // Retrieve user info from local storage
            const users = JSON.parse(localStorage.getItem("users")) || [];

            // Find the user by username
            const user = users.find(user => user.username === username && user.password === password);

            if (user) {
                sessionStorage.setItem("userRole", user.userRole); // Set user role in sessionStorage
                sessionStorage.setItem("username", user.username); // Set username in sessionStorage
                window.location.href = "homepage.html";
            } else {
                alert("Invalid username or password.");
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    handleLogin();
});