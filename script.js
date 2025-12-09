// -------------------------------
// BASIC PAGE ELEMENTS
// -------------------------------
const affirmationElement = document.getElementById("affirmation");
const refreshBtn = document.getElementById("refreshBtn");
const dateElement = document.getElementById("date");

// Menu elements
const menu = document.getElementById("menu");
const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const body = document.body;

// Make menu non-interactive on load
menu.setAttribute("inert", "");


// -------------------------------
// DATE DISPLAY
// -------------------------------
function updateDate() {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const today = new Date();
  dateElement.textContent = today.toLocaleDateString("en-GB", options);
}


// -------------------------------
// FETCH AFFIRMATION
// -------------------------------
async function fetchAffirmation(mood = "neutral") {
  try {
    console.log("Sending mood:", mood);

    const res = await fetch("https://mental-healthproj.onrender.com/api/mood", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood }),
    });

    if (!res.ok) throw new Error("API request failed");

    const data = await res.json();
    return data.affirmation || "You’re doing brilliantly today.";

  } catch (err) {
    console.error(err);
    return "Stay mindful today – you’ve got this.";
  }
}


// -------------------------------
// DISPLAY AFFIRMATION (WITH ANIMATION)
// -------------------------------
async function displayAffirmation() {
  affirmationElement.style.animation = "none";

  setTimeout(async () => {
    const storedMood = sessionStorage.getItem("selectedMood") || "neutral";
    affirmationElement.textContent = "Fetching your affirmation...";
    const affirmation = await fetchAffirmation(storedMood);
    affirmationElement.textContent = affirmation;
    affirmationElement.style.animation = "slideIn 0.5s ease-out";
  }, 50);
}

refreshBtn.addEventListener("click", displayAffirmation);


// -------------------------------
// SMOOTH CLICK HANDLER (LINKS)
// -------------------------------
function handleSmoothClick(element, callback) {
  element.addEventListener("click", function (e) {
    e.preventDefault();
    const href = this.getAttribute("href");

    this.style.transform = "scale(0.96)";
    this.style.transition = "transform 0.08s ease-out";

    if (typeof callback === "function") {
      callback(this);
    }

    setTimeout(() => {
      window.location.href = href;
    }, 80);
  });
}


// -------------------------------
// EMOJI SELECT + MOOD SET
// -------------------------------
document.querySelectorAll(".mood").forEach((emoji) => {
  handleSmoothClick(emoji, function (element) {
    const mood = element.getAttribute("data-mood");

    if (mood) {
      sessionStorage.setItem("selectedMood", mood);

      const affirmationCard = document.querySelector(".affirmation-card");
      if (affirmationCard) {
        affirmationCard.removeAttribute("data-mood");
        affirmationCard.setAttribute("data-mood", mood);
      }

      displayAffirmation();
    }
  });
});

const primaryLink = document.querySelector(".primary-link");
if (primaryLink) handleSmoothClick(primaryLink);


// -------------------------------
// MENU FUNCTIONALITY (INERT FIX)
// -------------------------------
function toggleMenu(open) {
  const isOpening =
    open === true || (open !== false && !menu.classList.contains("active"));

  if (isOpening) {
    // OPEN MENU
    menu.classList.add("active");
    menu.removeAttribute("inert");
    body.style.overflow = "hidden";

    document.addEventListener("touchmove", preventScroll, { passive: false });
  } else {    
    // CLOSE MENU
    menu.classList.remove("active");
    menu.setAttribute("inert", "");
    body.style.overflow = "";

    document.removeEventListener("touchmove", preventScroll);
  }
}

function preventScroll(e) {
  if (menu.classList.contains("active")) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
}

menuBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleMenu();
});

closeBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleMenu(false);
});

// Close menu with ESC key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menu.classList.contains("active")) {
    toggleMenu(false);
  }
});



// -------------------------------
// TOUCH SUPPORT
// -------------------------------
menuBtn.addEventListener(
  "touchstart",
  (e) => e.stopPropagation(),
  { passive: true }
);

closeBtn.addEventListener(
  "touchend",
  (e) => {
    e.stopPropagation();
    toggleMenu(false);
  },
  { passive: true }
);


// -------------------------------
// CLOSE MENU ON OUTSIDE CLICK
// -------------------------------
document.addEventListener("click", (e) => {
  const isClickInside = menu.contains(e.target) || menuBtn.contains(e.target);
  if (!isClickInside && menu.classList.contains("active")) {
    toggleMenu(false);
  }
});


// -------------------------------
// SWIPE LEFT TO CLOSE MENU
// -------------------------------
let touchStartX = 0;
let touchEndX = 0;

menu.addEventListener(
  "touchstart",
  (e) => (touchStartX = e.changedTouches[0].screenX),
  { passive: true }
);

menu.addEventListener(
  "touchend",
  (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      toggleMenu(false);
    }
  },
  { passive: true }
);


// -------------------------------
// HEADER HIDE ON SCROLL
// -------------------------------
(() => {
  const header = document.querySelector(".site-header");
  if (!header) return;

  let lastY = window.scrollY;
  let ticking = false;

  const handleScroll = () => {
    const currentY = window.scrollY;

    if (currentY > lastY + 4 && currentY > 10) {
      header.classList.add("is-hidden");
    } else if (currentY < lastY - 4) {
      header.classList.remove("is-hidden");
    }

    lastY = currentY;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
    },
    { passive: true }
  );
})();

// ===============================
// Anonymous Note Modal Logic
// ===============================

const noteModal = document.getElementById("noteModal");
const openNoteBtn = document.getElementById("openNoteBtn");
const closeNoteBtn = document.getElementById("closeNoteBtn");
const submitNoteBtn = document.getElementById("submitNoteBtn");
const noteInput = document.getElementById("noteInput");

function openNoteModal() {
    noteModal.classList.add("active");
    noteModal.setAttribute("aria-hidden", "false");
    noteInput.focus();
}                                                                                                                                                          

function closeNoteModal() {
    noteModal.classList.remove("active");
    noteModal.setAttribute("aria-hidden", "true");
    noteInput.value = "";
    openNoteBtn.focus();
}

openNoteBtn.addEventListener("click", openNoteModal);
closeNoteBtn.addEventListener("click", closeNoteModal);

// Clicking backdrop closes modal
noteModal.addEventListener("click", (e) => {
    if (e.target === noteModal) closeNoteModal();
});

// ESC key closes modal
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && noteModal.classList.contains("active")) {
        closeNoteModal();
    }
});

// Temporary submit handler (no backend yet)
submitNoteBtn.addEventListener("click", () => {
    const text = noteInput.value.trim();
    if (!text) return;

    // When backend exists, plug fetch() here.
    console.log("Anonymous note submitted (frontend only):", text);

    closeNoteModal();

    alert("Your anonymous note has been saved locally for now 💛\n(Backend will be added soon)");
});


updateDate();
displayAffirmation();
