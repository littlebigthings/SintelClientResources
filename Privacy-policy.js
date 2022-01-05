
var resizeTimer;
var tableContent;
function isInViewportCenter(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
function activateCategory(id) {
    tableContent = document.querySelectorAll('.sub-title');
    tableContent.forEach(cat => {
        if (cat.classList.contains("active")) {
            cat.classList.remove("active");
        }
        if (cat.dataset.id == id) {
            cat.classList.add("active");
        }
    })
}
$(window).on("scroll", function () {
        [...$(".content-wrapper h2")].forEach((ele) => {
            if (isInViewportCenter(ele)) {
                if ( ele.getBoundingClientRect().top >= 0 && ele.getBoundingClientRect().top <= 200 ) {
                    activateCategory(ele.id)
                }
            }
        });
});