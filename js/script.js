// PT. Indogreen Export Global - Main JavaScript File
// Professional Banana Leaf Export Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initGalleryFilter();
    initModal();
    initFloatingElements();
    initSmoothScrolling();

    // Initialize contact form after a short delay to ensure EmailJS is loaded
    setTimeout(initContactForm, 100);
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Update active nav link based on current page
    updateActiveNavLink();

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        }
    });
}

function updateActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Scroll animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.benefit-card, .testimonial-card, .gallery-item, .product-card, .value-card, .team-card, .cert-card');

    // Add animation classes
    animatedElements.forEach((element, index) => {
        element.classList.add('fade-in');
        element.style.transitionDelay = `${index * 0.1}s`;
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const elementsToAnimate = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });

    // Counter animation for achievements
    animateCounters();
}

function animateCounters() {
    const counters = document.querySelectorAll('.achievement-number');

    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }

                        let displayValue = Math.floor(current);
                        const originalText = counter.textContent;

                        if (originalText.includes('+')) {
                            counter.textContent = displayValue + '+';
                        } else if (originalText.includes('%')) {
                            counter.textContent = displayValue + '%';
                        } else {
                            counter.textContent = displayValue;
                        }
                    }, 16);

                    observer.unobserve(entry.target);
                }
            });
        });

        observer.observe(counter);
    });
}

// Contact form handling
function initContactForm() {
    // Initialize EmailJS with error handling
    if (typeof emailjs !== 'undefined') {
        emailjs.init('VvPp2TK7CIDLm5QCt');
    } else {
        console.warn('EmailJS not loaded, contact form will not work');
        return;
    }

    const contactForms = document.querySelectorAll('#contactForm');

    contactForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
    });
}

function handleFormSubmission(form) {
    // Check if EmailJS is available
    if (typeof emailjs === 'undefined') {
        showNotification('Email service is unavailable. Please try again later.', 'error');
        return;
    }

    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;

    // Show loading state
    submitBtn.textContent = 'Mengirim...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    // Get form data
    const formData = new FormData(form);
    const templateParams = {
        from_name: formData.get('name'),
        from_email: formData.get('email'),
        phone: formData.get('phone'),
        company: formData.get('company'),
        product: formData.get('product'),
        message: formData.get('message'),
        to_name: 'PT. Indogreen Export Global'
    };

    // Send email using EmailJS
    emailjs.send('service_ui5x9bs', 'template_9vkv97e', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);

            // Reset form
            form.reset();

            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');

            // Show success message
            showNotification('Message sent successfully! We will contact you soon.', 'success');

        }, function(error) {
            console.log('FAILED...', error);

            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');

            // Show error message
            showNotification('Failed to send message. Please try again.', 'error');
        });
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Gallery filter functionality
function initGalleryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter gallery items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Modal functionality for gallery
function initModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const closeBtn = document.querySelector('.close');

    if (!modal) return;

    // Open modal when clicking view full button
    document.addEventListener('click', function(e) {
        if (e.target.closest('.view-full')) {
            const galleryItem = e.target.closest('.gallery-item');
            const img = galleryItem.querySelector('img');
            const title = galleryItem.querySelector('h4').textContent;
            const description = galleryItem.querySelector('p').textContent;

            modalImg.src = img.src;
            modalImg.alt = img.alt;
            modalTitle.textContent = title;
            modalDescription.textContent = description;

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    });

    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

function openModal(element) {
    const modal = document.getElementById('imageModal');
    const galleryItem = element.closest('.gallery-item');
    const img = galleryItem.querySelector('img');
    const title = galleryItem.querySelector('h4').textContent;
    const description = galleryItem.querySelector('p').textContent;

    document.getElementById('modalImage').src = img.src;
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalDescription').textContent = description;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Floating elements animation
function initFloatingElements() {
    const floatingLeaves = document.querySelectorAll('.floating-leaf');

    floatingLeaves.forEach((leaf, index) => {
        // Create banana leaf SVG background
        leaf.style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(getBananaLeafSVG())}")`;

        // Add random animation delays and directions
        leaf.style.animationDelay = `${index * 2}s`;
        leaf.style.animationDuration = `${6 + index}s`;

        // Add mouse move parallax effect
        document.addEventListener('mousemove', function(e) {
            const x = (e.clientX / window.innerWidth) * 10;
            const y = (e.clientY / window.innerHeight) * 10;

            leaf.style.transform = `translate(${x}px, ${y}px) rotate(${x * 0.5}deg)`;
        });
    });

    // Create additional floating particles
    createFloatingParticles();
}

function getBananaLeafSVG() {
    return `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 80 Q30 20 50 10 Q70 20 80 80 Q70 90 50 85 Q30 90 20 80 Z" 
                  fill="rgba(76, 175, 80, 0.3)" 
                  stroke="rgba(76, 175, 80, 0.5)" 
                  stroke-width="1"/>
            <path d="M50 10 L50 85" 
                  stroke="rgba(76, 175, 80, 0.4)" 
                  stroke-width="2"/>
            <path d="M30 30 Q40 35 50 30" 
                  stroke="rgba(76, 175, 80, 0.3)" 
                  stroke-width="1" 
                  fill="none"/>
            <path d="M50 30 Q60 35 70 30" 
                  stroke="rgba(76, 175, 80, 0.3)" 
                  stroke-width="1" 
                  fill="none"/>
            <path d="M35 50 Q45 55 50 50" 
                  stroke="rgba(76, 175, 80, 0.3)" 
                  stroke-width="1" 
                  fill="none"/>
            <path d="M50 50 Q55 55 65 50" 
                  stroke="rgba(76, 175, 80, 0.3)" 
                  stroke-width="1" 
                  fill="none"/>
        </svg>
    `;
}

function createFloatingParticles() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            animation: floatParticle ${8 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;

        heroSection.appendChild(particle);
    }

    // Add particle animation keyframes
    if (!document.querySelector('#particle-animation')) {
        const style = document.createElement('style');
        style.id = 'particle-animation';
        style.textContent = `
            @keyframes floatParticle {
                0%, 100% {
                    transform: translateY(0px) translateX(0px);
                    opacity: 0.3;
                }
                25% {
                    transform: translateY(-20px) translateX(10px);
                    opacity: 0.7;
                }
                50% {
                    transform: translateY(-10px) translateX(-10px);
                    opacity: 1;
                }
                75% {
                    transform: translateY(-30px) translateX(5px);
                    opacity: 0.5;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Google Maps initialization
function initMap() {
    // Default location (Jakarta, Indonesia)
    const defaultLocation = { lat: -6.2088, lng: 106.8456 };

    // Check if map container exists
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    try {
        // Initialize map
        const map = new google.maps.Map(mapContainer, {
            zoom: 15,
            center: defaultLocation,
            styles: [
                {
                    featureType: 'all',
                    elementType: 'geometry.fill',
                    stylers: [{ color: '#f5f7fa' }]
                },
                {
                    featureType: 'water',
                    elementType: 'geometry',
                    stylers: [{ color: '#4CAF50' }, { saturation: -20 }]
                },
                {
                    featureType: 'road',
                    elementType: 'geometry',
                    stylers: [{ color: '#ffffff' }]
                }
            ]
        });

        // Add marker
        const marker = new google.maps.Marker({
            position: defaultLocation,
            map: map,
            title: 'PT. Indogreen Export Global',
            icon: {
                url: `data:image/svg+xml,${encodeURIComponent(`
                    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="20" cy="20" r="18" fill="#4CAF50" stroke="#ffffff" stroke-width="2"/>
                        <path d="M12 28 Q16 12 20 8 Q24 12 28 28 Q24 32 20 30 Q16 32 12 28 Z" 
                              fill="#ffffff"/>
                    </svg>
                `)}`,
                scaledSize: new google.maps.Size(40, 40)
            }
        });

        // Add info window
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px; font-family: Poppins, sans-serif;">
                    <h4 style="margin: 0 0 5px 0; color: #4CAF50;">PT. Indogreen Export Global</h4>
                    <p style="margin: 0; font-size: 14px;">Jl. Ekspor Daun Pisang No. 123<br>Jakarta Selatan, Indonesia</p>
                </div>
            `
        });

        marker.addListener('click', function() {
            infoWindow.open(map, marker);
        });

    } catch (error) {
        console.error('Error initializing Google Maps:', error);
        mapContainer.innerHTML = `
            <div style="
                display: flex; 
                align-items: center; 
                justify-content: center; 
                height: 100%; 
                background: #f5f7fa; 
                color: #666;
                font-family: Poppins, sans-serif;
                text-align: center;
                padding: 2rem;
            ">
                <div>
                    <i class="fas fa-map-marker-alt" style="font-size: 3rem; color: #4CAF50; margin-bottom: 1rem;"></i>
                    <h4 style="margin-bottom: 0.5rem;">Lokasi Perusahaan</h4>
                    <p>Jl. Ekspor Daun Pisang No. 123<br>Jakarta Selatan, Indonesia</p>
                </div>
            </div>
        `;
    }
}

// Make initMap globally available for Google Maps API callback
window.initMap = initMap;

// Additional utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Performance monitoring
function logPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const timing = performance.timing;
                const loadTime = timing.loadEventEnd - timing.navigationStart;
                console.log(`Page loaded in ${loadTime}ms`);
            }, 0);
        });
    }
}

// Initialize performance monitoring in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    logPerformance();
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to a logging service
});

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}