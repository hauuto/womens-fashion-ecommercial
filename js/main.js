async function loadHeaderFooter() {
    try {
        console.log('Fetching header.html...');
        const headerResponse = await fetch('../html/components/header.html');
        if (!headerResponse.ok) {
            throw new Error(`Failed to fetch header.html: ${headerResponse.status} ${headerResponse.statusText}`);
        }
        const header = await headerResponse.text();
        console.log('Header fetched successfully:', header.slice(0, 100));

        console.log('Fetching footer.html...');
        const footerResponse = await fetch('../html/components/footer.html');
        if (!footerResponse.ok) {
            throw new Error(`Failed to fetch footer.html: ${footerResponse.status} ${footerResponse.statusText}`);
        }
        const footer = await footerResponse.text();
        console.log('Footer fetched successfully:', footer.slice(0, 100));

        document.getElementsByTagName('header')[0].innerHTML = header;
        document.getElementsByTagName('footer')[0].innerHTML = footer;

        const navbar = document.getElementById('navBar');
        if (navbar) {
            let lastScrollTop = 0;
            window.addEventListener("scroll", function () {
                const st = window.scrollY || document.documentElement.scrollTop;
                if (st > lastScrollTop) {
                    navbar.style.top = "-100px";
                } else {
                    navbar.style.top = "0";
                }
                lastScrollTop = st <= 0 ? 0 : st;
            });
        }

        const cartOffcanvas = document.getElementById('offcanvasCart');
        const wishlistOffcanvas = document.getElementById('offcanvasWishlist');
        if (cartOffcanvas) {
            cartOffcanvas.addEventListener('show.bs.offcanvas', () => {
                updateCartUI();
                console.log('Cart offcanvas opened, UI updated');
            });
        }
        if (wishlistOffcanvas) {
            wishlistOffcanvas.addEventListener('show.bs.offcanvas', () => {
                updateWishlistUI();
                console.log('Wishlist offcanvas opened, UI updated');
            });
        }

        let attempts = 0;
        const maxAttempts = 5;
        const retryInterval = setInterval(() => {
            const cartContainer = document.querySelector('#offcanvasCart .offcanvas-body');
            const wishlistContainer = document.querySelector('#offcanvasWishlist .offcanvas-body');
            if (cartContainer && wishlistContainer) {
                updateCartUI();
                updateWishlistUI();
                console.log('Initial Cart and Wishlist UI updated successfully');
                clearInterval(retryInterval);
            } else {
                console.warn(`Offcanvas containers not found. Attempt ${attempts + 1}/${maxAttempts}`);
                attempts++;
                if (attempts >= maxAttempts) {
                    console.error('Failed to find offcanvas containers after max attempts');
                    clearInterval(retryInterval);
                }
            }
        }, 100);

        console.log('Header and footer loaded successfully.');
    } catch (error) {
        console.error('Error loading header or footer:', error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const defaultAdmin = {
        username: "admin",
        email: "admin@admin.com",
        password: "admin",
        userRole: "admin"
    };

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

        const dropdownMenu = document.getElementById("dropdownMenu");
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
    }, 200);
});

document.addEventListener('DOMContentLoaded', () => {
    const dropdownItems = document.querySelectorAll('.dropdown-menu .nav-link');

    dropdownItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            const filter = item.textContent.trim().toLowerCase();
            window.location.href = `../html/collection.html?filter=${filter}`;
        });
    });
});

// Hàm hỗ trợ giá tiền
function parsePrice(priceStr) {
    if (typeof priceStr === 'number') return priceStr;
    return parseInt(priceStr.replace(/\./g, ''), 10);
}

function formatPrice(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function getWishlist() {
    return JSON.parse(localStorage.getItem('wishlist')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function saveWishlist(wishlist) {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function addToCart(product, size) {
    console.log('Adding to cart:', product, size);
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id && item.size === size);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            priceNumber: parsePrice(product.price),
            currency: product.currency,
            image: product.images[0],
            size: size,
            quantity: 1,
            code: `${product.id}/02`
        });
    }
    console.log('Cart after adding:', cart);
    saveCart(cart);
    updateCartUI();
    alert(`${product.title} đã được thêm vào giỏ hàng!`);
}

function addToWishlist(product, size) {
    console.log('Adding to wishlist:', product, size);
    const wishlist = getWishlist();
    const existingItem = wishlist.find(item => item.id === product.id && item.size === size);

    if (!existingItem) {
        wishlist.push({
            id: product.id,
            title: product.title,
            price: product.price,
            priceNumber: parsePrice(product.price),
            currency: product.currency,
            image: product.images[0],
            size: size,
            code: `${product.id}/02`
        });
        console.log('Wishlist after adding:', wishlist);
        saveWishlist(wishlist);
        updateWishlistUI();
        alert(`${product.title} đã được thêm vào danh sách yêu thích!`);
    } else {
        alert(`${product.title} đã có trong danh sách yêu thích!`);
    }
}

function removeFromCart(productId, size) {
    const cart = getCart();
    const updatedCart = cart.filter(item => !(item.id === productId && item.size === size));
    saveCart(updatedCart);
    updateCartUI();
}

function removeFromWishlist(productId, size) {
    const wishlist = getWishlist();
    const updatedWishlist = wishlist.filter(item => !(item.id === productId && item.size === size));
    saveWishlist(updatedWishlist);
    updateWishlistUI();
}

function updateCartQuantity(productId, size, change) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId && item.size === size);

    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId, size);
        } else {
            saveCart(cart);
            updateCartUI();
        }
    }
}

function updateCartUI() {
    const cart = getCart();
    const cartContainer = document.querySelector('#offcanvasCart .offcanvas-body');
    const cartCounter = document.querySelector('[href="#offcanvasCart"] .counter') || document.querySelector('#offcanvasCart .counter');
    console.log('Updating Cart UI. Cart:', cart);
    console.log('Cart Container:', cartContainer);
    console.log('Cart Counter:', cartCounter);

    if (!cartContainer || !cartCounter) {
        console.error('Cart container or counter not found');
        return;
    }

    if (cart.length === 0) {
        cartContainer.innerHTML = '<h2>Your order</h2><p>Giỏ hàng trống</p>';
        cartCounter.textContent = '0';
        console.log('Cart is empty, set default empty message');
        return;
    }

    let total = 0;
    const cartHTML = `
        <h2>Your order</h2>
        ${cart.map(item => {
        const itemTotal = parsePrice(item.priceNumber || item.price) * item.quantity;
        total += itemTotal;
        return `
                <div class="product">
                    <div class="product-start">
                        <img src="${item.image}" alt="${item.title}">
                        <div class="product-desc">
                            <a href="#">${item.title}</a>
                            <p>Kích cỡ: ${item.size}</p>
                            <p class="product-code">${item.code}</p>
                        </div>
                    </div>
                    <div class="product-end">
                        <div class="quantity-controls">
                            <i class="fa fa-minus-circle" onclick="updateCartQuantity('${item.id}', '${item.size}', -1)"></i>
                            <span>${item.quantity}</span>
                            <i class="fa fa-plus-circle" onclick="updateCartQuantity('${item.id}', '${item.size}', 1)"></i>
                        </div>
                        <div class="product-price">${formatPrice(itemTotal)} ${item.currency}</div>
                        <i class="far fa-times-circle" onclick="removeFromCart('${item.id}', '${item.size}')"></i>
                    </div>
                </div>
            `;
    }).join('')}
        <div class="cart-total">
            <span>Total:</span>
            <span>${formatPrice(total)} ${cart[0].currency}</span>
        </div>
        <button class="checkout-btn">ОФОРМИТЬ ЗАКАЗ</button>
    `;

    console.log('Generated Cart HTML:', cartHTML);
    cartContainer.innerHTML = cartHTML;
    cartCounter.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    console.log('Cart UI updated. Counter set to:', cartCounter.textContent);
}

function updateWishlistUI() {
    const wishlist = getWishlist();
    const wishlistContainer = document.querySelector('#offcanvasWishlist .offcanvas-body');
    const wishlistCounter = document.querySelector('[href="#offcanvasWishlist"] .counter') || document.querySelector('#offcanvasWishlist .counter');
    console.log('Updating Wishlist UI. Wishlist:', wishlist);
    console.log('Wishlist Container:', wishlistContainer);
    console.log('Wishlist Counter:', wishlistCounter);

    if (!wishlistContainer || !wishlistCounter) {
        console.error('Wishlist container or counter not found');
        return;
    }

    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = '<h2>Favorites</h2><p>Danh sách yêu thích trống</p>';
        wishlistCounter.textContent = '0';
        console.log('Wishlist is empty, set default empty message');
        return;
    }

    const wishlistHTML = `
        <h2>Favorites</h2>
        ${wishlist.map(item => `
            <div class="product">
                <div class="product-start">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="product-desc">
                        <a href="#">${item.title}</a>
                        <p>Kích cỡ: ${item.size}</p>
                        <p class="product-code">${item.code}</p>
                    </div>
                </div>
                <div class="product-end">
                    <div class="product-price">${formatPrice(parsePrice(item.priceNumber || item.price))} ${item.currency}</div>
                    <i class="far fa-times-circle" onclick="removeFromWishlist('${item.id}', '${item.size}')"></i>
                </div>
            </div>
        `).join('')}
    `;

    console.log('Generated Wishlist HTML:', wishlistHTML);
    wishlistContainer.innerHTML = wishlistHTML;
    wishlistCounter.textContent = wishlist.length;
    console.log('Wishlist UI updated. Counter set to:', wishlistCounter.textContent);
}

document.addEventListener('DOMContentLoaded', function () {
    loadHeaderFooter();
});