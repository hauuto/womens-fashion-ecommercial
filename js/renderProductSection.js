function renderProductSection(containerId, paginationId, filterFn = (products) => products, jsonPath = '../data/products.json') {
    let itemsPerPage = 4; // Mặc định cho màn hình lớn
    let currentPage = 1;
    let products = [];

    // Hàm kiểm tra kích thước màn hình và cập nhật itemsPerPage
    function updateItemsPerPage() {
        if (window.innerWidth < 992) {
            itemsPerPage = 2;
        } else {
            itemsPerPage = 4;
        }
        currentPage = Math.min(currentPage, Math.ceil(products.length / itemsPerPage));
        renderProducts();
        renderPagination();
    }

    // Fetch dữ liệu từ JSON và áp dụng filter
    async function fetchProducts() {
        try {
            const res = await fetch(jsonPath);
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            products = await res.json();
            products = filterFn(products); // Áp dụng filter
            console.log("Filtered products:", products);
            updateItemsPerPage();
        } catch (error) {
            console.error("Không thể load dữ liệu:", error);
        }
    }

    // Render sản phẩm với sự kiện click để điều hướng theo URL từ JSON
    function renderProducts() {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const visibleProducts = products.slice(start, end);

        const list = document.getElementById(containerId);
        list.innerHTML = '';

        visibleProducts.forEach(p => {
            const col = document.createElement('div');
            col.className = 'col';
            col.innerHTML = `
            <div class="card h-100 text-center product-item" style="cursor: pointer;">
              <img src="${p.images[0]}" class="card-img-top" alt="${p.title}" style="object-fit: cover; height: 200px;">
              <div class="card-body">
                <h6 class="fw-bold">${p.title}</h6>
                <p class="text-muted small">${p.description[0]}</p>
                <p>${p.price}</p>
              </div>
            </div>`;
            // Thêm sự kiện click để điều hướng theo URL từ JSON
            col.querySelector('.product-item').addEventListener('click', () => {
                window.location.href = `../html/product-detail.html?id=${p.id}`;
            });
            list.appendChild(col);
        });
    }

    // Render pagination với Previous/Next và thu gọn động
    function renderPagination() {
        const pageCount = Math.ceil(products.length / itemsPerPage);
        const pagination = document.getElementById(paginationId);
        pagination.innerHTML = '';

        // Nút Previous
        const prevLi = document.createElement('li');
        prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
        prevLi.innerHTML = `<button class="page-link" "><i class="fa-solid fa-arrow-left"></i></button>`;
        prevLi.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderProducts();
                renderPagination();
            }
        });
        pagination.appendChild(prevLi);

        // Thu gọn pagination
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(pageCount, currentPage + 2);

        if (endPage - startPage + 1 < maxVisiblePages) {
            if (startPage === 1) {
                endPage = Math.min(pageCount, startPage + maxVisiblePages - 1);
            } else if (endPage === pageCount) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }
        }

        if (startPage > 1) {
            const firstPageLi = document.createElement('li');
            firstPageLi.className = 'page-item';
            firstPageLi.innerHTML = `<button class="page-link">1</button>`;
            firstPageLi.addEventListener('click', () => {
                currentPage = 1;
                renderProducts();
                renderPagination();
            });
            pagination.appendChild(firstPageLi);

            if (startPage > 2) {
                const ellipsisLi = document.createElement('li');
                ellipsisLi.className = 'page-item';
                ellipsisLi.innerHTML = `<span class="ellipsis">...</span>`;
                pagination.appendChild(ellipsisLi);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const li = document.createElement('li');
            li.className = `page-item ${i === currentPage ? 'active' : ''}`;
            li.innerHTML = `<button class="page-link">${i}</button>`;
            li.addEventListener('click', () => {
                currentPage = i;
                renderProducts();
                renderPagination();
            });
            pagination.appendChild(li);
        }

        if (endPage < pageCount) {
            if (endPage < pageCount - 1) {
                const ellipsisLi = document.createElement('li');
                ellipsisLi.className = 'page-item';
                ellipsisLi.innerHTML = `<span class="ellipsis">...</span>`;
                pagination.appendChild(ellipsisLi);
            }

            const lastPageLi = document.createElement('li');
            lastPageLi.className = 'page-item';
            lastPageLi.innerHTML = `<button class="page-link">${pageCount}</button>`;
            lastPageLi.addEventListener('click', () => {
                currentPage = pageCount;
                renderProducts();
                renderPagination();
            });
            pagination.appendChild(lastPageLi);
        }

        // Nút Next
        const nextLi = document.createElement('li');
        nextLi.className = `page-item ${currentPage === pageCount ? 'disabled' : ''}`;
        nextLi.innerHTML = `<button class="page-link"><i class="fa-solid fa-arrow-right"></i></button>`;
        nextLi.addEventListener('click', () => {
            if (currentPage < pageCount) {
                currentPage++;
                renderProducts();
                renderPagination();
            }
        });
        pagination.appendChild(nextLi);
    }

    // Cập nhật itemsPerPage khi thay đổi kích thước màn hình
    window.addEventListener('resize', updateItemsPerPage);

    // Load dữ liệu khi hàm được gọi
    fetchProducts();
}

//best seller
renderProductSection('product-list', 'pagination', (products) => {
    return products.filter(p => p.tags.includes('best seller'));
}, '../data/products.json');
