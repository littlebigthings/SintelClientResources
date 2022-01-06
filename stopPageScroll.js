const popUp = document.querySelectorAll("[popup]");


function  addListener(){
    popUp.forEach(btn => {
        btn.addEventListener("click", (ev)=>{
            let ele = ev.currentTarget.getAttribute("popup");
            if(ele === "open"){
                document.body.classList.add("not-scroll");
            }
            else if(ele === "close"){
                document.body.classList.remove("not-scroll");
            }
        })
    })
}

if(popUp)addListener();