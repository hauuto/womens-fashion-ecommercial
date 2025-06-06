// renderProductDetail.js


async function renderProductDetail(jsonPath = '../data/products.json') {
    try {
        // Lấy id từ URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        if (!productId) {
            console.error("Không tìm thấy ID sản phẩm trong URL");
            return;
        }

        // Fetch dữ liệu từ products.json
        const res = await fetch(jsonPath);
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const products = await res.json();

        // Tìm sản phẩm theo id
        const product = products.find(p => p.id === productId);
        if (!product) {
            console.error("Không tìm thấy sản phẩm với ID:", productId);
            return;
        }

        // Cập nhật tiêu đề trang
        document.title = `${product.title} - Arligent Product Details`;

        // Cập nhật chi tiết sản phẩm
        document.querySelector('.product-title').textContent = product.title;
        document.querySelector('.price').textContent = `${product.price} ${product.currency}`;
        document.querySelector('.sku').textContent = `ID: ${product.id}/02`;

        // Cập nhật mô tả sản phẩm
        const descriptionList = document.querySelector('.product-description');
        descriptionList.innerHTML = product.description
            .map((desc, index) => {
                if (index === 0) return ''; // Skip the first array
                if (index === 2) {
                    // Add "-" before each item in the second array
                    return desc.map(item => `<li>- ${item}</li>`).join('');
                }
                // Render other arrays as normal lists
                return desc.map(item => `<li>${item}</li>`).join('');
            })
            .join('<br>');

        // Cập nhật kích thước
        const sizeSelector = document.querySelector('.size-selector .sizes');
        sizeSelector.innerHTML = product.sizes.map(size => `<button class="btn text-start">${size}</button>`).join("");

        // Cập nhật ảnh chính
        const mainImage = document.querySelector('#mainImage');
        mainImage.src = product.images[0];
        mainImage.alt = product.title;

        // Cập nhật thumbnail ảnh
        const thumbs = document.querySelector('.thumbs');
        thumbs.innerHTML = product.images.map(img => `<img src="${img}" alt="${product.title}"/>`).join('');

        // Xử lý sự kiện cho gallery ảnh
        setupImageGallery(product.images);

        // Xử lý sự kiện chọn kích thước
        setupSizeSelector();

        // Xử lý sự kiện thêm vào giỏ hàng và danh sách yêu thích
        setupActionButtons(product);

    } catch (error) {
        console.error("Không thể load dữ liệu sản phẩm:", error);
    }
}

// Hàm thiết lập gallery ảnh
function setupImageGallery(images) {
    const mainImage = document.querySelector('#mainImage');
    const thumbs = document.querySelectorAll('.thumbs img');
    const prevArrow = document.querySelector('#prevArrow');
    const nextArrow = document.querySelector('#nextArrow');
    let currentIndex = 0;

    // Cập nhật ảnh chính khi click vào thumbnail
    thumbs.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            currentIndex = index;
            mainImage.src = images[currentIndex];
            updateThumbActive();
        });
    });

    // Cập nhật trạng thái active cho thumbnail
    function updateThumbActive() {
        thumbs.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === currentIndex);
        });
    }

    // Xử lý nút Previous
    prevArrow.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            mainImage.src = images[currentIndex];
            updateThumbActive();
        }
    });

    // Xử lý nút Next
    nextArrow.addEventListener('click', () => {
        if (currentIndex < images.length - 1) {
            currentIndex++;
            mainImage.src = images[currentIndex];
            updateThumbActive();
        }
    });

    // Khởi tạo trạng thái active cho thumbnail đầu tiên
    updateThumbActive();
}

// Hàm thiết lập chọn kích thước
function setupSizeSelector() {
    const sizeButtons = document.querySelectorAll('.size-selector .sizes button');
    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
}

function setupActionButtons(product) {
    const cartButton = document.querySelector('.btn.cart');
    const wishlistButton = document.querySelector('.btn.wishlist');
    const sizeButtons = document.querySelectorAll('.size-selector .sizes button');

    let selectedSize = null;

    // Cập nhật kích thước được chọn
    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectedSize = button.textContent;
        });
    });

    if (product.actions.addToCart) {
        cartButton.addEventListener('click', () => {
            if (!selectedSize) {
                alert('Vui lòng chọn kích cỡ trước khi thêm vào giỏ hàng!');
                return;
            }
            addToCart(product, selectedSize); // Gọi hàm từ cartWishlist.js
        });
    } else {
        cartButton.disabled = true;
    }

    if (product.actions.addToWishlist) {
        wishlistButton.addEventListener('click', () => {
            if (!selectedSize) {
                alert('Vui lòng chọn kích cỡ trước khi thêm vào danh sách yêu thích!');
                return;
            }
            addToWishlist(product, selectedSize); // Gọi hàm từ cartWishlist.js
        });
    } else {
        wishlistButton.disabled = true;
    }
}

// Gọi hàm render khi trang được load
document.addEventListener('DOMContentLoaded', () => {
    renderProductDetail();
});