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
            if (ele.getBoundingClientRect().top >= 0 && ele.getBoundingClientRect().top <= 200) {
                activateCategory(ele.id)
            }
        }
    });
});

function convertToSlug(Text) {
    return Text.toLowerCase()
        .replace(/[^\w ]+/g, "")
        .replace(/ +/g, "-");
}
function getAndSetTableContents(eleBlock, tableEle) {
    const tableChild = $(tableEle).children().eq(0);
    $(tableEle).empty();
    $(eleBlock)
        .find("h2")
        .each(function () {
            const headingTitle = $(this).text();
            const slugifyedText = convertToSlug(headingTitle);
            $(this).attr("id", slugifyedText);
            $(tableEle).append(
                tableChild.clone(true).text(headingTitle).attr("data-id", slugifyedText)
            );
        });
    $(".table-of-content")
        .children()
        .on("click", function () {
            let id = $(this).data("id");
            scrollFromTop(id);
        });
}
function scrollFromTop(id) {
    let el = document.getElementById(id);
    let elDistanceToTop = window.pageYOffset + el.getBoundingClientRect().top;
    window.scrollTo({
        top: elDistanceToTop - (window.screen.width > 992 ? 80 : 20),
        behavior: "smooth",
    });
}
getAndSetTableContents($(".content-wrapper"), $(".table-of-content"));