import { EBOOK } from './ebook.js';
import { CASESTUDIES } from './case-studies.js';
import { WEBINAR } from './webinar.js';
import { VIDEO } from './video.js';

class RESOURCESCARD {
    constructor(config) {
        this.info = config.resource.data;
        this.currentIndex = 0;
        this.sliceUpto = config.cardsToShow;
        this.incerementBy = config.cardsToShow;
        this.newArrFromInfo = this.info.slice(this.currentIndex, this.sliceUpto);
        this.container = config.container;
        this.btn = config.btn;
        this.card = this.container.querySelector(".reso-card").cloneNode(true);
        this.img = (this.container.querySelector("[data-img='signup']")) ? this.container.querySelector("[data-img='signup']").cloneNode() : null;
        this.modal = config.modal;
        this.video = config.video;
        this.closeBtn = config.closeBtn;
        this.imgIndex = config.bannerImgIndex;
        this.init()
    }

    init() {
        this.container.innerHTML = '';
        this.addCard(this.newArrFromInfo, this.card)
        this.loadMoreCards(this.btn);
    }

    // function to loop through the data, clone card, change data of the cloned card, add them into DOM.
    addCard(data, card) {
        // looping data.
        data.forEach(info => {
            // cloning card.
            let clonedCard = card.cloneNode(true);
            let cardTag = clonedCard.querySelector("[data-tagwrp='tagswrp']").querySelector("[data-tag='cardtag']").cloneNode();
            // changing the data of cloned card.
            clonedCard.querySelector("[data-img='cardimg']").removeAttribute("srcset");
            clonedCard.querySelector("[data-img='cardimg']").src = info.image.url;
            clonedCard.querySelector("[data-title='cardtitle']").innerHTML = info.name;
            clonedCard.querySelector("[data-desc='carddesc']").innerHTML = info.description;
            // code to trigger video modal.
            (info.video) ? clonedCard.querySelector("[data-img='cardimg']").setAttribute("data-src", this.filterSrc(info.video)) : "";
            (info.video) ? clonedCard.querySelector("[data-img='cardimg']").addEventListener('click', this.openModalAddvideo.bind(this)) : "";
            (info.video) ? clonedCard.querySelector("[data-src='videoSrc']").setAttribute("data-src", this.filterSrc(info.video)) : "";
            !(this.modal && this.video) ? clonedCard.querySelector("[data-link='cardlink']").href = info.slug : clonedCard.querySelector("[data-link='cardlink']").addEventListener('click', this.openModalAddvideo.bind(this));

            clonedCard.querySelector("[data-tagwrp='tagswrp']").innerHTML = '';
            info.tags.forEach(tag => {
                let cloneTag = cardTag.cloneNode(true);
                cloneTag.innerHTML = tag.name;
                clonedCard.querySelector("[data-tagwrp='tagswrp']").appendChild(cloneTag);
            })
            // adding card into container.
            if (this.container.childElementCount == this.imgIndex && this.img) {
                this.container.appendChild(this.img);
            }
            (this.container.childElementCount >= this.imgIndex) ? this.container.insertBefore(clonedCard, this.img) : this.container.appendChild(clonedCard);
        });
        this.scrollToSection(this.container)
        this.hideShowMoreBtn(this.sliceUpto, this.btn)
    }

    // function to listen to load more click, slice the array then add the cards based in new array.
    loadMoreCards(btn) {
        btn.addEventListener('click', () => {
            this.currentIndex = this.sliceUpto;
            this.sliceUpto += this.incerementBy;
            this.newArrFromInfo = this.info.slice(this.currentIndex, this.sliceUpto);
            this.addCard(this.newArrFromInfo, this.card);
        })
    }

    // function to hide and show buttons.
    hideShowMoreBtn(length, btn) {
        length >= this.info.length ? btn.style.display = "none" : '';
    }

    // open modal and append video link.
    openModalAddvideo(ev) {
        this.video.src = ev.currentTarget.getAttribute("data-src");
        this.modal.style.display = "flex";
        this.closeBtn.addEventListener('click', () => {
            this.video.src = ""
        });
    }

    // function to scroll to top of the section when user clicks in show more\
    scrollToSection(section) {
        let elDistanceToTop = window.pageYOffset + section.getBoundingClientRect().top;
        window.scrollTo({
            top: elDistanceToTop - 200,
            behavior: 'smooth'
        });
    }

    // fucntion to filter out src from video string
    filterSrc(str) {
        let re = /<iframe[^>]+src="([^">]+)/g
        let results = re.exec(str);
        return results[1];
    }
}


const CONFIGS = [{
    resource: EBOOK,
    container: document.querySelector("[data-resource='ebook']"),
    btn: document.querySelector("[data-btn='loadMoreEbook']"),
    cardsToShow: 1,
    bannerImgIndex: 3,
}, {
    resource: CASESTUDIES,
    container: document.querySelector("[data-resource='case-studies']"),
    btn: document.querySelector("[data-btn='loadMoreCaseStudies']"),
    cardsToShow: 1,
},
{
    resource: WEBINAR,
    container: document.querySelector("[data-resource='webinar']"),
    btn: document.querySelector("[data-btn='loadMoreWebinar']"),
    cardsToShow: 2,
},
{
    resource: VIDEO,
    container: document.querySelector("[data-resource='video']"),
    btn: document.querySelector("[data-btn='loadMoreVideo']"),
    cardsToShow: 2,
    modal: document.querySelector(".reso-video-popup-wrapper"),
    video: document.querySelector("[data-video='video']"),
    closeBtn: document.querySelector(".reso-popup-close-btn"),
},]

CONFIGS.forEach(config => new RESOURCESCARD(config))