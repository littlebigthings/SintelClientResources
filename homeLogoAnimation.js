// class to control the animation of image wrappers.
class AnimateBlock {
    constructor(block, duration) {
      this.block = block;
      this.aniDuration = duration;
      this.imgChildren = this.block.childNodes;
      this.childImgLength = this.imgChildren.length;
      this.topVal = this.imgChildren[0].height;
      this.movedVal = 0;
      this.currImg = 1;
      this.allMoved = false;
      this.action = "moveup";
      this.ani = gsap.timeline();
    }
    // handle the animation params.
    handleAni() {
      if (this.currImg < this.childImgLength && this.action === "moveup") {
        this.currImg++;
        this.movedVal += this.topVal;
        this.positionAni();
      } else if (
        this.currImg === this.childImgLength ||
        (this.currImg < this.childImgLength && this.currImg > 0)
      ) {
        this.currImg = 1;
        this.action = "moveup";
        this.allMoved = true;
        this.movedVal += this.topVal
        this.positionAni();
      } else {
        this.action = "moveup";
        this.currImg = 1;
        this.movedVal = 0;
        this.handleAni();
      }
    }
    // do the animation
    positionAni() {
      if (!this.allMoved) {
        this.ani.to(this.block, {
          y: -this.movedVal,
          delay: this.delay,
          duration: this.aniDuration,
          ease: "Power1.easeInOut",
        })
      } else {
        this.ani.to(".image-wrapper", {
          y: -this.movedVal,
          opacity: 0,
          duration: 0.8,
          ease: "Power1.easeInOut",
        }).to(".image-wrapper", {
          y: 0,
          duration: 0,
        }).to(".image-wrapper", {
          opacity: 1,
          duration: 0.3,
          ease: "circ.out",
        });
      }
    }
  }
  // class to add images inside wrappers and send wrapper to animate.
  class ANIMATE {
    constructor(companyLogos, duration = 2) {
      this.wrapper = document.querySelectorAll(".image-wrapper");
      this.randomVal = 0;
      this.duration = duration;
      this.indexOfwrapper = 0;
      this.oddNum = [];
      this.evenNum = [];
      this.evenFirst = true;
      this.sendWrapVal = 0;
      this.companyLogos = companyLogos;
      this.init();
    }
    init() {
      this.checkItems();
    }
    loopAndInit() {
      this.aniFuncs = [...this.wrapper].map(
        (ele) => new AnimateBlock(ele, this.duration)
      );
      this.startCounter();
    }
    // check the number of images and columns divide them and check how many images go into particular col.
    checkItems() {
      let imagesPerWrapper = Math.ceil((this.companyLogos.length / this.wrapper.length));
      let imagesNeed = this.wrapper.length * imagesPerWrapper;
      for (let index = 0; this.companyLogos.length < imagesNeed; index++) {
        this.companyLogos.push(this.companyLogos[index]);
      }
      this.insertImage();
      this.loopAndInit = this.loopAndInit.bind(this)
      this.onImagesLoaded(this.loopAndInit);
    }
    // empty the wrapper then send image element inside wrapper.
    insertImage() {
      this.wrapper.forEach((wrp) => {
        wrp.innerHTML = "";
      });
      this.companyLogos.forEach((element) => {
        let imageHtml = document.createElement("img");
        imageHtml.classList.add("cust-img");
        imageHtml.src = element.image;
        imageHtml.alt = element.name;
        this.addImageToWrapper(imageHtml, this.indexOfwrapper);
        this.indexOfwrapper++;
      });
    }
    // add image into the wrapper.
    addImageToWrapper(img, index) {
      if (index < this.wrapper.length) {
        this.wrapper[index].appendChild(img);
      } else {
        this.indexOfwrapper = 0;
        this.wrapper[this.indexOfwrapper].appendChild(img);
      }
    }
    startCounter() {
      this.storeNumbers(this.wrapper.length);
      const intervalId = setInterval(() => {
        this.getNumber();
        if (Array.isArray(this.aniFuncs) && this.aniFuncs[this.randomVal] && (!this.aniFuncs[this.randomVal].allMoved)) {
          this.aniFuncs[this.randomVal].handleAni();
          // below condition execute's when there is no image present inside the wrapper to move up.
          if (this.aniFuncs[this.randomVal].allMoved) {
            // reset all the values and clearInterval.
            this.randomVal = 0;
            this.evenFirst = true;
            this.sendWrapVal = 0;
            this.aniFuncs[this.randomVal].allMoved = false;
            this.evenNum = []
            this.oddNum = []
            clearInterval(intervalId);
            this.checkInt();
          }
        }
      }, 1000);
    }
    checkInt() {
      // function to start the animation again.
      if (this.aniFuncs[this.randomVal]) {
        this.loopAndInit();
      }
    }
    getNumber() {
      // return 3 times even numbers and 3 times odds.
      if (this.evenFirst) {
        if (this.sendWrapVal != this.evenNum.length) {
          this.randomVal = this.evenNum[this.sendWrapVal];
          this.sendWrapVal++;
        }
        else {
          this.sendWrapVal = 0;
          this.evenFirst = false;
          this.getNumber();
        }
      }
      else {
        if (this.sendWrapVal != this.oddNum.length) {
          this.randomVal = this.oddNum[this.sendWrapVal];
          this.sendWrapVal++;
        }
        else {
          this.sendWrapVal = 0;
          this.evenFirst = true;
          this.getNumber();
        }
      }
    }
    // add odd and even in array to send wrappers besed on the array.
    storeNumbers(length) {
      for (let num = 0; num < length; num++) {
        if ((num % 2) != 1) {
          this.evenNum.push(num);
        }
        else {
          this.oddNum.push(num);
        }
      }
    }
    // check the images are loaded on not true-> starts animation..
    onImagesLoaded(event) {
      var images = document.getElementsByClassName("cust-img");
      var loaded = images.length;
      for (var i = 0; i < images.length; i++) {
        if (images[i].complete) {
          loaded--;
        } else {
          images[i].addEventListener("load", function () {
            loaded--;
            if (loaded == 0) {
              event();
            }
          });
        }
        if (loaded == 0) {
          event();
        }
      }
    }
  }
  if (typeof LOGO !== "undefined") {
    new ANIMATE(LOGO, 1);
  }