import { res } from './ebook.js';

class RESOURCESCARD {
    constructor() {
        this.cardsArr = res;
        this.ebookSection = document.querySelector("[data-resource='ebook']");
        this.caseStudiesSection = document.querySelector("[data-resource='case-studies']");
        this.videoSection = document.querySelector("[data-resource='video']");
        this.webinarSection = document.querySelector("[data-resource='webinar']");
        this.init();
    }

    init() {
        this.removeCards([this.ebookSection,this.caseStudiesSection, this.videoSection, this.webinarSection]);
    }

    // function to delete already present cards.
    removeCards(cardsWrapperArr){
        cardsWrapperArr.forEach(container => {
            container.querySelectorAll(".reso-card").forEach(card => container.removeChild(card))
        });
    }
}

new RESOURCESCARD(res)

