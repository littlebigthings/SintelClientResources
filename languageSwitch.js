const languages = document.querySelectorAll(".lang-text");
const contentContainer = document.querySelectorAll(".content-wrapper");
const indicatorBlock = document.querySelector(".language-drop-toggle");
const languageContainer = document.querySelector(".lang-drop-list");

// function that add languages from dropdown into their corresponding content container.
function addAttr() {
    for (let index = 0; index < languages.length; index++) {
        contentContainer[index].setAttribute('content-lang', languages[index].dataset.lang);
    }
}

// function that listen to click events then show the selected language content.
function addListener() {
    indicatorBlock.addEventListener("click", () => {
        languageContainer.style.display == "none" ? languageContainer.style.display = "block" : languageContainer.style.display = "none" ;
    })
    languages.forEach(language => {
        language.addEventListener("click", (ev) => {
            let selectedLang = ev.target.dataset.lang;
            let showContainer = document.querySelector(`[content-lang=${selectedLang}]`);
            indicatorBlock.querySelector(".no-wrap").innerText = selectedLang;
            languageContainer.style.display = "none";
            contentContainer.forEach(container => {
                if (container != showContainer) {
                    container.style.display = "none";
                }
                else {
                    container.style.display = "block";
                }
            })
        })
        // for default language selection.
        language.dataset.lang == "en" && language.click();
    })
}

addAttr()
addListener()