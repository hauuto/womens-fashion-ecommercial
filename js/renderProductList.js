let products = [];
let currentIndex = 0;
const productsPerPage = 16; // 4 rows x 4 products

// Fetch products from JSON file
async function fetchProducts() {
    try {
        const response = await fetch('../data/products.json');
        products = await response.json();
        renderProducts();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Render products dynamically
function renderProducts() {
    const productGrid = document.getElementById('productGrid');
    const endIndex = Math.min(currentIndex + productsPerPage, products.length);

    for (let i = currentIndex; i < endIndex; i++) {
        const product = products[i];
        const productCard = `
      <div class="col">
        <div class="card h-100">
          <img src="${product.images[0]}" class="card-img-top" alt="${product.title}">
          <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">${product.price} ${product.currency}</p>
          </div>
        </div>
      </div>
    `;
        productGrid.insertAdjacentHTML('beforeend', productCard);
    }

    currentIndex = endIndex;

    // Hide "Load More" button if all products are loaded
    if (currentIndex >= products.length) {
        document.getElementById('loadMoreBtn').style.display = 'none';
    }
}

// Event listener for "Load More" button
document.getElementById('loadMoreBtn').addEventListener('click', renderProducts);

// Initialize product fetching
fetchProducts();