const featureTab = document.querySelectorAll(".feature-tab");

// adding attribute into tabs
function addAttrToTabs(){
    featureTab.forEach(fetTab =>{
        fetTab.setAttribute("isactive", true)
    })
}
// reset everything
function resetAllTabs() {
    if (!featureTab) return;
    featureTab.forEach(tabItem => {
        if (tabItem.getAttribute("isactive") == "true") {
            tabItem.setAttribute("isactive", false);
            let contentBox = tabItem.querySelector(".feature-content");
            let arrow = tabItem.querySelector(".feature-arrow");
            gsap.to(contentBox, { height: "0", ease: "circ.out", duration: 0.1, });
            gsap.to(tabItem, { color: "#5f95fc", ease: "circ.out", duration: 0.1, });
            gsap.to(arrow, { rotation:"-90deg", ease: "circ.out", duration: 0.1,})

        }
    })
}

//listen to click events on tabs and animate
function listenToevents() {
    featureTab.forEach(tab => {
        tab.addEventListener("click", (evt) => {
            let clickedOn = evt.currentTarget;
            if (clickedOn.getAttribute("isactive") == "false") {
                resetAllTabs();
                clickedOn.setAttribute("isactive", true);
                let getContentTab = clickedOn.querySelector(".feature-content");
                let elToMeasure = getContentTab.querySelector(".para-16-24");
                let arrow = clickedOn.querySelector(".feature-arrow");
                let increaseHeight = parseInt(window.getComputedStyle(elToMeasure).getPropertyValue('margin-bottom')) + parseInt(window.getComputedStyle(elToMeasure).getPropertyValue('height'));
                gsap.to(clickedOn, { color: "#340d45", ease: "circ.out", duration: 0.1, });
                gsap.to(arrow, { rotation: "0deg", ease: "circ.out", duration: 0.1, })
                gsap.to(getContentTab, { color: "#340d45", height: increaseHeight, ease: "circ.out", duration: 0.1, });
            }
        })
    })
}

addAttrToTabs();
resetAllTabs();
listenToevents();