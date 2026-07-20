const canvas = document.getElementById("f1-canvas");
const context = canvas.getContext("2d");

function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.scale(dpr, dpr);
    render();
}

const frameCount = 181; 
const currentFrame = index => `frames/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;
const images = [];

const f1Car = { 
    currentFrame: 0, 
    targetFrame: 0 
};

for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
}

images[0].onload = resizeCanvas;
window.addEventListener("resize", resizeCanvas);

function render() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const frameToDraw = Math.max(0, Math.min(frameCount - 1, Math.round(f1Car.currentFrame)));
    const img = images[frameToDraw];
    
    if (img) {
        const scale = Math.max(window.innerWidth / img.width, window.innerHeight / img.height);
        const x = (window.innerWidth / 2) - (img.width / 2) * scale;
        const y = (window.innerHeight / 2) - (img.height / 2) * scale;
        context.drawImage(img, x, y, img.width * scale, img.height * scale);
    }
}

window.addEventListener("scroll", () => {
    const scrollTop = document.documentElement.scrollTop;
    
    // --- Matched the scroll multiplier to the 400vh CSS change ---
    const scrollDistanceToComplete = window.innerHeight * 4;
    
    const scrollFraction = Math.min(scrollTop / scrollDistanceToComplete, 1);
    f1Car.targetFrame = scrollFraction * frameCount;
});

function updateFrame() {
    const ease = 0.08; 
    f1Car.currentFrame += (f1Car.targetFrame - f1Car.currentFrame) * ease;
    render();
    requestAnimationFrame(updateFrame);
}

updateFrame();

// Scroll Reveal Animations
const observerOptions = {
    root: null,          
    rootMargin: '0px',   
    threshold: 0.15      
};

const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => scrollObserver.observe(el));
const btn = document.getElementById('next-btn');

btn.addEventListener('click', () => {
    // Find the first box on the page that doesn't currently have the 'active' class
    const nextHiddenBox = document.querySelector('.info-box:not(.active)');
    
    if (nextHiddenBox) {
        nextHiddenBox.classList.add('active');
    } else {
        // Optional: If all boxes are open, clicking again hides them all to reset
        document.querySelectorAll('.info-box').forEach(box => box.classList.remove('active'));
    }
});