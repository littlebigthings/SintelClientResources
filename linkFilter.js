const linkArr = document.querySelectorAll(".two-col-flex");

// function remove the domain name and other unrequired info from link and add only path.
function filterLink(){
    linkArr.forEach(ele =>{
        if(ele.href){
            ele.href = ele.pathname
        }
    })
}

if(linkArr)filterLink();