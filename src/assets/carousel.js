const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const indicators = document.querySelectorAll('.carousel-indicator');
let currentIndex = 0;
let autoPlayInterval;

function updateSlidePosition(index) {
  const slideWidth = slides[0].getBoundingClientRect().width;
  track.style.transform = 'translateX(' + (-slideWidth * index) + 'px)';
  indicators.forEach((indicator, i) => {
    indicator.classList.toggle('active', i === index);
  });
  currentIndex = index;
}

indicators.forEach(indicator => {
  indicator.addEventListener('click', () => {
    const index = parseInt(indicator.getAttribute('data-slide'));
    updateSlidePosition(index);
    resetAutoPlay();
  });
});

function nextSlide() {
  if (currentIndex < slides.length - 1) {
    updateSlidePosition(currentIndex + 1);
  } else {
    updateSlidePosition(0); 
  }
}

function startAutoPlay() {
  autoPlayInterval = setInterval(nextSlide, 10000);
}

function resetAutoPlay() {
  clearInterval(autoPlayInterval);
  startAutoPlay();
}

let startX = 0;
let isSwiping = false;
let isDragging = false;
track.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
  isSwiping = true;
  clearInterval(autoPlayInterval);
});

track.addEventListener('touchmove', (e) => {
  if (!isSwiping) return;
  const touchX = e.touches[0].clientX;
  const swipeDistance = startX - touchX;

  if (swipeDistance > 50) {
    nextSlide();
    isSwiping = false;
  } else if (swipeDistance < -50) {
    if (currentIndex > 0) {
      updateSlidePosition(currentIndex - 1);
    } else {
      updateSlidePosition(slides.length - 1);
    }
    isSwiping = false;
  }
});
track.addEventListener('touchend', () => {
  isSwiping = false;
  resetAutoPlay();
});
track.addEventListener('mousedown', (e) => {
  startX = e.clientX;
  isDragging = true;
  clearInterval(autoPlayInterval);
});
track.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const mouseX = e.clientX;
  const dragDistance = startX - mouseX;

  if (dragDistance > 50) {
    nextSlide();
    isDragging = false;
  } else if (dragDistance < -50) {
    if (currentIndex > 0) {
      updateSlidePosition(currentIndex - 1);
    } else {
      updateSlidePosition(slides.length - 1);
    }
    isDragging = false;
  }
});
track.addEventListener('mouseup', () => {
  isDragging = false;
  resetAutoPlay();
});
track.addEventListener('mouseleave', () => {
  isDragging = false;
});
startAutoPlay();