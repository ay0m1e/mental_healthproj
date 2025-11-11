const affirmations = [
    "You are worthy of peace and happiness.",
    "Your wellbeing matters deeply.",
    "You have the strength to face today's challenges.",
    "It's okay to take things one step at a time.",
    "You deserve rest and care.",
    "Your feelings are valid and important.",
    "You are doing better than you think.",
    "Small progress is still progress.",
    "You are enough, just as you are.",
    "It's okay to ask for help when you need it.",
    "You are capable of growth and change.",
    "Your mental health is a priority.",
    "You deserve compassion, especially from yourself.",
    "Today is a new opportunity for wellbeing.",
    "You are resilient and stronger than you know.",
    "It's okay to set boundaries for your peace.",
    "You are allowed to take up space.",
    "Your journey is unique and valuable.",
    "You deserve moments of joy and calm.",
    "You are not alone in how you feel.",
    "Your needs matter and deserve attention.",
    "You have permission to prioritize yourself.",
    "You are worthy of kindness and understanding.",
    "Every breath is a chance to begin again.",
    "You are creating positive change in your life.",
    "Your presence makes a difference.",
    "You deserve to feel safe and supported.",
    "It's okay to have difficult days.",
    "You are learning and growing every day.",
    "Your mental wellness is worth investing in."
];

const affirmationElement = document.getElementById('affirmation');
const refreshBtn = document.getElementById('refreshBtn');
const dateElement = document.getElementById('date');
const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
const closeBtn = document.getElementById('closeBtn');
const body = document.body;

// Display current date
function updateDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    dateElement.textContent = today.toLocaleDateString('en-US', options);
}

// Get a random affirmation
function getRandomAffirmation() {
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    return affirmations[randomIndex];
}

// Display affirmation with animation
function displayAffirmation() {
    affirmationElement.style.animation = 'none';
    setTimeout(() => {
        affirmationElement.textContent = getRandomAffirmation();
        affirmationElement.style.animation = 'slideIn 0.5s ease-out';
    }, 50);
}

// Event listener for refresh button
refreshBtn.addEventListener('click', displayAffirmation);

// Smooth click handling function
function handleSmoothClick(element, callback) {
    element.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        
        // Add click effect - faster animation
        this.style.transform = 'scale(0.96)';
        this.style.transition = 'transform 0.08s ease-out';
        
        // Execute callback if provided
        if (typeof callback === 'function') {
            callback(this);
        }
        
        // Navigate after a very short delay for the animation
        setTimeout(() => {
            window.location.href = href;
        }, 80); // Reduced from 150ms to 80ms for faster transition
    });
}

// Smooth emoji click handling
document.querySelectorAll('.mood').forEach(emoji => {
    handleSmoothClick(emoji, function(element) {
        const mood = element.getAttribute('data-mood');
        if (mood) {
            sessionStorage.setItem('selectedMood', mood);
        }
    });
});

// Primary link click handling
const primaryLink = document.querySelector('.primary-link');
if (primaryLink) {
    handleSmoothClick(primaryLink);
}

// Menu functionality
function toggleMenu(open) {
    const isOpening = open === true || (open !== false && !menu.classList.contains('active'));
    
    if (isOpening) {
        menu.classList.add('active');
        body.style.overflow = 'hidden';
        document.addEventListener('touchmove', preventScroll, { passive: false });
    } else {
        menu.classList.remove('active');
        body.style.overflow = '';
        document.removeEventListener('touchmove', preventScroll);
    }
}

function preventScroll(e) {
    if (menu.classList.contains('active')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
}

// Click events
menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
});

closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu(false);
});

// Touch events for better mobile support
menuBtn.addEventListener('touchstart', (e) => {
    e.stopPropagation();
}, { passive: true });

closeBtn.addEventListener('touchend', (e) => {
    e.stopPropagation();
    toggleMenu(false);
}, { passive: true });

// Close menu when clicking outside or swiping left on menu
document.addEventListener('click', (e) => {
    const isClickInside = menu.contains(e.target) || menuBtn.contains(e.target);
    if (!isClickInside && menu.classList.contains('active')) {
        toggleMenu(false);
    }
});

// Handle menu swipe to close
let touchStartX = 0;
let touchEndX = 0;

menu.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

menu.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const touchDiff = touchStartX - touchEndX;
    
    // If swiped left more than 50px, close the menu
    if (touchDiff > 50) {
        toggleMenu(false);
    }
}, { passive: true });

// Initialize
updateDate();
displayAffirmation();
