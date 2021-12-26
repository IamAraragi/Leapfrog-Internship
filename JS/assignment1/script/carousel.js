const carouselContainer = document.querySelector('.carousel-container');
const carouselImageWrapper = document.querySelector('.carousel-image-wrapper');

const images = document.querySelectorAll('.carousel-image-wrapper img');
const numberOfImages = images.length;
const imageWidth = images[0].clientWidth;
const imageHeight = images[0].clientHeight;

carouselContainer.style.width = imageWidth + 'px';
carouselContainer.style.position = 'relative';
carouselContainer.style.overflow = 'hidden';

carouselImageWrapper.style.width = numberOfImages * imageWidth + 'px';
carouselImageWrapper.style.height = imageHeight + 'px';
carouselImageWrapper.style.position = 'relative';

for (let i = 0; i < numberOfImages; i++) {
  images[i].style.position = 'absolute';
  images[i].style.left = i * imageWidth + 'px';
}

let currentIndex = 0;
let previousIndex = -1;
let pixelChange = 0;

/**
 * Goes to the next image in the carousel
 */
function nextImage() {
  previousIndex = currentIndex;
  currentIndex++;
  if (currentIndex >= numberOfImages) {
    currentIndex = 0;
  }
  let animation = setInterval(() => {
    pixelChange += 5;
    if (pixelChange > imageWidth) {
      clearInterval(animation);
      pixelChange = 0;
    } else {
      if (previousIndex === numberOfImages - 1) {
        carouselImageWrapper.style.left = `${
          -previousIndex * imageWidth + (numberOfImages - 1) * pixelChange
        }px`;
      } else {
        carouselImageWrapper.style.left = `${
          -previousIndex * imageWidth - pixelChange
        }px`;
      }
    }
  }, 5);
}

/**
 *Goes to the previous image in carousel
 */
function previousImage() {
  previousIndex = currentIndex;
  currentIndex--;
  if (currentIndex < 0) {
    currentIndex = numberOfImages - 1;
  }
  let animation = setInterval(() => {
    pixelChange += 5;
    if (pixelChange > imageWidth) {
      clearInterval(animation);
      pixelChange = 0;
    } else {
      if (previousIndex === 0) {
        carouselImageWrapper.style.left = `${
          -previousIndex * imageWidth - (numberOfImages - 1) * pixelChange
        }px`;
      } else {
        carouselImageWrapper.style.left = `${
          -previousIndex * imageWidth + pixelChange
        }px`;
      }
    }
  }, 5);
}

/**
 * Adds previous button to the carousel
 */
const prevButton = document.createElement('button');
prevButton.innerHTML = '&larr;';
prevButton.style.width = '40px';
prevButton.style.height = '50px';
prevButton.style.background = 'gray';
prevButton.style.border = 'none';
prevButton.style.opacity = '0.8';
prevButton.style.position = 'absolute';
prevButton.style.top = '50%';
prevButton.style.transform = 'translate(0, -50%)';
carouselContainer.appendChild(prevButton);

/**
 * Adds next button to the carousel
 */
const nextButton = document.createElement('button');
nextButton.innerHTML = '&rarr;';
nextButton.style.width = '40px';
nextButton.style.height = '50px';
nextButton.style.background = 'gray';
nextButton.style.border = 'none';
nextButton.style.opacity = '0.8';
nextButton.style.position = 'absolute';
nextButton.style.right = '0';
nextButton.style.top = '50%';
nextButton.style.transform = 'translate(0, -50%)';
carouselContainer.appendChild(nextButton);

nextButton.onclick = nextImage;
prevButton.onclick = previousImage;

// Indicator
const indicatorList = [];
const indicatorWrapper = document.createElement('div');
indicatorWrapper.style.position = 'absolute';
indicatorWrapper.style.left = '50%';
indicatorWrapper.style.bottom = '8%';
indicatorWrapper.style.transform = 'translate(-50%, 0)';
carouselContainer.appendChild(indicatorWrapper);

for (let i = 0; i < numberOfImages; i++) {
  const indicator = document.createElement('div');
  indicatorList.push(indicator);
  indicator.style.width = '15px';
  indicator.style.height = '15px';
  indicator.style.background = '#eee1f7';
  indicator.style.borderRadius = '50%';
  indicator.style.marginLeft = '5px';
  indicator.style.display = 'inline-block';
  indicatorWrapper.appendChild(indicator);

  /**
   * Transistion to the selcted image when clicked in the indicator
   */
  indicator.onclick = function () {
    if (currentIndex !== i) {
      previousIndex = currentIndex;
      currentIndex = i;
      let animation = setInterval(() => {
        pixelChange += 5;
        if (pixelChange > imageWidth) {
          clearInterval(animation);
          pixelChange = 0;
        } else {
          carouselImageWrapper.style.left = `${
            -previousIndex * imageWidth -
            (currentIndex - previousIndex) * pixelChange
          }px`;
        }
      }, 5);
    }
  };
}

/**
 * Sets indicator background every 10 millisecond
 */
setInterval(() => {
  indicatorList[currentIndex].style.background = '#5b9bf3';
  if (previousIndex !== -1) {
    indicatorList[previousIndex].style.background = '#eee1f7';
  }
}, 10);
