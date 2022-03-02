class FROMEVENT {
    constructor(formEle, formId) {
        this.$form = formEle;
        this.formID = formId;
        this.$emailInput = this.$form.querySelector("[data='hsbemail']");
        this.$fullName = this.$form.querySelector("[data='hsbname']");
        this.$companyName = this.$form.querySelector("[data='hsbcompany']");
        this.$errorBlock = this.$form.parentElement.querySelector(".w-form-fail");
        this.redirectUrl = this.$form.querySelector("form").dataset.redirect;
        this.$btn = this.$form.querySelector("[data-btn='submit']");
        this.init();
    }
    init() {
        this.activateEvents();
    }
    
    activateEvents() {
        if(this.$form != undefined || this.$form != null){

            this.$form.addEventListener("submit", (e) => {
                e.stopPropagation();
                e.preventDefault();
                this.$btn.value = "Please wait..."
                this.hideMsg();
                let resp = this.submitForm();
                resp.then(res => {
                    if (res) {
                        if(res.status != "error"){
                            if (res.redirectUri) window.location.href = this.redirectUrl;
                        }
                        else if(res.status == "error"){
                            if(res.errors[0].message.length != 0){
                                this.showMsg(true, res.errors[0].message);
                            }
                            else{
                                this.showMsg(true, `Something went wrong. Try again later.`);
                            }
                        }
                    }
                })
                .catch(err => {
                    this.showMsg(true, `Oops! Something went wrong while submitting the form. Try again later.`);
                })
            });
        }
    }
    
    async submitForm() {
        var HSBDATA = {
            userEmail: this.$emailInput.value,
            fullName: this.$fullName.value,
        }
        
        try {
            if (HSBDATA.userEmail.length <= 0) throw "Cannot be empty";
            const resFromHS = await this.sendDataToHS(HSBDATA);
            return resFromHS;
        } catch (error) {
            this.showMsg(true, `Oops! Something went wrong while submitting the form. Try again later.`);
        }
    }
   
    async sendDataToHS(HSBDATA) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const hutk = document.cookie.replace(
            /(?:(?:^|.*;\s*)hubspotutk\s*\=\s*([^;]*).*$)|^.*$/,
            "$1"
        );

        var raw = {
            fields: [
                {
                    name: "email",
                    value: HSBDATA.userEmail,
                },
                {
                    name: "firstname",
                    value: HSBDATA.fullName,
                },
            ],
        };

        if (this.$companyName != undefined || this.$companyName != null) {
            raw.fields.push({
                name: "company",
                value: this.$companyName.value,
            })
        }

        if (hutk.length > 0) {
            raw.context.push({
                hutk,
            })
        }

        let data = JSON.stringify(raw);

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: data,
        };

        const res = await fetch(
            `https://api.hsforms.com/submissions/v3/integration/submit/7119044/${this.formID}`,

            requestOptions
        );

        if (!res.ok){
            if(res.status == "error"){
                if(res.errors[0].message.length != 0){
                    this.showMsg(true, res.errors[0].message);
                }
                else{
                    this.showMsg(true, `Something went wrong. Try again later.`);
                }
            }
        }
        const resData = await res.json();
        return resData;
    }

    showMsg(isInvalid, customMsg) {
        const msg = customMsg || "Please fill all required fields";

        if (isInvalid) {
            this.$errorBlock.style.display = "block";
            this.$errorBlock.innerHTML = msg;
            this.$btn.value = "Retry"
        } else {
            this.$errorBlock.style.display = "none";
        }
    }

    hideMsg() {
        this.$errorBlock.style.display = "none";
    }
}


const CONVERSIONFROM = document.querySelectorAll("[data-form=hsb-form]");
// const formId = "c1e2617d-8bf8-4edb-8294-e8a2742da8fb"; //form Id for Ebook & case studies.
const formId = "e507513c-0293-4ba8-94b1-390539136158"; //form id for webinar
if(CONVERSIONFROM.length != 0 || CONVERSIONFROM.length > 0){
    CONVERSIONFROM.forEach(form => {
        new FROMEVENT(form, formId);
    })
}