

let products = [];
let currentIndex = 0;
const productsPerPage = 16; // 4 rows x 4 products

// Fetch products from JSON file
async function fetchProducts(filterFn = null) {
    try {
        const response = await fetch('../data/products.json');
        let allProducts = await response.json();

        // Apply filter if provided
        products = filterFn ? allProducts.filter(filterFn) : allProducts;

        // Reset current index and render products
        currentIndex = 0;
        renderProducts();
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

// Add event listeners to dropdown items
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    var filter = urlParams.get('filter'); // Get the filter from the query parameter
    updateHeader(filter);
    if (filter === 'arliqueen'){
        filter = 'queen'
    }

    if (filter) {
        fetchProducts((product) => product.collection === filter); // Apply the filter
    } else {
        fetchProducts(); // Render all products if no filter
    }
});