document.addEventListener("DOMContentLoaded", function () {
    // Đảm bảo admin mặc định chỉ thêm một lần khi load trang
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const adminExists = users.some(user => user.username === "admin");
    if (!adminExists) {
        users.push({
            username: "admin",
            email: "admin@admin.com",
            password: "admin",
            userRole: "admin"
        });
        localStorage.setItem("users", JSON.stringify(users));
    }

    // Hàm xử lý đăng ký
    function handleRegister(e) {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const phoneNumber = document.getElementById("phoneNumber").value.trim();
        const address = document.getElementById("address").value.trim();
        const userRole = "user";

        const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

        const userExists = existingUsers.some(user =>
            user.username === username ||
            user.email === email ||
            user.phoneNumber === phoneNumber
        );

        if (userExists) {
            alert("A user with this username, email, or phone number already exists.");
            return;
        }

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

        const newUser = { username, email, password, phoneNumber, address, userRole };
        existingUsers.push(newUser);
        localStorage.setItem("users", JSON.stringify(existingUsers));
        alert("User registered successfully!");
        window.location.href = "login.html";
    }

    // Gắn sự kiện submit cho form
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", handleRegister);
    }
});