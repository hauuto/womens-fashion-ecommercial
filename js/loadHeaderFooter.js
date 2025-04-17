/**
 * Loads header and footer from external HTML files.
 */
async function loadHeaderFooter() {
    try {
        const header = await fetch("../html/components/header.html").then((res) => res.text());
        const footer = await fetch("../html/components/footer.html").then((res) => res.text());
        document.getElementsByTagName("header")[0].innerHTML = header;
        document.getElementsByTagName("footer")[0].innerHTML = footer;
        console.log("Header and footer loaded successfully.");
    } catch (error) {
        console.error("Error loading header/footer:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    loadHeaderFooter();
});