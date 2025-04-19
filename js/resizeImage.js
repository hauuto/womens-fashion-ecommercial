// utils/imageUtils.js
export function resizeImage(imagePath, width, height) {
    const url = new URL(imagePath, window.location.origin);
    return `${url.pathname}?width=${width}&height=${height}`;
}