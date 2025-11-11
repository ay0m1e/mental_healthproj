// Elements
const affirmationElement = document.getElementById("affirmation");
const refreshBtn = document.getElementById("refreshBtn");
const dateElement = document.getElementById("date");

// Display current date
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

// Fetch affirmation from backend
async function fetchAffirmation(mood = "neutral") {
  try {
    console.log("Sending mood:", mood);

    const res = await fetch("http://127.0.0.1:8000/api/mood", {
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

// Display affirmation with small fade animation
async function displayAffirmation() {
  affirmationElement.style.animation = 'none';
  setTimeout(async () => {
    const storedMood = sessionStorage.getItem('selectedMood') || "neutral";
    affirmationElement.textContent = "Fetching your affirmation...";
    const affirmation = await fetchAffirmation(storedMood);
    affirmationElement.textContent = affirmation;
    affirmationElement.style.animation = 'slideIn 0.5s ease-out';
  }, 50);
}

// Refresh button listener
refreshBtn.addEventListener('click', displayAffirmation);

// Smooth click handling function
function handleSmoothClick(element, callback) {
  element.addEventListener("click", function (e) {
    e.preventDefault();
    const href = this.getAttribute("href");

    // Add click effect - faster animation
    this.style.transform = "scale(0.96)";
    this.style.transition = "transform 0.08s ease-out";

    // Execute callback if provided
    if (typeof callback === "function") {
      callback(this);
    }

    // Navigate after a very short delay for the animation
    setTimeout(() => {
      window.location.href = href;
    }, 80); // Reduced from 150ms to 80ms for faster transition
  });
}

// Smooth emoji click handling
document.querySelectorAll(".mood").forEach((emoji) => {
  handleSmoothClick(emoji, function (element) {
    const mood = element.getAttribute("data-mood");
    if (mood) {
      sessionStorage.setItem("selectedMood", mood);
    }
  });
});

// Primary link click handling
const primaryLink = document.querySelector(".primary-link");
if (primaryLink) {
  handleSmoothClick(primaryLink);
}

// Menu functionality
function toggleMenu(open) {
  const isOpening =
    open === true || (open !== false && !menu.classList.contains("active"));

  if (isOpening) {
    menu.classList.add("active");
    body.style.overflow = "hidden";
    document.addEventListener("touchmove", preventScroll, { passive: false });
  } else {
    menu.classList.remove("active");
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

// Click events
menuBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleMenu();
});

closeBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleMenu(false);
});

// Touch events for better mobile support
menuBtn.addEventListener(
  "touchstart",
  (e) => {
    e.stopPropagation();
  },
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

// Close menu when clicking outside or swiping left on menu
document.addEventListener("click", (e) => {
  const isClickInside = menu.contains(e.target) || menuBtn.contains(e.target);
  if (!isClickInside && menu.classList.contains("active")) {
    toggleMenu(false);
  }
});

// Handle menu swipe to close
let touchStartX = 0;
let touchEndX = 0;

menu.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.changedTouches[0].screenX;
  },
  { passive: true }
);

menu.addEventListener(
  "touchend",
  (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const touchDiff = touchStartX - touchEndX;

    // If swiped left more than 50px, close the menu
    if (touchDiff > 50) {
      toggleMenu(false);
    }
  },
  { passive: true }
);

// Initialise
updateDate();
displayAffirmation();
