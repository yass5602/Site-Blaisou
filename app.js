// ===== BEFORE / AFTER SLIDERS =====
function initSliders() {
  document.querySelectorAll(".ba-wrap").forEach((wrap) => {
    const after   = wrap.querySelector(".ba-after");
    const divider = wrap.querySelector(".ba-divider");
    const handle  = wrap.querySelector(".ba-handle");
    let dragging  = false;

    function setPos(pct) {
      pct = Math.max(2, Math.min(98, pct));
      after.style.clipPath  = `inset(0 ${100 - pct}% 0 0)`;
      divider.style.left    = pct + "%";
      handle.style.left     = pct + "%";
    }

    function pctFromEvent(e) {
      const rect = wrap.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      return (x / rect.width) * 100;
    }

    setPos(50);

    wrap.addEventListener("mousedown",  (e) => { dragging = true; setPos(pctFromEvent(e)); });
    wrap.addEventListener("touchstart", (e) => { dragging = true; setPos(pctFromEvent(e)); }, { passive: true });
    window.addEventListener("mousemove",  (e) => { if (dragging) setPos(pctFromEvent(e)); });
    window.addEventListener("touchmove",  (e) => { if (dragging) setPos(pctFromEvent(e)); }, { passive: true });
    window.addEventListener("mouseup",  () => (dragging = false));
    window.addEventListener("touchend", () => (dragging = false));
  });
}

// ===== CARROUSEL TÉMOIGNAGES =====
const track        = document.getElementById("testimonialsTrack");
const prevBtn      = document.getElementById("prevBtn");
const nextBtn      = document.getElementById("nextBtn");
const dotsContainer = document.getElementById("carouselDots");
const cards        = document.querySelectorAll(".testimonial-card");

let currentIndex   = 0;
let cardsPerView   = 3;

function updateCardsPerView() {
  if (window.innerWidth >= 1024) {
    cardsPerView = 3;
  } else if (window.innerWidth >= 768) {
    cardsPerView = 2;
  } else {
    cardsPerView = 1;
  }
}

function createDots() {
  dotsContainer.innerHTML = "";
  const totalSlides = Math.ceil(cards.length / cardsPerView);

  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement("button");
    dot.classList.add("carousel-dot");
    dot.setAttribute("aria-label", `Aller au groupe de témoignages ${i + 1}`);
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
}

function updateCarousel() {
  const cardWidth = cards[0].offsetWidth;
  const gap = 24;

  const offset = currentIndex * (cardWidth + gap) * cardsPerView;
  track.style.transform = `translateX(-${offset}px)`;

  const dots = dotsContainer.querySelectorAll(".carousel-dot");
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentIndex);
  });

  const totalSlides = Math.ceil(cards.length / cardsPerView);
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex >= totalSlides - 1;
}

function goToSlide(index) {
  const totalSlides = Math.ceil(cards.length / cardsPerView);
  currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
  updateCarousel();
}

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) { currentIndex--; updateCarousel(); }
});

nextBtn.addEventListener("click", () => {
  const totalSlides = Math.ceil(cards.length / cardsPerView);
  if (currentIndex < totalSlides - 1) { currentIndex++; updateCarousel(); }
});

// Swipe tactile
let touchStartX = 0;
let touchEndX   = 0;

track.addEventListener("touchstart", (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
track.addEventListener("touchend",   (e) => { touchEndX = e.changedTouches[0].screenX; handleSwipe(); });

function handleSwipe() {
  const threshold = 50;
  const totalSlides = Math.ceil(cards.length / cardsPerView);
  if (touchStartX - touchEndX > threshold && currentIndex < totalSlides - 1) {
    currentIndex++; updateCarousel();
  } else if (touchEndX - touchStartX > threshold && currentIndex > 0) {
    currentIndex--; updateCarousel();
  }
}

function init() {
  updateCardsPerView();
  createDots();
  currentIndex = 0;
  updateCarousel();
  initSliders();
}

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const old = cardsPerView;
    updateCardsPerView();
    if (old !== cardsPerView) {
      const totalSlides = Math.ceil(cards.length / cardsPerView);
      currentIndex = Math.min(currentIndex, totalSlides - 1);
    }
    createDots();
    updateCarousel();
  }, 250);
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// ===== MENU BURGER =====
const navbarToggle  = document.getElementById("navbarToggle");
const navbarLinks   = document.getElementById("navbarLinks");
const navbarOverlay = document.getElementById("navbarOverlay");
const navLinks      = navbarLinks.querySelectorAll("a");

function openMenu() {
  navbarLinks.classList.add("active");
  navbarOverlay.classList.add("active");
  navbarToggle.classList.add("active");
  navbarToggle.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  navbarLinks.classList.remove("active");
  navbarOverlay.classList.remove("active");
  navbarToggle.classList.remove("active");
  navbarToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

navbarToggle.addEventListener("click", () => {
  navbarLinks.classList.contains("active") ? closeMenu() : openMenu();
});

navbarOverlay.addEventListener("click", closeMenu);
navLinks.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navbarLinks.classList.contains("active")) closeMenu();
});
