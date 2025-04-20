    let products = [];

    fetch('../data/products.json')
    .then(res => res.json())
    .then(data => {
    products = data;
    displayProducts(products);
});

    function displayProducts(list) {
    const container = document.getElementById('productList');
    container.innerHTML = '';

    if (list.length === 0) {
    container.innerHTML = '<p>No products found.</p>';
    return;
}

    list.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';

    const firstImage = product.images && product.images.length > 0
    ? product.images[0]
    : 'https://via.placeholder.com/150';

    card.innerHTML = `
      <img src="${firstImage}" alt="${product.title}" class="product-img">
      <h4>${product.title}</h4>
      <p>Price: $${product.price}</p>
    `;
    container.appendChild(card);
});
}


    let selectedCategory = "";
    let selectedColor = "";

    document.addEventListener("DOMContentLoaded", () => {
    const categoryItems = document.querySelectorAll("#categoryFilter li");
    categoryItems.forEach(item => {
    item.addEventListener("click", () => {
    categoryItems.forEach(i => i.classList.remove("selected"));
    item.classList.add("selected");
    selectedCategory = item.dataset.category;
    applyFilter();
});
});

    const colorItems = document.querySelectorAll(".color-swatch");
    colorItems.forEach(item => {
    item.addEventListener("click", () => {
    colorItems.forEach(i => i.classList.remove("selected"));
    item.classList.add("selected");
    selectedColor = item.dataset.color;
    applyFilter();
});
});
});


    function applyFilter() {
    const min = parseFloat(document.getElementById('minPrice').value);
    const max = parseFloat(document.getElementById('maxPrice').value);

    const filtered = products.filter(p => {
    const matchCategory = selectedCategory === "" || p.category === selectedCategory;
    const matchColor = selectedColor === "" || p.color === selectedColor;
    const matchMin = isNaN(min) || p.price >= min;
    const matchMax = isNaN(max) || p.price <= max;
    return matchCategory && matchColor && matchMin && matchMax;
});

    displayProducts(filtered);
}
