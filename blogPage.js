// Configuration for the class to work.
const BLOGRESOURCE = [
    {
        slug: "post",
        author: "author",
        collectionId: "61a9be8945247b9091e89a0f",
        btn: document.querySelector("[data-btn='load-more']"),
        postToShow: 6,
        tags: document.querySelectorAll("[data-category]"),
        postContainer: document.querySelector("[data-blog-wrapper='blog-wrapper']"),
        postCard: document.querySelector("[data-card='blog-card']"),
    },
]

// class to filter posts.
class FILTERPOSTS {
    constructor(resource) {
        this.tags = resource[0].tags;
        this.blogArr = resource;
        this.tagsArr = [];
        this.blogObj = null;
        this.init()
    }

    init() {
        // initial load all cards.
        this.blogObj = this.blogArr.map(
            (blogObj) =>
                new BLOGCARD(blogObj, {
                    tagsArr: this.tagsArr,
                })
        );
        this.startListener();
    }

    // event listener for all the tags.
    startListener() {
        this.tags.forEach(tag => {
            tag.addEventListener('click', (event) => {
                // takes the element -> add active class -> add the data into tagsArray -> call filter function..
                let data = event.currentTarget;
                if (!data.classList.contains("active")) {
                    data.classList.add("active");
                    this.tagsArr.push(data.dataset.category);
                } else {
                    let indx = this.tagsArr.indexOf(data.dataset.category);
                    data.classList.remove("active");
                    this.tagsArr.splice(indx, 1);
                }
                this.applyFilter();
            })
        });
    }

    // function to appply filter's
    applyFilter() {
        this.blogObj.forEach((resObj) => {
            resObj.filterCards(this.tagsArr);
        });
    }
}

// class for loading and filtering the cards.
class BLOGCARD {
    constructor(resource) {
        this.apiData = [];
        this.newArrFromInfo = [];
        this.clonedData = [];
        this.collectionId = resource.collectionId;
        this.slug = resource.slug;
        this.author = resource.author;
        this.btn = resource.btn;
        this.blogPostContainer = resource.postContainer;
        this.card = resource.postCard.cloneNode(true);
        this.cardsToShow = resource.postToShow;
        this.cardsToLoad = 20;
        this.cardsToLoadOffSet = 0;
        this.currentIndex = 0;
        this.sliceUpto = resource.postToShow;
        this.incerementBy = resource.postToShow;
        this.init();
    }

    init() {
        // empty the BlogPost container and call the API to load post.
        this.blogPostContainer.innerHTML = "";
        this.loadDataFromApi();
    }

    // method gets data from the CDN and add it to the container.
    loadDataFromApi() {
        let promise = this.callApi();
        promise.then((res) => {
            if (res == 'error') {
                setTimeout(() => this.loadDataFromApi(), 8000);
            }
            else if (res != false) {
                this.loadMoreFunc();
                this.activateEventListeners();
                this.loadMoreData();
                this.search();
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

    // API call function.
    async callApi() {
        this.APIURL = `https://3qpzs5oekf.execute-api.us-east-1.amazonaws.com/dev/user/col-data/${this.collectionId}?limit=${this.cardsToLoad}&offset=${this.cardsToLoadOffSet}`;
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
            resData.data != undefined && resData.data.length != 0 && (this.apiData = [...this.apiData, ...resData.data]);
            this.cardsToLoadOffSet += this.cardsToLoad;
        }
        catch (err) { return "error" }
    }

    // function to loop through the data, clone card, change data of the cloned card, add them into DOM.
    addCard(data) {
        // looping data.
        data.forEach((info) => {
            // cloning card.
            let clonedCard = this.card.cloneNode(true);
            clonedCard
                .querySelector("[data-img='card-img']")
                .removeAttribute("srcset");
            clonedCard.querySelector("[data-img='card-img']").src = info["thumbnail-image"].url;
            clonedCard.querySelector("[data-title='card-title']").innerHTML =
                info.name;
            clonedCard.querySelector("[data-title='card-title']").href = `${this.slug}/${info.slug}`;
            clonedCard.querySelector("[data-summary='blog-summary']").innerHTML =
                info["post-summary"];

            // keep it unitl saif updates the backend.
            // clonedCard.querySelector("[data-author='author-name']").innerHTML = info["author-name-3"];
            // clonedCard.querySelector("[data-author='author-name']").href = `${this.author}/${info.name}`;

            this.blogPostContainer.appendChild(clonedCard);
        });
        this.hideShowMoreBtn(this.currentIndex, this.btn);
    }
    // function to load cards.
    loadMoreFunc() {
        this.newArrFromInfo = [
            ...(this.clonedData.length > 0
                ? this.clonedData.slice(this.currentIndex, this.sliceUpto)
                : this.apiData.slice(this.currentIndex, this.sliceUpto)),
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
            length >= this.apiData.length ? (btn.style.display = "none") : (btn.style.display = "block");
        }
    }
    // event listener for load more button
    activateEventListeners() {
        this.btn.addEventListener("click", () => {
            this.loadMoreFunc();
        });
    }

    // filter the cards using tags and resources.
    filterCards(tags) {
        this.blogPostContainer.innerHTML = "";
        // return cards arr -> render cards.
        const CARDARR = [];
        this.clonedData = this.apiData.filter((data) => {
            const foundTags = data["blog-post-category"].find((tag) => {
                return tags.includes(tag.slug) && !CARDARR.includes(data)
                    ? CARDARR.push(data)
                    : false;
            });
            if (foundTags) {
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
    // function to add search.
    search() {
        var searchList = new List('list-item', {
            valueNames: ['name', 'summary', 'author-name'],
        })
    }
}

new FILTERPOSTS(BLOGRESOURCE);