let products = [];
let currentIndex = 0;
const productsPerPage = 16; // 4 rows x 4 products
let currentFilters = {
    category: '',
    color: '',
    minPrice: null,
    maxPrice: null
};

// Hàm chuyển đổi giá từ chuỗi (xxx.xxx.xxx) thành số
function parsePrice(priceStr) {
    if (!priceStr) return null;
    // Loại bỏ dấu chấm và chuyển thành số
    return parseFloat(priceStr.replace(/\./g, ''));
}

// Fetch products from JSON file
async function fetchProducts() {
    try {
        const response = await fetch('../data/products.json');
        let allProducts = await response.json();

        // Apply filters
        products = allProducts.filter(product => {
            let isMatch = true;

            // Filter by category/collection
            if (currentFilters.category && currentFilters.category !== '') {
                if (currentFilters.category.toLowerCase() === 'áo khoác') {
                    // Check if any tag contains "Áo khoác" (case-insensitive)
                    isMatch = isMatch && product.tags.some(tag =>
                        tag.toLowerCase().includes('áo khoác')
                    );
                } else {
                    // For other categories, check product.category or product.collection
                    isMatch = isMatch && (
                        product.category === currentFilters.category ||
                        product.collection === currentFilters.category
                    );
                }
            }

            // Filter by color
            if (currentFilters.color && currentFilters.color !== '') {
                isMatch = isMatch && product.description.some(desc =>
                        Array.isArray(desc) && desc.some(item =>
                            item.toLowerCase().includes(`màu sắc: ${currentFilters.color}`)
                        )
                );
            }

            // Filter by price
            const price = parsePrice(product.price); // Convert product price to number
            if (currentFilters.minPrice !== null) {
                isMatch = isMatch && price >= currentFilters.minPrice;
            }
            if (currentFilters.maxPrice !== null) {
                isMatch = isMatch && price <= currentFilters.maxPrice;
            }

            return isMatch;
        });

        // Reset current index and render products
        currentIndex = 0;
        renderProducts();
        updateHeader(currentFilters.category);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Update the header dynamically
function updateHeader(filter = null) {
    const productListTitle = document.getElementById('productList');
    if (typeof filter === 'string' && filter.length > 0) {
        const formattedFilter = filter.charAt(0).toUpperCase() + filter.slice(1); // Capitalize the filter name
        productListTitle.textContent = `${formattedFilter}`;
    } else {
        productListTitle.textContent = 'Product List';
    }
}

// Render products dynamically
function renderProducts() {
    const productGrid = document.getElementById('productGrid');
    const endIndex = Math.min(currentIndex + productsPerPage, products.length);

    // Clear existing products if starting from the beginning
    if (currentIndex === 0) {
        productGrid.innerHTML = '';
    }

    // Update document title based on filtered products
    if (products.length > 0) {
        document.title = `Arligent - ${products[0].collection.charAt(0).toUpperCase() + products[0].collection.slice(1)}`;
    } else {
        document.title = `Arligent - No Products`;
    }

    for (let i = currentIndex; i < endIndex; i++) {
        const product = products[i];
        const productCard = `
      <div class="col">
        <div class="card h-100 text-center product-item" style="cursor: pointer;">
          <img src="${product.images[0]}" class="card-img-top" alt="${product.title}" style="object-fit: cover; height: 400px;">
          <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">${product.price} ${product.currency}</p>
          </div>
        </div>
      </div>
    `;
        productGrid.insertAdjacentHTML('beforeend', productCard);

        // Add click event listener for navigation
        const col = productGrid.lastElementChild;
        col.querySelector('.product-item').addEventListener('click', () => {
            window.location.href = `../html/product-detail.html?id=${product.id}`;
        });
    }

    currentIndex = endIndex;

    // Hide "Load More" button if all products are loaded
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (currentIndex >= products.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'inline';
    }
}

// Event listener for "Load More" button
document.getElementById('loadMoreBtn').addEventListener('click', renderProducts);

// Handle filter panel events
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    let filter = urlParams.get('filter'); // Get the filter from the query parameter

    if (filter === 'arliqueen') {
        filter = 'queen';
    }

    if (filter) {
        currentFilters.category = filter;
    }

    // Category filter
    const categoryItems = document.querySelectorAll('#categoryFilter li');
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            categoryItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');

            currentFilters.category = item.dataset.category;
            fetchProducts();
        });
    });

    // Color filter
    const colorSwatches = document.querySelectorAll('#colorFilter .color-swatch');
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            // Remove active class from all swatches
            colorSwatches.forEach(s => s.classList.remove('active'));
            // Add active class to clicked swatch
            swatch.classList.add('active');

            currentFilters.color = swatch.dataset.color;
            fetchProducts();
        });
    });

    // Price range filter
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');

    minPriceInput.addEventListener('input', () => {
        // Accept input with or without dots (e.g., 1000000 or 1.000.000)
        const value = minPriceInput.value.replace(/\./g, '');
        currentFilters.minPrice = value ? parseFloat(value) : null;
        fetchProducts();
    });

    maxPriceInput.addEventListener('input', () => {
        // Accept input with or without dots (e.g., 2000000 or 2.000.000)
        const value = maxPriceInput.value.replace(/\./g, '');
        currentFilters.maxPrice = value ? parseFloat(value) : null;
        fetchProducts();
    });

    // Initial fetch with query parameter filter (if any)
    fetchProducts();
});