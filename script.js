// Configuration objects
const CONFIG = {
    PARTICLES: {
        particles: {
            number: { value: 80 },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: { value: 0.5 },
            size: { value: 3 },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: true
            }
        }
    },
    SLIDESHOW: {
        interval: 10000,
        autoplay: true
    }
};

// Slideshow class to handle all slideshow functionality
class Slideshow {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.isPlaying = CONFIG.SLIDESHOW.autoplay;
        this.slideInterval = null;
        this.progressBar = document.querySelector('.progress');

        this.initializeControls();
        this.createThumbnails();
        this.startSlideshow();
    }

    updateProgress() {
        const progress = ((this.currentSlide + 1) / this.slides.length) * 100;
        this.progressBar.style.width = `${progress}%`;
    }

    showSlide(index) {
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.slides[index].classList.add('active');
        this.updateProgress();
        this.updateThumbnails();
    }

    createThumbnails() {
        const thumbnailNav = document.querySelector('.thumbnail-nav');
        this.slides.forEach((slide, index) => {
            const thumbnail = this.createThumbnail(slide, index);
            thumbnailNav.appendChild(thumbnail);
        });
    }

    createThumbnail(slide, index) {
        const img = slide.querySelector('img');
        const thumbnail = document.createElement('img');
        thumbnail.src = img.src;
        thumbnail.classList.add('thumbnail');
        thumbnail.addEventListener('click', () => {
            this.currentSlide = index;
            this.showSlide(this.currentSlide);
        });
        return thumbnail;
    }

    updateThumbnails() {
        document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.currentSlide);
        });
    }

    initializeControls() {
        document.getElementById('prev').addEventListener('click', () => this.previousSlide());
        document.getElementById('next').addEventListener('click', () => this.nextSlide());
        document.getElementById('autoplay').addEventListener('click', () => this.toggleAutoplay());
    }

    previousSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(this.currentSlide);
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(this.currentSlide);
    }

    startSlideshow() {
        this.showSlide(this.currentSlide);
        if (this.isPlaying) {
            this.slideInterval = setInterval(() => this.nextSlide(), CONFIG.SLIDESHOW.interval);
        }
    }

    toggleAutoplay() {
        this.isPlaying = !this.isPlaying;
        const autoplayButton = document.getElementById('autoplay');
        
        if (this.isPlaying) {
            this.startSlideshow();
            autoplayButton.textContent = "Pause";
        } else {
            clearInterval(this.slideInterval);
            autoplayButton.textContent = "Play";
        }
    }
}

// Audio Manager class to handle all audio-related functionality
class AudioManager {
    constructor() {
        this.audio = document.getElementById('myAudio');
        this.audio.loop = true;
        this.setupAudioConsent();
    }

    setupAudioConsent() {
        if (localStorage.getItem('audioConsent') !== 'true') {
            this.createConsentButton();
        }
    }

    createConsentButton() {
        const consentBtn = document.createElement('button');
        consentBtn.innerText = "Play Birthday Song 🎵";
        consentBtn.id = 'playAudio';
        consentBtn.classList.add('centered-button');
        
        consentBtn.addEventListener('click', () => this.handleConsent(consentBtn));
        document.body.appendChild(consentBtn);
    }

    handleConsent(button) {
        localStorage.setItem('audioConsent', 'true');
        this.playAudio();
        button.remove();
        
        // Show slideshow after audio starts
        const slideshowContainer = document.getElementById('slideshow-container');
        if (slideshowContainer) {
            slideshowContainer.classList.add('visible');
        }
    }

    async playAudio() {
        try {
            this.audio.muted = true;
            await this.audio.play();
            this.audio.muted = false;
        } catch (err) {
            console.warn("Audio playback failed:", err);
        }
    }
}

// Set the target date for New Year 2025 (January 1st, 2025 at 00:00:00)
const newYearDate = new Date("December 23, 2025 00:00:00").getTime();

// Function to update the countdown every second
function updateCountdown() {
    // Get the current date and time
    const now = new Date().getTime();

    // Calculate the time difference between now and New Year 2025
    const timeDifference = newYearDate - now;

    // Time calculations for days, hours, minutes, and seconds
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    // Display the countdown in the "timeRemaining" div
    document.getElementById("timeRemaining").innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    // If the countdown is finished, display a message
    if (timeDifference < 0) {
        clearInterval(countdownInterval);
        document.getElementById("timeRemaining").innerHTML = "Happy New Year 2025!";
    }
}

// Update the countdown every second
const countdownInterval = setInterval(updateCountdown, 1000);

// Initial call to display the countdown immediately upon page load
updateCountdown();

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    // Initialize particles
    particlesJS('particles-js', CONFIG.PARTICLES);

    // Initialize main components
    new AudioManager();
    new Slideshow();
});

// Event listener to reveal the letter when the button is clicked
document.getElementById("revealLetter").addEventListener("click", () => {
    const letter = document.getElementById("thankYouLetter");
    letter.style.display = "block";  // Show the letter
    letter.style.opacity = "1";  // Fade in effect

    document.getElementById("revealLetter").style.display = "none"; // Hide the button
});
