// ===== CARROUSEL TÉMOIGNAGES =====
const track = document.getElementById("testimonialsTrack");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const dotsContainer = document.getElementById("carouselDots");
const cards = document.querySelectorAll(".testimonial-card");

let currentIndex = 0;
let cardsPerView = 1;

// Déterminer le nombre de cards visibles selon la taille d'écran
function updateCardsPerView() {
  if (window.innerWidth >= 1024) {
    cardsPerView = 3;
  } else if (window.innerWidth >= 768) {
    cardsPerView = 2;
  } else {
    cardsPerView = 1;
  }
}

// Créer les dots
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

// Mettre à jour l'affichage du carrousel
function updateCarousel() {
  const cardWidth = cards[0].offsetWidth;
  const gap = 24;

  // Calculer le décalage basé sur l'index actuel
  let offset = 0;
  for (let i = 0; i < currentIndex; i++) {
    offset += (cardWidth + gap) * cardsPerView;
  }

  track.style.transform = `translateX(-${offset}px)`;

  // Mettre à jour les dots
  const dots = dotsContainer.querySelectorAll(".carousel-dot");
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentIndex);
  });

  // Gérer l'état des boutons
  const totalSlides = Math.ceil(cards.length / cardsPerView);
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex >= totalSlides - 1;
}

// Aller à une slide spécifique
function goToSlide(index) {
  const totalSlides = Math.ceil(cards.length / cardsPerView);
  currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
  updateCarousel();
}

// Navigation
prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateCarousel();
  }
});

nextBtn.addEventListener("click", () => {
  const totalSlides = Math.ceil(cards.length / cardsPerView);
  if (currentIndex < totalSlides - 1) {
    currentIndex++;
    updateCarousel();
  }
});

// Support du swipe tactile
let touchStartX = 0;
let touchEndX = 0;

track.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.changedTouches[0].screenX;
  },
  { passive: true }
);

track.addEventListener(
  "touchend",
  (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  },
  { passive: true }
);

function handleSwipe() {
  const swipeThreshold = 50;
  if (touchStartX - touchEndX > swipeThreshold) {
    // Swipe vers la gauche
    const totalSlides = Math.ceil(cards.length / cardsPerView);
    if (currentIndex < totalSlides - 1) {
      currentIndex++;
      updateCarousel();
    }
  } else if (touchEndX - touchStartX > swipeThreshold) {
    // Swipe vers la droite
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  }
}

// Initialisation et responsive
function init() {
  updateCardsPerView();
  createDots();
  currentIndex = 0;
  updateCarousel();
}

// Réinitialiser au redimensionnement
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const oldCardsPerView = cardsPerView;
    updateCardsPerView();

    // Réajuster l'index si nécessaire
    if (oldCardsPerView !== cardsPerView) {
      const totalSlides = Math.ceil(cards.length / cardsPerView);
      currentIndex = Math.min(currentIndex, totalSlides - 1);
    }

    createDots();
    updateCarousel();
  }, 250);
});

// Initialisation au chargement
window.addEventListener("DOMContentLoaded", init);

// Fallback si DOMContentLoaded déjà passé
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
// ===== MENU BURGER =====
const navbarToggle = document.getElementById("navbarToggle");
const navbarLinks = document.getElementById("navbarLinks");
const navbarOverlay = document.getElementById("navbarOverlay");
const navLinks = navbarLinks.querySelectorAll("a");

// Fonction pour ouvrir/fermer le menu
function toggleMenu() {
  const isActive = navbarLinks.classList.contains("active");

  if (isActive) {
    closeMenu();
  } else {
    openMenu();
  }
}

function openMenu() {
  navbarLinks.classList.add("active");
  navbarOverlay.classList.add("active");
  navbarToggle.classList.add("active");
  navbarToggle.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden"; // Empêche le scroll
}

function closeMenu() {
  navbarLinks.classList.remove("active");
  navbarOverlay.classList.remove("active");
  navbarToggle.classList.remove("active");
  navbarToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = ""; // Réactive le scroll
}

// Event listeners
navbarToggle.addEventListener("click", toggleMenu);
navbarOverlay.addEventListener("click", closeMenu);

// Fermer le menu lors du clic sur un lien
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();
  });
});

// Fermer le menu avec la touche Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navbarLinks.classList.contains("active")) {
    closeMenu();
  }
});
