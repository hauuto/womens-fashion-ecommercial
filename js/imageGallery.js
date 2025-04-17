function initializeImageGallery(mainImageId, thumbnailsSelector, prevArrowId, nextArrowId) {
    const mainImage = document.getElementById(mainImageId);
    const thumbnails = document.querySelectorAll(thumbnailsSelector);
    const prevArrow = document.getElementById(prevArrowId);
    const nextArrow = document.getElementById(nextArrowId);
    let currentIndex = 0;

    function setActive(index) {
        mainImage.classList.add('fade-out');

        // Wait for fade-out before changing src
        setTimeout(() => {
            mainImage.src = thumbnails[index].src;

            // Remove fade class after image has changed
            mainImage.onload = () => {
                mainImage.classList.remove('fade-out');
            };

            thumbnails.forEach(img => img.classList.remove('selected'));
            thumbnails[index].classList.add('selected');
            currentIndex = index;
        }, 200); // Half the transition time (optional)
    }

    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            setActive(index);
        });
    });

    prevArrow.addEventListener('click', () => {
        let newIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
        setActive(newIndex);
    });

    nextArrow.addEventListener('click', () => {
        let newIndex = (currentIndex + 1) % thumbnails.length;
        setActive(newIndex);
    });

    setActive(0); // Initial highlight
}


document.addEventListener("DOMContentLoaded", function () {
    initializeImageGallery('mainImage', '.thumbs img', 'prevArrow', 'nextArrow');
});