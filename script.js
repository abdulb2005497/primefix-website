// Professional Maintenance Services - JavaScript
// Functionality: Smooth scroll, lightbox, form validation

// ============================================
// 1. SMOOTH SCROLL FUNCTIONALITY
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scroll for all elements with data-scroll attribute
    const scrollButtons = document.querySelectorAll('[data-scroll]');
    
    scrollButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-scroll');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // 2. LIGHTBOX FUNCTIONALITY
    // ============================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxVideo = lightbox.querySelector('.lightbox-video');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    const lightboxCounter = lightbox.querySelector('.lightbox-counter');
    
    let currentImageIndex = 0;
    let images = [];
    
    function initializeLightbox() {
        const galleryItems = document.querySelectorAll('.gallery-item, .portfolio-item');
        images = [];
        
        // Collect all gallery images and videos
        galleryItems.forEach((item, index) => {
            const img = item.querySelector('img');
            const video = item.querySelector('video');
            
            if (img) {
                images.push({
                    src: img.src,
                    alt: img.alt,
                    type: 'image'
                });
            } else if (video) {
                images.push({
                    src: video.src,
                    alt: 'Video',
                    type: 'video',
                    poster: video.poster
                });
            }
            
            // Add click event to open lightbox
            item.addEventListener('click', function() {
                openLightbox(index);
            });
        });
    }
    
    initializeLightbox();
    
    function openLightbox(index) {
        currentImageIndex = index;
        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        // Pause video if playing
        if (lightboxVideo.style.display !== 'none') {
            lightboxVideo.pause();
        }
    }
    
    function updateLightboxContent() {
        if (images.length > 0) {
            const currentItem = images[currentImageIndex];
            
            if (currentItem.type === 'video') {
                // Show video, hide image
                lightboxImage.style.display = 'none';
                lightboxVideo.style.display = 'block';
                lightboxVideo.src = currentItem.src;
                lightboxVideo.load();
                lightboxVideo.play();
            } else {
                // Show image, hide video
                lightboxVideo.style.display = 'none';
                lightboxVideo.pause();
                lightboxImage.style.display = 'block';
                lightboxImage.src = currentItem.src;
                lightboxImage.alt = currentItem.alt;
            }
            
            lightboxCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;
        }
    }
    
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateLightboxContent();
    }
    
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateLightboxContent();
    }
    
    // Lightbox event listeners
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', showNextImage);
    lightboxPrev.addEventListener('click', showPrevImage);
    
    // Close lightbox when clicking on the dark background
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation for lightbox
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            }
        }
    });

    // ============================================
    // 2.5. SEE MORE TOGGLE FUNCTIONALITY
    // ============================================
    const seeMoreBtn = document.getElementById('seeMoreBtn');
    const extraPortfolio = document.getElementById('extraPortfolio');
    
    if (seeMoreBtn && extraPortfolio) {
        seeMoreBtn.addEventListener('click', function() {
            const isExpanded = extraPortfolio.classList.contains('show');
            
            if (isExpanded) {
                // Collapse
                extraPortfolio.classList.remove('show');
                seeMoreBtn.classList.remove('active');
                seeMoreBtn.querySelector('.see-more-text').textContent = 'See More Projects';
            } else {
                // Expand
                extraPortfolio.classList.add('show');
                seeMoreBtn.classList.add('active');
                seeMoreBtn.querySelector('.see-more-text').textContent = 'See Less';
                
                // Re-initialize lightbox to include new items
                initializeLightbox();
            }
        });
    }

    // ============================================
    // 3. FORM VALIDATION
    // ============================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const contact = document.getElementById('contact').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Validation flags
            let isValid = true;
            let errorMessage = '';
            
            // Validate name
            if (name === '' || name.length < 2) {
                isValid = false;
                errorMessage += 'Please enter a valid name.\n';
            }
            
            // Validate contact (phone or email)
            if (contact === '') {
                isValid = false;
                errorMessage += 'Please enter your phone number or email.\n';
            }
            
            // Validate message
            if (message === '' || message.length < 10) {
                isValid = false;
                errorMessage += 'Please enter a message (at least 10 characters).\n';
            }
            
            if (!isValid) {
                alert(errorMessage);
                return false;
            }
            
            // If validation passes, submit the form
            // If using Formspree, the form will submit naturally
            // Otherwise, show success message
            
            // Check if Formspree is configured
            const formAction = contactForm.getAttribute('action');
            
            if (formAction && formAction.includes('formspree.io')) {
                // Let the form submit to Formspree
                contactForm.submit();
            } else {
                // Show success message (demo mode)
                showSuccessMessage();
                contactForm.reset();
            }
        });
    }
    
    function showSuccessMessage() {
        // Create success message element
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #10b981;
            color: white;
            padding: 2rem 3rem;
            border-radius: 0.75rem;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            z-index: 3000;
            text-align: center;
            font-size: 1.125rem;
            font-weight: 600;
        `;
        successDiv.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 1rem;">✓</div>
            <div>Thank you for your message!</div>
            <div style="font-size: 0.95rem; font-weight: 400; margin-top: 0.5rem;">We'll contact you soon.</div>
        `;
        
        document.body.appendChild(successDiv);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            successDiv.style.opacity = '0';
            successDiv.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(successDiv);
            }, 300);
        }, 3000);
    }

    // ============================================
    // 4. SCROLL EFFECTS (Optional Enhancement)
    // ============================================
    // Add shadow to header on scroll
    const header = document.querySelector('.header, .main-nav');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = '';
            }
        });
    }

    // ============================================
    // 5. LAZY LOADING IMAGES (Performance)
    // ============================================
    // Modern browsers support lazy loading with loading="lazy" attribute
    // This is already implemented in the HTML
    
    // ============================================
    // 6. INITIALIZE ON PAGE LOAD
    // ============================================
    console.log('Professional Maintenance Services - Website loaded successfully!');
    
    // Add fade-in animation to sections as they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections for fade-in effect
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
});
