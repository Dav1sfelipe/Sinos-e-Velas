const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Close mobile menu when clicking a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe sections for animations
const sections = document.querySelectorAll('.about, .collection, .sensory, .testimonials, .newsletter');
sections.forEach(section => {
    observer.observe(section);
});

// Product cards hover effect enhancement
const productCards = document.querySelectorAll('.product-card');
productCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Newsletter form handling
const newsletterForm = document.getElementById('newsletterForm');
newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(newsletterForm);
    const name = formData.get('name');
    const email = formData.get('email');
    
    // Show success message (visual feedback only)
    const button = newsletterForm.querySelector('button[type=\"submit\"]');
    const originalText = button.textContent;
    button.textContent = '✓ Cadastrado com sucesso!';
    button.style.background = '#6B8E23';
    
    // Reset form and button after 3 seconds
    setTimeout(() => {
        newsletterForm.reset();
        button.textContent = originalText;
        button.style.background = '';
    }, 3000);
    
    console.log('Newsletter signup:', { name, email });
});

// Add parallax effect to hero section
const hero = document.querySelector('.hero');
const heroImage = document.querySelector('.hero-image img');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;
    
    if (heroImage && scrolled < hero.offsetHeight) {
        heroImage.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
});

// CTA Button scroll to collection
const ctaButtons = document.querySelectorAll('.cta-button');
ctaButtons.forEach(button => {
    if (button.textContent.includes('Explorar')) {
        button.addEventListener('click', () => {
            const collection = document.querySelector('#collection');
            const offsetTop = collection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        });
    }
});

// Add hover sound effect simulation (visual feedback)
const interactiveElements = document.querySelectorAll('button, .product-card, .nav-menu a');
interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

// Video playback optimization
const video = document.querySelector('.background-video');
if (video) {
    // Pause video when not in viewport to save resources
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                video.play();
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.25 });
    
    videoObserver.observe(video);
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Testimonials card 3D tilt effect
const testimonialCards = document.querySelectorAll('.testimonial-card');
testimonialCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Newsletter form validation
const emailInput = newsletterForm.querySelector('input[type=\"email\"]');
emailInput.addEventListener('blur', function() {
    const emailValue = this.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailValue && !emailRegex.test(emailValue)) {
        this.style.borderColor = '#D8727F';
    } else {
        this.style.borderColor = '';
    }
});

console.log('Lumina & Co. - Landing Page carregada com sucesso! ✨');