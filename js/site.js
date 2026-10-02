(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- sticky nav background ---------- */
  var nav = document.getElementById("siteNav");

  function onScroll() {
    nav.classList.toggle("is-solid", window.scrollY > window.innerHeight * 0.6);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- mobile menu ---------- */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");

  function closeMenu() {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", function () {
    var open = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- active link while scrolling ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));
  var sections = [
    { id: "top", el: document.getElementById("top") },
    { id: "story", el: document.querySelector(".chapters") },
    { id: "photos", el: document.querySelector(".gallery-section") }
  ].filter(function (s) { return s.el; });

  function setActive() {
    var line = window.scrollY + window.innerHeight * 0.35;
    var current = sections[0].id;

    sections.forEach(function (s) {
      if (s.el.offsetTop <= line) current = s.id;
    });

    links.forEach(function (a) {
      a.classList.toggle("is-active", a.getAttribute("href") === "#" + current);
    });
  }
  setActive();
  window.addEventListener("scroll", setActive, { passive: true });
  window.addEventListener("resize", setActive);

  /* ---------- scroll reveal ---------- */
  var revealables = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });

    revealables.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- countdown ---------- */
  var countdown = document.getElementById("countdown");

  if (countdown && countdown.dataset.date) {
    var target = new Date(countdown.dataset.date + "T00:00:00");

    if (!isNaN(target)) {
      var days = Math.ceil((target - new Date()) / 86400000);

      if (days > 1) {
        countdown.textContent = days + " days until we say yes";
        countdown.hidden = false;
      } else if (days === 1) {
        countdown.textContent = "One day to go";
        countdown.hidden = false;
      } else if (days === 0) {
        countdown.textContent = "Today is the day";
        countdown.hidden = false;
      }
    }
  }

  /* ---------- gallery ---------- */
  var photos = Array.isArray(window.GALLERY_PHOTOS) ? window.GALLERY_PHOTOS : [];
  var gallery = document.getElementById("gallery");

  photos.forEach(function (photo, index) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "gallery__item";
    button.dataset.index = String(index);
    button.setAttribute("aria-label", "Open photo: " + (photo.alt || "untitled"));

    var img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.alt || "";
    img.loading = index < 3 ? "eager" : "lazy";
    img.decoding = "async";
    button.appendChild(img);

    if (photo.caption) {
      var caption = document.createElement("span");
      caption.className = "gallery__caption";
      caption.textContent = photo.caption;
      button.appendChild(caption);
    }

    gallery.appendChild(button);
  });

  /* ---------- lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  var lbImage = document.getElementById("lbImage");
  var lbCaption = document.getElementById("lbCaption");
  var lbClose = document.getElementById("lbClose");
  var lbPrev = document.getElementById("lbPrev");
  var lbNext = document.getElementById("lbNext");

  var currentIndex = 0;
  var lastFocused = null;

  function render(index) {
    var photo = photos[index];
    if (!photo) return;

    currentIndex = index;
    lbImage.src = photo.src;
    lbImage.alt = photo.alt || "";
    lbCaption.textContent = photo.caption || "";
  }

  function openLightbox(index) {
    lastFocused = document.activeElement;
    render(index);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  function step(delta) {
    if (!photos.length) return;
    render((currentIndex + delta + photos.length) % photos.length);
  }

  gallery.addEventListener("click", function (e) {
    var item = e.target.closest(".gallery__item");
    if (item) openLightbox(Number(item.dataset.index));
  });

  lbClose.addEventListener("click", closeLightbox);
  lbPrev.addEventListener("click", function () { step(-1); });
  lbNext.addEventListener("click", function () { step(1); });

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", function (e) {
    if (lightbox.hidden) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);

    // Keep keyboard focus inside the viewer while it is open.
    if (e.key === "Tab") {
      var focusable = [lbClose, lbPrev, lbNext];
      var position = focusable.indexOf(document.activeElement);
      var next = e.shiftKey ? position - 1 : position + 1;

      if (position === -1 || next < 0 || next >= focusable.length) {
        e.preventDefault();
        focusable[e.shiftKey ? focusable.length - 1 : 0].focus();
      }
    }
  });

  /* ---------- swipe between photos ---------- */
  var touchX = null;

  lightbox.addEventListener("touchstart", function (e) {
    touchX = e.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener("touchend", function (e) {
    if (touchX === null) return;
    var delta = e.changedTouches[0].clientX - touchX;
    if (Math.abs(delta) > 50) step(delta < 0 ? 1 : -1);
    touchX = null;
  }, { passive: true });
})();
