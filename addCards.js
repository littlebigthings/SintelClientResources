import { EBOOK } from "./ebook.js";
import { CASESTUDIES } from "./case-studies.js";
import { WEBINAR } from "./webinar.js";
import { VIDEO } from "./video.js";

class RESOURCESCARD {
  constructor(config) {
    this.info = config.resource.data;
    this.cardsToShow = config.cardsToShow;
    this.currentIndex = 0;
    this.sliceUpto = config.cardsToShow;
    this.incerementBy = config.cardsToShow;
    this.newArrFromInfo = this.info.slice(this.currentIndex, this.sliceUpto);
    this.clonedData = [];
    this.container = config.container;
    this.btn = config.btn;
    this.card = this.container.querySelector(".reso-card").cloneNode(true);
    this.img = this.container.querySelector("[data-img='signup']")
      ? this.container.querySelector("[data-img='signup']").cloneNode()
      : null;
    this.modal = config.modal;
    this.video = config.video;
    this.closeBtn = config.closeBtn;
    this.imgIndex = config.bannerImgIndex;
    this.init();
  }

  init() {
    // this.renderCards(this.newArrFromInfo);
    // this.loadMoreCards(this.btn);
    this.loadMoreFunc();
    this.activateEventListeners();
  }

  activateEventListeners() {
    this.btn.addEventListener("click", () => {
      this.loadMoreFunc();
    });
  }

  // function to filter cards.
  renderCards(cardsArr) {
    this.container.innerHTML = "";
    this.addCard(cardsArr);
  }

  // filter the cards using tags and resources.
  filterCards(tags, checkboxs) {
    // return cards arr -> render cards.
    const CARDARR = [];
    // this.info.forEach((data) => {
    //   data.resources.forEach((res) => {
    //     checkboxs.includes(res.slug) && !CARDARR.includes(data)
    //       ? CARDARR.push(data)
    //       : false;
    //   });
    //   data.tags.forEach((tag) => {
    //     tags.includes(tag.slug) && !CARDARR.includes(data)
    //       ? CARDARR.push(data)
    //       : false;
    //   });
    // });

    this.clonedData = this.info.filter((data) => {
      const foundResource = data.resources.find((res) => {
        return checkboxs.includes(res.slug) && !CARDARR.includes(data)
          ? CARDARR.push(data)
          : false;
      });

      const foundTags = data.tags.forEach((tag) => {
        return tags.includes(tag.slug) && !CARDARR.includes(data)
          ? CARDARR.push(data)
          : false;
      });

      console.log({ foundResource, foundTags });

      if (foundResource || foundTags) {
        console.log("found ele");
        return true;
      }
      return false;
    });

    this.clonedData = [...CARDARR];
    console.log("cloned", this.clonedData);
    this.newArrFromInfo = [];
    this.currentIndex = 0;
    // this.sliceUpto = this.incerementBy;
    // this.renderCards(this.newArrFromInfo);
    // this.loadMoreCards(this.btn);
    this.loadMoreFunc();
  }

  // function to loop through the data, clone card, change data of the cloned card, add them into DOM.
  addCard(data) {
    // looping data.
    data.forEach((info) => {
      // cloning card.
      let clonedCard = this.card.cloneNode(true);
      let cardTag = clonedCard
        .querySelector("[data-tagwrp='tagswrp']")
        .querySelector("[data-tag='cardtag']")
        .cloneNode();
      // changing the data of cloned card.
      clonedCard
        .querySelector("[data-img='cardimg']")
        .removeAttribute("srcset");
      clonedCard.querySelector("[data-img='cardimg']").src = info.image.url;
      clonedCard.querySelector("[data-title='cardtitle']").innerHTML =
        info.name;
      clonedCard.querySelector("[data-desc='carddesc']").innerHTML =
        info.description;
      // code to trigger video modal.
      info.video
        ? clonedCard
            .querySelector("[data-img='cardimg']")
            .setAttribute("data-src", this.filterSrc(info.video))
        : "";
      info.video
        ? clonedCard
            .querySelector("[data-img='cardimg']")
            .addEventListener("click", this.openModalAddvideo.bind(this))
        : "";
      info.video
        ? clonedCard
            .querySelector("[data-src='videoSrc']")
            .setAttribute("data-src", this.filterSrc(info.video))
        : "";
      !(this.modal && this.video)
        ? (clonedCard.querySelector("[data-link='cardlink']").href = info.slug)
        : clonedCard
            .querySelector("[data-link='cardlink']")
            .addEventListener("click", this.openModalAddvideo.bind(this));

      clonedCard.querySelector("[data-tagwrp='tagswrp']").innerHTML = "";
      info.tags.forEach((tag) => {
        let cloneTag = cardTag.cloneNode(true);
        cloneTag.innerHTML = tag.name;
        clonedCard
          .querySelector("[data-tagwrp='tagswrp']")
          .appendChild(cloneTag);
      });
      // adding card into container.
      if (this.container.childElementCount == this.imgIndex && this.img) {
        this.container.appendChild(this.img);
      }
      this.container.childElementCount >= this.imgIndex
        ? this.container.insertBefore(clonedCard, this.img)
        : this.container.appendChild(clonedCard);
    });
    this.scrollToSection(this.container);
    this.hideShowMoreBtn(this.sliceUpto, this.btn);
  }

  loadMoreFunc() {
    // console.log(
    //   "first",
    //   this.currentIndex,
    //   this.sliceUpto,
    //   this.clonedData,
    //   this.newArrFromInfo
    // );

    this.newArrFromInfo = [
      ...this.newArrFromInfo,
      ...(this.clonedData.length > 0
        ? this.clonedData.slice(this.currentIndex, this.sliceUpto)
        : this.info.slice(this.currentIndex, this.sliceUpto)),
    ];

    this.currentIndex = this.sliceUpto;
    this.sliceUpto += this.incerementBy;

    // console.log(
    //   "last",
    //   this.currentIndex,
    //   this.sliceUpto,
    //   this.clonedData,
    //   this.newArrFromInfo
    // );
    this.renderCards(this.newArrFromInfo);
  }

  // function to hide and show buttons.
  hideShowMoreBtn(length, btn) {
    length >= this.info.length ? (btn.style.display = "none") : "";
  }

  // open modal and append video link.
  openModalAddvideo(ev) {
    this.video.src = ev.currentTarget.getAttribute("data-src");
    this.modal.style.display = "flex";
    this.closeBtn.addEventListener("click", () => {
      this.video.src = "";
    });
  }

  // function to scroll to top of the section when user clicks in show more\
  scrollToSection(section) {
    let elDistanceToTop =
      window.pageYOffset + section.getBoundingClientRect().top;
    window.scrollTo({
      top: elDistanceToTop - 200,
      behavior: "smooth",
    });
  }

  // fucntion to filter out src from video string
  filterSrc(str) {
    let re = /<iframe[^>]+src="([^">]+)/g;
    let results = re.exec(str);
    return results[1];
  }
}

const RESOURCES = [
  {
    resource: EBOOK,
    container: document.querySelector("[data-resource='ebook']"),
    btn: document.querySelector("[data-btn='loadMoreEbook']"),
    cardsToShow: 1,
    bannerImgIndex: 3,
  },
  {
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
  },
];

/* code for filter starts from here*/

class FILTERRESOURCES {
  constructor(resource) {
    this.resourcesCheckBox = document.querySelectorAll(
      "input[type='checkbox']"
    );
    this.tagsContainer = document.querySelectorAll("[data-input='tags']");
    this.applyBtn = document.querySelector(".apply-button");
    this.checkboxArr = [];
    this.tagsArr = [];
    this.resourceArr = resource;
    this.resourcesObj = null;
    this.init();
  }

  // send resources to add cards into DOM.
  init() {
    this.resourcesObj = this.resourceArr.map(
      (resourceObj) =>
        new RESOURCESCARD(resourceObj, {
          checkboxArr: this.checkboxArr,
          tagsArr: this.tagsArr,
        })
    );
    this.filterListener();
  }

  // function add listener to the checkbox, tags and apply btn -> data to class to filter the cards.
  filterListener() {
    this.resourcesCheckBox.forEach((resource) => {
      resource.addEventListener("change", (e) => {
        // if checked add value otherwise remove;
        let data = e.currentTarget;
        if (data.checked && !this.checkboxArr.includes(data.dataset.name)) {
          this.checkboxArr.push(data.dataset.name);
        } else {
          let indx = this.checkboxArr.indexOf(data.dataset.name);
          this.checkboxArr.splice(indx, 1);
        }
      });
    });

    this.tagsContainer.forEach((tag) => {
      tag.addEventListener("click", (e) => {
        let data = e.currentTarget;
        if (!data.classList.contains("active")) {
          data.classList.add("active");
          this.tagsArr.push(data.dataset.value);
        } else {
          let indx = this.tagsArr.indexOf(data.dataset.value);
          data.classList.remove("active");
          this.tagsArr.splice(indx, 1);
        }
      });
    });

    this.applyBtn.addEventListener("click", () => {
      this.checkboxArr.length != 0 || this.tagsArr.length != 0
        ? this.resourcesObj.forEach((resObj) => {
            resObj.filterCards(this.tagsArr, this.checkboxArr);
          })
        : "";
    });
  }
}

new FILTERRESOURCES(RESOURCES);
