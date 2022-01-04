const toggleBtns = document.querySelectorAll(".nav-toggle");
const arrows = document.querySelectorAll(".dropdown-arrow");

function rotateArrow(){
    toggleBtns.forEach(toggle => {
        toggle.addEventListener("click", (eve) => {
            let clickedEle = eve.target.querySelector(".dropdown-arrow");
            arrows.forEach(arrow => {
                if(arrow != clickedEle){
                arrow.classList.contains("up-down") && arrow.classList.remove("up-down");
                }
            })
            clickedEle.classList.contains("up-down") ? clickedEle.classList.remove("up-down") : clickedEle.classList.add("up-down");
        })
    })
}

if(window.screen.width < 991)rotateArrow();