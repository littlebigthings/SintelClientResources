
// left table data.
const sectionArr = [document.querySelectorAll("[two-col]"), document.querySelectorAll("[compare]")]
const headingContainer = document.querySelectorAll(".rich-text-block");
const table = document.querySelectorAll(".left-sidebar");
// chapter data.
const chapterContainer = document.querySelectorAll(".intent-pillar-card");
const contentContainer = document.querySelectorAll("[data-content]");
// var resizeTimer;
var tableContent;
// function to pull and put the section into their conrresponding block.
function pullAndPut(Obj) {
    Obj.forEach(section => {
        for (let index = 0; index < section.length; index++) {
            if (section[index].children.length == 0) {
                section[index + 1].parentElement.removeChild(section[index + 1]);
                section[index].appendChild(section[index + 1]);
                let img = section[index + 1].querySelector(".flow-step-list") != null ? section[index + 1].querySelector(".flow-step-list").lastElementChild.querySelector(".down-arrow") : "";
                img ? img.style.display = "none" : "";
                break;
            }
        }
    });
}
// function to check prev sibling present above h2 if not then remove the top-margin.
function removeMargin(headingContainer) {
    headingContainer.forEach(head => {
        head.querySelectorAll("h2").forEach(head => {
            head.previousElementSibling == null ? head.style.marginTop = 0 : "";
        });
    })
}

// convert text to slug code.
function convertToSlug(Text) {
    return Text.toLowerCase()
        .replace(/[^\w ]+/g, "")
        .replace(/ +/g, "-");
}

// function to set the data-attributes in right-table of contents.
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
    $(".left-sidebar")
        .children()
        .on("click", function () {
            let id = $(this).data("id");
            scrollFromTop(id, true);
        });
}

//function to set the id and data-attribute into chapter contents
function getAndSetChapterContents(eleBlock, tableEle) {
    const slugifyedText = tableEle.querySelectorAll(".display-inline-block")[1].innerHTML;
    tableEle.setAttribute("data-id", slugifyedText);
    eleBlock.setAttribute("id", slugifyedText);
    tableEle.addEventListener('click', (event) => {
        scrollFromTop(event.currentTarget.dataset.id)
    })
}

function scrollFromTop(id, leftCategory=false) {
    let el = document.getElementById(id);
    let elDistanceToTop = window.pageYOffset + el.getBoundingClientRect().top;
    let addTopDistance = leftCategory ? 100 : 0;
    let fromTop = window.screen.width < 766 ? addTopDistance : 80;
    window.scrollTo({
        top: elDistanceToTop - fromTop,
        behavior: "smooth",
    });
}
function addParams() {
    for (let index = 0; index < headingContainer.length; index++) {
        getAndSetTableContents(headingContainer[index], table[index]);
    }

    for (let index = 0; index < chapterContainer.length; index++) {
        getAndSetChapterContents(contentContainer[index], chapterContainer[index]);
    }
}

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
    tableContent = document.querySelectorAll('.b-intent-subtitle');
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
    [...$(".rich-text-block h2")].forEach((ele) => {
        if (isInViewportCenter(ele)) {
            if (ele.getBoundingClientRect().top >= 0 && ele.getBoundingClientRect().top <= 300) {
                activateCategory(ele.id);
                if (window.screen.width < 766 && ele.getBoundingClientRect().top <= 200) scrollList(ele.id);
            }
        }
    });
});

function scrollList(id) {
    let el = document.querySelector(`[data-id=${id}]`);
    el.scrollIntoView({
        behavior:"smooth",
        inline:"center",
        block:"nearest",
    });

}

pullAndPut(sectionArr);
removeMargin(headingContainer);
addParams();