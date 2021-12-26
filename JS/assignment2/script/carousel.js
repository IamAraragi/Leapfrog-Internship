class ImageSlider {
  /**
   *
   * @param {*} carouselContainer : carousel container with all the images
   * @param {*} transistionTime : transition time for silding animation
   * @param {*} holdTime : hold time during auto slide
   */
  constructor(carouselContainer, transistionTime, holdTime) {
    this.carouselContainer = carouselContainer;
    this.carouselImageWrapper = carouselContainer.children[0];

    this.images = this.carouselImageWrapper.children;
    this.numberOfImages = this.images.length;
    this.imageWidth = this.images[0].clientWidth;
    this.imageHeight = this.images[0].clientHeight;

    this.carouselImageWrapper.style.width =
      this.numberOfImages * this.imageWidth + 'px';
    this.carouselImageWrapper.style.height = this.imageHeight + 'px';

    this.carouselContainer.style.width = this.imageWidth + 'px';

    this.carouselContainer.style.position = 'relative';
    this.carouselImageWrapper.style.position = 'relative';
    this.carouselContainer.style.overflow = 'hidden';

    this.currentIndex = 0;
    this.previousIndex = -1;
    this.finalIndex = this.numberOfImages - 1;
    this.pixelChange = 0;
    this.PIXEL_CHANGE_PER_INTERVAL = 5;

    this.indicatorList = [];
    this.transistionTime = transistionTime;
    this.holdTime = holdTime;
    this.transistionInterval =
      this.transistionTime / (this.imageWidth / this.PIXEL_CHANGE_PER_INTERVAL);

    this.render();
  }

  positionImages() {
    for (let i = 0; i < this.numberOfImages; i++) {
      this.images[i].style.position = 'absolute';
      this.images[i].style.width = this.imageWidth + 'px';
      this.images[i].style.height = this.imageHeight + 'px';
      this.images[i].style.left = i * this.imageWidth + 'px';
    }
  }

  /**
   * method to go to previous image in carousel
   */
  prevImage() {
    this.previousIndex = this.currentIndex;
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.finalIndex;
    }
    let animation = setInterval(() => {
      this.pixelChange += this.PIXEL_CHANGE_PER_INTERVAL;
      if (this.pixelChange > this.imageWidth) {
        clearInterval(animation);
        this.pixelChange = 0;
      } else {
        if (this.previousIndex === 0) {
          this.carouselImageWrapper.style.left = `${
            -this.previousIndex * this.imageWidth -
            this.finalIndex * this.pixelChange
          }px`;
        } else {
          this.carouselImageWrapper.style.left = `${
            -this.previousIndex * this.imageWidth + this.pixelChange
          }px`;
        }
      }
    }, this.transistionInterval);
  }

  /**
   * method to go to next image in carousel
   */
  nextImage() {
    this.previousIndex = this.currentIndex;
    this.currentIndex++;
    if (this.currentIndex >= this.numberOfImages) {
      this.currentIndex = 0;
    }
    let animation = setInterval(() => {
      this.pixelChange += this.PIXEL_CHANGE_PER_INTERVAL;
      if (this.pixelChange > this.imageWidth) {
        clearInterval(animation);
        this.pixelChange = 0;
      } else {
        if (this.previousIndex === this.finalIndex) {
          this.carouselImageWrapper.style.left = `${
            -this.previousIndex * this.imageWidth +
            this.finalIndex * this.pixelChange
          }px`;
        } else {
          this.carouselImageWrapper.style.left = `${
            -this.previousIndex * this.imageWidth - this.pixelChange
          }px`;
        }
      }
    }, this.transistionInterval);
  }

  /**
   * method to add previous button to image carousel
   */
  createPrevButton() {
    let prevButton = document.createElement('button');
    prevButton.innerHTML = '&larr;';
    prevButton.style.width = '30px';
    prevButton.style.height = '30px';
    prevButton.style.background = '#ffffff';
    prevButton.style.border = 'none';
    prevButton.style.opacity = '0.5';
    prevButton.style.position = 'absolute';
    prevButton.style.top = '50%';
    prevButton.style.transform = 'translate(0, -50%)';
    this.carouselContainer.appendChild(prevButton);

    prevButton.onclick = this.prevImage.bind(this);
  }

  /**
   * method to add next button to image carousel
   */
  createNextButton() {
    let nextButton = document.createElement('button');
    nextButton.innerHTML = '&rarr;';
    nextButton.style.width = '30px';
    nextButton.style.height = '30px';
    nextButton.style.background = '#ffffff';
    nextButton.style.border = 'none';
    nextButton.style.opacity = '0.5';
    nextButton.style.position = 'absolute';
    nextButton.style.right = '0';
    nextButton.style.top = '50%';
    nextButton.style.transform = 'translate(0, -50%)';
    this.carouselContainer.appendChild(nextButton);

    nextButton.onclick = this.nextImage.bind(this);
  }

  /**
   * methos to add indicator to image carousel
   */
  createIndicator() {
    let indicatorWrapper = document.createElement('div');
    indicatorWrapper.style.position = 'absolute';
    indicatorWrapper.style.left = '50%';
    indicatorWrapper.style.bottom = '10%';
    indicatorWrapper.style.transform = 'translate(-50%, 0)';
    this.carouselContainer.appendChild(indicatorWrapper);

    for (let i = 0; i < this.numberOfImages; i++) {
      let indicator = document.createElement('div');
      this.indicatorList.push(indicator);
      indicator.style.width = '15px';
      indicator.style.height = '15px';
      indicator.style.background = '#eee1f7';
      indicator.style.borderRadius = '50%';
      indicator.style.marginLeft = '5px';
      indicator.style.display = 'inline-block';
      indicatorWrapper.appendChild(indicator);

      /** Goes to the selected image when clicked on indicator */
      indicator.onclick = () => {
        if (this.currentIndex !== i) {
          this.previousIndex = this.currentIndex;
          this.currentIndex = i;
          let animation = setInterval(() => {
            this.pixelChange += this.PIXEL_CHANGE_PER_INTERVAL;
            if (this.pixelChange > this.imageWidth) {
              clearInterval(animation);
              this.pixelChange = 0;
            } else {
              this.carouselImageWrapper.style.left = `${
                -this.previousIndex * this.imageWidth -
                (this.currentIndex - this.previousIndex) * this.pixelChange
              }px`;
            }
          }, this.transistionInterval);
        }
      };
    }
  }

  /**
   * method to change indicator background
   */
  setIndicatorBackground() {
    setInterval(() => {
      this.indicatorList[this.currentIndex].style.background = '#5b9bf3';
      if (this.previousIndex !== -1) {
        this.indicatorList[this.previousIndex].style.background = '#eee1f7';
      }
    }, 10);
  }

  /**
   * method to auto slide the images
   */
  autoSlide() {
    this.autoTransistion = setInterval(
      this.nextImage.bind(this),
      this.holdTime + this.transistionTime
    );
  }

  /**
   * method to stop auto slide
   */
  stopAutoSlide() {
    clearInterval(this.autoTransistion);
  }

  /**
   * method to resume autoslide
   */
  resumeAutoSlide() {
    this.autoSlide();
  }

  render() {
    this.positionImages();
    this.createPrevButton();
    this.createNextButton();
    this.createIndicator();
    this.setIndicatorBackground();
    this.autoSlide();
    this.carouselContainer.onmouseover = this.stopAutoSlide.bind(this);
    this.carouselContainer.onmouseout = this.resumeAutoSlide.bind(this);
  }
}

let imageSlider1 = new ImageSlider(
  document.querySelectorAll('.carousel-container')[0],
  500,
  1000
);

let imageSlider2 = new ImageSlider(
  document.querySelectorAll('.carousel-container')[1],
  1000,
  2000
);
