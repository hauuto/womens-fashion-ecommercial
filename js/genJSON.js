const fs = require('fs');
const path = require('path');

const imagesDir = '../assets/images';
const outputFile = '../data/products.json';

function parseImageFilename(filename) {
    const match = filename.match(/^([a-zA-ZÀ-ỹ0-9]+)(\d{2})\.(jpg|png)$/i);
    if (!match) return null;

    const [_, collection, numberPart, ext] = match;
    const productNum = numberPart[0];
    const imageNum = numberPart[1];

    return {
        collection,
        productNum,
        imageNum,
        ext,
        filename
    };
}

function buildProductMap(images) {
    const productMap = {};

    for (const img of images) {
        const info = parseImageFilename(img);
        if (!info) continue;

        const key = `${info.collection}_${info.productNum}`;
        if (!productMap[key]) {
            productMap[key] = {
                id: 0, // sẽ cập nhật sau
                title: "Tên sản phẩm mẫu",
                price: "10000",
                currency: "VND",
                category: "Danh mục mẫu",
                collection: info.collection,
                tags: ["best seller"],
                images: [],
                sizes: ["S", "M", "L", "XL"],
                description: [
                    ["Mô tả ngắn"],
                    ["Mô tả chi tiết sản phẩm"],
                    ["Đặc điểm"],
                    ["Hướng dẫn sử dụng"],
                    ["Thông tin khác"]
                ],
                available: true,
                actions: {
                    addToCart: true,
                    addToWishlist: true
                }
            };
        }

        productMap[key].images.push(path.join("../assets/images", img));
    }

    return productMap;
}

function main() {
    const files = fs.readdirSync(imagesDir).filter(file => /\.(jpg|png)$/i.test(file));
    const productMap = buildProductMap(files);

    // Cập nhật id tăng dần
    let idCounter = 1;
    const products = Object.values(productMap).map(product => {
        product.id = idCounter.toString();
        idCounter++;
        return product;
    });

    fs.writeFileSync(outputFile, JSON.stringify(products, null, 2), 'utf8');
    console.log(`✅ Đã tạo xong file JSON: ${outputFile}`);
}

main();
