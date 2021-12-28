function resetCounter() {
  let interval = setInterval(() => {
    counter--;

    if (counter <= 0) {
      clearInterval(interval);
    }
  }, 1000);
}

document.addEventListener('keydown', (event) => {
  if (event.code === 'ArrowLeft') {
    carIndex--;
    if (carIndex < 0) carIndex = 0;
  } else if (event.code === 'ArrowRight') {
    carIndex++;
    if (carIndex > 2) carIndex = 2;
  }

  if (event.code == 'Space') {
    console.log(counter);
    if (counter === 0) {
      counter = 3;
      console.log('space pressed');
      throwBullet = true;
      // setTimeout(resetCounter, 5000);
      resetCounter();
    }
  }
});
