'use strict';

// Select elements from the HTML document
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window

// Function to open the modal
const openModal = function (e) {
  e.preventDefault(); // Prevent the default behavior of anchor tags
  modal.classList.remove('hidden'); // Show the modal
  overlay.classList.remove('hidden'); // Show the overlay
};

// Function to close the modal
const closeModal = function () {
  modal.classList.add('hidden'); // Hide the modal
  overlay.classList.add('hidden'); // Hide the overlay
};

// Event listeners for opening and closing the modal
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

// Event listener to close the modal when the Escape key is pressed
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Button scrolling

// Event listener for scrolling to section1 when the button is clicked
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  // Log information about the section and the viewport
  console.log(s1coords);
  console.log(e.target.getBoundingClientRect());
  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);
  console.log(
    'Height/Width of viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // Scroll to section1 smoothly
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Page Navigation

// Event listener to scroll to sections when a navigation link is clicked
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Check if the clicked element is a navigation link
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//////////////////////////

// Tabbed Components

// Event listener for tabbed components
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause to exit early if the click is not on a tab
  if (!clicked) return;

  // Remove active classes from all tabs and content
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate the clicked tab and corresponding content
  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation

// Function for handling hover effect on navigation links
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Event listeners for hover effect
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////
// Sticky navigation: Intersection Observer API

// Select the header and get the height of the navigation bar
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

// Function to make the navigation bar sticky using Intersection Observer
const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

// Create an Intersection Observer for the header
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

// Observe the header element
headerObserver.observe(header);

///////////////////////////////////////
// Reveal sections

// Select all sections with the class 'section'
const allSections = document.querySelectorAll('.section');

// Function to reveal sections as they come into view
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

// Create an Intersection Observer for sections
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

// Observe all sections and initially hide them
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading images

// Select all images with a 'data-src' attribute
const imgTargets = document.querySelectorAll('img[data-src]');

// Function to load images when they come into view
const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace the 'src' attribute with 'data-src'
  entry.target.src = entry.target.dataset.src;

  // Remove the 'lazy-img' class after loading
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  // Stop observing the image
  observer.unobserve(entry.target);
};

// Create an Intersection Observer for lazy-loading images
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

// Observe all lazy-loading images
imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////////////////
// Slider

// Function for creating a slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Function to create slider dots
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  // Function to activate a slider dot (continued)
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  // Function to go to a specific slide
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Function for moving to the next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Function for moving to the previous slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Function to initialize the slider
  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  // Event handlers for slide navigation
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // Event handler for keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  // Event handler for dot navigation
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider(); // Initialize the slider
