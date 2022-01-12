class RESOURCESCARD {
  constructor(config) {
    this.info = [];
    this.collectionId = config.collectionId;
    this.pageSlug = (config.slug != undefined) && config.slug;
    this.cardstoLoad = 20;
    this.cardstoLoadOffset = 0;
    this.incerementBy = config.cardsToShow;
    this.cardsToShow = config.cardsToShow;
    this.currentIndex = 0;
    this.sliceUpto = config.cardsToShow;
    this.clonedData = [];
    this.container = config.container;
    this.btn = config.btn;
    this.card = this.container.querySelector(".reso-card").cloneNode(true);
    this.img = this.container.querySelector("[data-img='signup']")
      ? this.container.querySelector("[data-img='signup']").cloneNode(true)
      : null;
    this.modal = config.modal;
    this.video = config.video;
    this.closeBtn = config.closeBtn;
    this.imgIndex = config.bannerImgIndex;
    this.showBanner = true;
    this.bannerVideoLink = document.querySelector("[data-video]").dataset.video;
    this.init();
  }
  init() {
    this.container.innerHTML = "";
    this.loadDataFromApi();
  }
  // a method that takes data from the cdn and add it into the empty array -> loadmore -> listeners.
  loadDataFromApi() {
    // console.log("initial call")
    let promise = this.callApi();
    promise.then((res) => {
      if (res == 'error') {
        setTimeout(() => this.loadDataFromApi(), 8000);
      } else if (res != false){
        this.loadMoreFunc();
        this.activateEventListeners();
        this.loadMoreData();
      }
    }).catch(() => {
      setTimeout(() => this.loadDataFromApi(), 8000);
    })
  }
  // method will run in background to load the data.
  loadMoreData() {
    this.IntervalId = setInterval(() => {
      this.callApi().then((res) => {
        if (res == false) {
          clearInterval(this.IntervalId);
        }
        else if (res == "error") {
          this.handleError()
        }
      }).catch(err => {
        err == 'error' && this.handleError();
      })
    }, 2000)
  }
  // function to handle errors in fetching the data.
  handleError() {
    clearInterval(this.IntervalId);
    setTimeout(() => {
      this.loadMoreData();
    }, 8000)
  }
  async callApi() {
    this.APIURL = `https://3qpzs5oekf.execute-api.us-east-1.amazonaws.com/dev/user/col-data/${this.collectionId}?limit=${this.cardstoLoad}&offset=${this.cardstoLoadOffset}`;
    try {
      // setting up Params to send with API.
      let options = {
        method: "GET",
        headers: {
          'Content-type': 'application/json',
        },
      }
      // calling the API.
      const res = await fetch(this.APIURL, options);
      if (!res.ok) return "error";
      if (res.status >= 400) return "error";
      const resData = await res.json();
      if (resData.data.length == 0) return false;
      // resData.data != undefined && resData.data.length != 0 && (this.info = [...this.info, ...resData.data]);
      resData.data != undefined && resData.data.length != 0 && (this.info = [...this.info, ...this.sortApiData(resData.data)]);
      this.cardstoLoadOffset += this.cardstoLoad;
    }
    catch (err) { return "error" }
  }

  // function to sort the data based on order.
  sortApiData(data){
    data.sort((infoOne, infoTwo) => { 
      if(infoOne.order){
        return infoOne.order - infoTwo.order 
      }
      else if(infoOne['episode-number']){
        return infoOne['episode-number'] - infoTwo['episode-number']
      }
    })
    return data;
  }

  activateEventListeners() {
    this.btn.addEventListener("click", () => {
      this.loadMoreFunc();
    });
  }
  // filter the cards using tags and resources.
  filterCards(tags, checkboxs, showBanner) {
    this.showBanner = showBanner;
    this.container.innerHTML = "";
    // return cards arr -> render cards.
    const CARDARR = [];
    this.clonedData = this.info.filter((data) => {
      const foundResource = data.resources.find((res) => {
        return checkboxs.includes(res.slug) && !CARDARR.includes(data)
          ? CARDARR.push(data)
          : false;
      });
      const foundTags = data.tags.find((tag) => {
        return tags.includes(tag.slug) && !CARDARR.includes(data)
          ? CARDARR.push(data)
          : false;
      });
      if (foundResource || foundTags) {
        return true;
      }
      return false;
    });
    this.clonedData = [...CARDARR];
    this.newArrFromInfo = [];
    this.currentIndex = 0;
    this.sliceUpto = this.cardsToShow;
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
      info.videolink
        ? clonedCard
          .querySelector("[data-img='cardimg']")
          .setAttribute("data-src", this.filterSrc(info.videolink))
        : "";
      info.videolink
        ? clonedCard
          .querySelector("[data-img='cardimg']")
          .addEventListener("click", this.openModalAddvideo.bind(this))
        : "";
      info.videolink
        ? clonedCard
          .querySelector("[data-src='videoSrc']")
          .setAttribute("data-src", this.filterSrc(info.videolink))
        : "";
      !(info.videolink)
        // need to change before integrating into the main page.
        ? (clonedCard.querySelector("[data-link='cardlink']").href = `/${this.pageSlug}/${info.slug}`)
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
      // console.log(clonedCard)
      this.container.appendChild(clonedCard);
      // adding card into container.
      if (this.container.childElementCount == this.imgIndex && this.img && this.showBanner) {
        clonedCard.insertAdjacentElement("afterEnd", this.img);
        // below function will connect video modal into the banner image.
        this.addModalToBanner();
      }
    });
    this.hideShowMoreBtn(this.currentIndex, this.btn);
  }
  // function to load cards.
  loadMoreFunc() {
    this.newArrFromInfo = [
      ...(this.clonedData.length > 0
        ? this.clonedData.slice(this.currentIndex, this.sliceUpto)
        : this.info.slice(this.currentIndex, this.sliceUpto)),
    ];
    this.currentIndex = this.sliceUpto;
    this.sliceUpto += this.incerementBy;
    this.addCard(this.newArrFromInfo);
  }
  // function to hide and show buttons.
  hideShowMoreBtn(length, btn) {
    if (this.clonedData.length != 0) {
      length >= this.clonedData.length ? (btn.style.display = "none") : (btn.style.display = "block");
    }
    else {
      length >= this.info.length ? (btn.style.display = "none") : (btn.style.display = "block");
    }
  }
  // open modal and append video link.
  openModalAddvideo(ev) {
    this.video.src = ev.currentTarget.getAttribute("data-src");
    this.modal.style.display = "flex";
    document.body.classList.add("not-scroll");
    this.closeBtn.addEventListener("click", () => {
      this.video.src = "";
      document.body.classList.remove("not-scroll");
    });
  }
  // function to scroll to top of the section when user clicks in show more\
  scrollToSection(section) {
    let elDistanceToTop =
      window.pageYOffset + section.getBoundingClientRect().top;
    let topDistance = window.screen.width >= 768 ? 155 : 135;
    window.scrollTo({
      top: elDistanceToTop - topDistance,
      behavior: "smooth",
    });
  }
  // fucntion to filter out src from video string
  filterSrc(str) {
    let re = /<iframe[^>]+src="([^">]+)/g;
    let results = re.exec(str);
    return results[1];
  }
  // function to connect video modal into banner.
  addModalToBanner() {
    let imgEle = this.img.querySelector("[data-img='cardimg']")
    imgEle && imgEle.setAttribute("data-src", this.bannerVideoLink);
    let src = imgEle ? imgEle.getAttribute("data-src") : null;
    let linkEle = this.img.querySelector("[data-link='cardlink']");
    linkEle && linkEle.setAttribute("data-src", this.bannerVideoLink)
    let downloadLink = linkEle ? linkEle.getAttribute("data-src") : null;
    if (src && (!src.startsWith("https://www.youtube.com/")) && downloadLink) {
      let videoLink = this.filterSrc(src);
      imgEle.setAttribute("data-src", videoLink)
      linkEle.setAttribute("data-src", videoLink)
      imgEle.addEventListener("click", this.openModalAddvideo.bind(this));
      linkEle.addEventListener("click", this.openModalAddvideo.bind(this));

    }
  }
}
const RESOURCES = [
  {
    slug: "ebook-collection",
    collectionId: "617bb2521a4c4c1986197aee",
    container: document.querySelector("[data-resource='ebook']"),
    btn: document.querySelector("[data-btn='loadMoreEbook']"),
    cardsToShow: 4,
    bannerImgIndex: 4,
  },
  {
    slug: "case-studies",
    collectionId: "617bb357676d902dccb78dec",
    container: document.querySelector("[data-resource='case-studies']"),
    btn: document.querySelector("[data-btn='loadMoreCaseStudies']"),
    cardsToShow: 4,
    bannerImgIndex: 3,
    modal: document.querySelector("[data-modal='video-modal']"),
    video: document.querySelector("[data-video='video']"),
    closeBtn: document.querySelector(".reso-popup-close-btn"),
  },
  {
    slug: "webinars-collection",
    collectionId: "617bb444b5299b89b97e0ae9",
    container: document.querySelector("[data-resource='webinar']"),
    btn: document.querySelector("[data-btn='loadMoreWebinar']"),
    cardsToShow: 4,
  },
  {
    collectionId: "617bb50855f22d39aadac6dd",
    container: document.querySelector("[data-resource='video']"),
    btn: document.querySelector("[data-btn='loadMoreVideo']"),
    cardsToShow: 4,
    modal: document.querySelector("[data-modal='video-modal']"),
    video: document.querySelector("[data-video='video']"),
    closeBtn: document.querySelector("[data-btn='close-btn']"),
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
    this.downArrowBtn = document.querySelector("[data-btn='downArrow']");
    this.filterCloseBtn = document.querySelector("[data-btn='filterClose']");
    this.clearAllTagResource = document.querySelector("[data-btn='allclearResource']");
    this.resetResourceBtn = document.querySelector("[data-btn='clearResource']");
    this.resetTagBtn = document.querySelector("[data-btn='clearTag']");
    this.topCategory = document.querySelectorAll(".resources-category-title");
    this.topCategoryWrapper = document.querySelector('.reso-fil-cat-wrap');
    this.filterClearBtnWrapper = document.querySelector('.filter-and-clearall-wrap');
    this.resourceCardContainer = [];
    this.filterBtn = document.querySelector(".filter-btn");
    this.checkboxArr = [];
    this.tagsArr = [];
    this.resourceArr = resource;
    this.resourcesObj = null;
    this.allResourcesBtn = document.querySelector("[data-name='allResource']");
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
    this.observeScroll(this.allResourcesBtn);
  }
  // function add listener to the checkbox, tags and apply btn -> data to class to filter the cards.
  filterListener() {
    // add listener to the checkbox
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
    // listener for all tags.
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
    //click on apply filter button.
    this.applyBtn.addEventListener("click", () => {
      this.applyFilters(true);
      this.showAndHideClearBtn()
    });
    // listener to reset checkebox.
    this.resetResourceBtn.addEventListener("click", () => {
      // clears only checkboxes.
      this.clearAllFilter(false, true);
    })
    // listener to reset tags.
    this.resetTagBtn.addEventListener('click', () => {
      // clears all tags.
      this.clearAllFilter(true, false);
    })
    // top category observer listener.
    this.resourceArr.forEach(reso => {
      this.observeScroll(reso.container.parentElement);
      this.resourceCardContainer.push(reso.container.parentElement.dataset.container);
    })
    // top category on click listener.
    this.topCategory.forEach(category => {
      category.addEventListener('click', (e) => {
        let name = e.currentTarget.dataset.name;
        let section;
        // close the dropdown when a category is selected.
        (window.screen.width < 768 && this.topCategoryWrapper.classList.contains("active")) && this.downArrowBtn.click();
        this.resourceCardContainer.includes(name) ? section = document.querySelector(`[data-container='${name}']`) : section = document.querySelector("[data-container='ebook']");
        section ? this.resourcesObj[0].scrollToSection(section) : "";
      })
    })
    // when down arrow button is pressed on mobile screem.
    this.downArrowBtn.addEventListener('click', () => {
      !(this.topCategoryWrapper.classList.contains('active')) ? this.topCategoryWrapper.classList.add("active") : this.topCategoryWrapper.classList.remove("active");
      (this.filterClearBtnWrapper.style.display == "" || this.filterClearBtnWrapper.style.display == "flex") ? this.filterClearBtnWrapper.style.display = 'none' : this.filterClearBtnWrapper.style.display = 'flex';
    });
    // listener to close the filter window when user clicks in the x icon.
    this.filterCloseBtn.addEventListener('click', () => {
      this.showAndHideClearBtn()
      this.filterBtn.click();
      //here run the function to check the clearall button to show or not.
    })
    // listener for clear all button that is present outside of filter.
    this.clearAllTagResource.addEventListener('click', () => {
      // clears all the selected filters -> hide the clearall button -> click on apply button to load default cards.
      this.clearAllFilter(true, true);
      this.showAndHideClearBtn();
      this.applyFilters(false);
    })
    // listener to add shadow into the container when user click on the filter btn.
    this.filterBtn.addEventListener('click', () => {
      // to stop page scroll when filter is open in mobile view.
      window.screen.width < 768 && document.body.classList.toggle("not-scroll");
      let container = document.querySelector(".main-resources-wrapper");
      container.classList.contains("active-box-shadow") ? container.classList.remove("active-box-shadow") : container.classList.add("active-box-shadow");
    })
  }
  // function to apply filters
  applyFilters(apply) {
    // click on clear all filters then it won't click on filter button to close filter.
    apply && this.filterBtn.click();
    this.tagsArr.length != 0 || this.checkboxArr.length != 0 ? this.showBanner = false : this.showBanner = true;
    this.resourcesObj.forEach((resObj) => {
      resObj.filterCards(this.tagsArr, this.checkboxArr, this.showBanner);
    });
  }
  //this will add or remove the active class in top categories.
  removeActive(name) {
    this.topCategory.forEach(category => {
      !(category.classList.contains("active")) && category.dataset.name == name.dataset.container || category.dataset.name == name.dataset.name ? category.classList.add("active") : category.classList.remove("active");
    })
  }
  // function for observing scroll.
  observeScroll(wrapper) {
    this.observer = new IntersectionObserver((wrapper) => {
      if (wrapper[0]['isIntersecting'] == true) {
        let elID = wrapper[0].target;
        // ignore the allResources
        if(window.screen.width < 768 && elID.dataset.name != "allResource"){
          this.updateCategory(elID);
          this.removeActive(elID);
        }
        else if (window.screen.width >= 768){
          this.removeActive(elID);
        }
        // this.removeActive(elID);
        // window.screen.width < 768 && this.updateCategory(elID)
      }
    }, { root: null, threshold: 0, rootMargin: '-100px' });
    this.observer.observe(wrapper);
  }
  // function to update the elements on moblie view.
  updateCategory(element) {
    let elementNode = document.querySelector(`[data-name='${element.dataset.container}']`);
    elementNode != null && this.topCategory[0].parentElement.insertBefore(elementNode, elementNode.parentElement.firstElementChild);
  }
  // function to make clearAll button visible or hide.
  showAndHideClearBtn() {
    if (window.screen.width < 768) {
      (this.tagsArr.length > 0 || this.checkboxArr.length > 0) ? this.clearAllTagResource.style.display = "block" : this.clearAllTagResource.style.display = 'none';
    }
  }
  // clear filter function.
  clearAllFilter(tags, checkboxes) {
    if (tags) {
      // clear all tags.
      this.tagsArr = [];
      this.tagsContainer.forEach(tag => tag.classList.remove("active"));
    }
    if (checkboxes) {
      // clear all check box.
      this.checkboxArr = [];
      this.resourcesCheckBox.forEach(res => {
        if (res.checked) {
          res.checked = false;
          res.previousElementSibling.classList.remove("w--redirected-checked");
        }
      });
    }
  }
}
new FILTERRESOURCES(RESOURCES);