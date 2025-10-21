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

// Menu functionality
menuBtn.addEventListener('click', () => {
    menu.classList.add('active');
});

closeBtn.addEventListener('click', () => {
    menu.classList.remove('active');
});

// Close menu when clicking outside
menu.addEventListener('click', (e) => {
    if (e.target === menu) {
        menu.classList.remove('active');
    }
});

// Initialize
updateDate();
displayAffirmation();