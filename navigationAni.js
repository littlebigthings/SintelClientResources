class NAVIGATIONANI{
    constructor(){
        this.navigationMenu = document.querySelector(".navbar");
        this.menuItems = this.navigationMenu.querySelectorAll(".nav-toggle");
        this.loginBtn = this.navigationMenu.querySelector(".nav-link");
        this.searchInput = this.navigationMenu.querySelector(".nav-search-input");
        this.setColor = "white";
        this.resetColor = "#340d45";
        // this.inputColor = "#4d265d";
        this.inputBackColor = "#340d451a";
        this.inputReset = "#ffffff1a";
        // this.inputTextReset = "#ffffff40";
        this.init();
    }

    init(){
        !(this.navigationMenu.classList.contains("white-navbar"))&&this.startListener();
    }

    // function listen to window scroll -> animate the navigation menu.
    startListener(){
        document.addEventListener("scroll", () => {
            const offset = window.pageYOffset;
            if(offset > 40)this.changeNav();
            if(offset < 40)this.resetNav();
        })
    }

    // function will change the style of navbar on scroll.
    changeNav(){
        this.navigationMenu.style.backgroundColor = this.setColor;
        this.loginBtn.style.color = this.resetColor;
        this.searchInput.style.borderColor = this.inputBackColor;
        this.searchInput.style.backgroundColor = this.inputBackColor;
        // this.searchInput.style.color = this.inputColor;
        this.searchInput.classList.add('placeholder');
        this.menuItems.forEach(item => {
            if(item.style.color != this.resetColor)item.style.color = this.resetColor;
        })
    }
    
    // function to reset the style of navbar
    resetNav(){
        this.navigationMenu.style.backgroundColor = this.resetColor;
        this.loginBtn.style.color = this.setColor;
        this.searchInput.style.borderColor = this.inputReset;
        this.searchInput.style.backgroundColor = this.inputReset;
        // this.searchInput.style.color = this.inputTextReset;
        this.searchInput.classList.remove('placeholder');
        this.menuItems.forEach(item => {
            if(item.style.color != this.setColor)item.style.color = this.setColor;
        })
    }
}

if(window.screen.width > 992)new NAVIGATIONANI();