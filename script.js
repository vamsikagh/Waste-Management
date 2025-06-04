const slides = document.getElementById('slides');
const totalSlides = slides.children.length;
let currentIndex = 0;
let slideInterval = setInterval(nextSlide, 4000); // Auto-slide every 4s

function moveSlide(direction) {
  clearInterval(slideInterval); // Stop auto-sliding on manual control
  currentIndex += direction;
  if (currentIndex < 0) currentIndex = totalSlides - 1;
  if (currentIndex >= totalSlides) currentIndex = 0;
  updateSlide();
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % totalSlides;
  updateSlide();
}

function updateSlide() {
  slides.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// Pause on hover
document.getElementById('slider').addEventListener('mouseenter', () => {
  clearInterval(slideInterval);
});

document.getElementById('slider').addEventListener('mouseleave', () => {
  slideInterval = setInterval(nextSlide, 4000);
});