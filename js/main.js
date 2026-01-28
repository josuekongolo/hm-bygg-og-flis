/**
 * HM BYGG OG FLIS AS - Main JavaScript
 * Premium Website Interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initHeader();
    initMobileMenu();
    initAnimations();
    initSmoothScroll();
    initContactForm();
    initImagePlaceholders();
});

/**
 * Header scroll behavior
 */
function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 50;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class
        if (currentScroll > scrollThreshold) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }

        lastScroll = currentScroll;
    });
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav__link');
    const body = document.body;

    if (!menuToggle || !nav) return;

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
        body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('active') &&
            !nav.contains(e.target) &&
            !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            body.style.overflow = '';
        }
    });
}

/**
 * Scroll-triggered animations
 */
function initAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in');

    if (!animatedElements.length) return;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/**
 * Contact form handling with Resend API
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const successMessage = document.querySelector('.form-success');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn?.innerHTML;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate form
        if (!validateForm(form)) return;

        // Update button state
        if (submitBtn) {
            submitBtn.innerHTML = '<span>Sender...</span>';
            submitBtn.disabled = true;
        }

        // Collect form data
        const formData = new FormData(form);
        const data = {
            navn: formData.get('navn'),
            epost: formData.get('epost'),
            telefon: formData.get('telefon'),
            adresse: formData.get('adresse'),
            prosjektType: formData.get('prosjekt-type'),
            storrelse: formData.get('storrelse'),
            beskrivelse: formData.get('beskrivelse'),
            befaring: formData.get('befaring') === 'on'
        };

        try {
            // For production, this would call your Resend API endpoint
            // For now, we'll simulate a successful submission
            await simulateFormSubmission(data);

            // Show success message
            form.style.display = 'none';
            if (successMessage) {
                successMessage.classList.add('show');
            }

            // Track conversion (if analytics is available)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submission', {
                    'event_category': 'Contact',
                    'event_label': data.prosjektType
                });
            }

        } catch (error) {
            console.error('Form submission error:', error);
            alert('Det oppstod en feil. Vennligst prøv igjen eller kontakt oss direkte.');

            // Reset button
            if (submitBtn) {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        }
    });
}

/**
 * Form validation
 */
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        const value = field.value.trim();
        const fieldGroup = field.closest('.form-group');

        // Remove previous error state
        field.classList.remove('error');

        if (!value) {
            isValid = false;
            field.classList.add('error');
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                field.classList.add('error');
            }
        }

        // Phone validation (Norwegian format)
        if (field.name === 'telefon' && value) {
            const phoneRegex = /^(\+47)?[\s-]?[0-9]{8}$/;
            const cleanPhone = value.replace(/[\s-]/g, '');
            if (!phoneRegex.test(cleanPhone)) {
                isValid = false;
                field.classList.add('error');
            }
        }
    });

    return isValid;
}

/**
 * Simulate form submission (replace with actual Resend API call in production)
 */
async function simulateFormSubmission(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Form data submitted:', data);
            resolve({ success: true });
        }, 1500);
    });
}

/**
 * Production Resend API integration
 * Uncomment and configure for production use
 */
/*
async function sendFormToResend(data) {
    const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: 'noreply@hmbyggogflis.no',
            to: 'post@hmbyggogflis.no',
            subject: `Ny henvendelse: ${data.prosjektType}`,
            html: `
                <h2>Ny kontaktforespørsel</h2>
                <p><strong>Navn:</strong> ${data.navn}</p>
                <p><strong>E-post:</strong> ${data.epost}</p>
                <p><strong>Telefon:</strong> ${data.telefon}</p>
                <p><strong>Adresse/bydel:</strong> ${data.adresse}</p>
                <p><strong>Type prosjekt:</strong> ${data.prosjektType}</p>
                <p><strong>Størrelse:</strong> ${data.storrelse}</p>
                <p><strong>Beskrivelse:</strong> ${data.beskrivelse}</p>
                <p><strong>Ønsker befaring:</strong> ${data.befaring ? 'Ja' : 'Nei'}</p>
            `
        })
    });

    if (!response.ok) {
        throw new Error('Failed to send email');
    }

    return response.json();
}
*/

/**
 * Image placeholder handling
 * Generates gradient placeholders for images before they load
 */
function initImagePlaceholders() {
    const images = document.querySelectorAll('img[data-src]');

    if (!images.length) return;

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    }, { rootMargin: '50px' });

    images.forEach(img => imageObserver.observe(img));
}

/**
 * Counter animation for stats
 */
function animateCounters() {
    const counters = document.querySelectorAll('.stat__number');

    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    });
}

/**
 * Initialize counter animation when stats section is visible
 */
const statsSection = document.querySelector('.stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
}

/**
 * Add CSS for form field error states
 */
const errorStyles = document.createElement('style');
errorStyles.textContent = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #e74c3c;
        background-color: rgba(231, 76, 60, 0.05);
    }

    .form-group input.error:focus,
    .form-group select.error:focus,
    .form-group textarea.error:focus {
        box-shadow: 0 0 0 4px rgba(231, 76, 60, 0.1);
    }
`;
document.head.appendChild(errorStyles);
