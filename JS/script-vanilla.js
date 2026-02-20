/* ================================ */
/* Vanilla JS Functionality         */
/* ================================ */

// Skills Data
const skills = {
    "Programming Languages": [
        { name: "C", level: "intermediate", desc: "System Programming" },
        { name: "C++", level: "intermediate", desc: "OOP & Data Structures" },
        { name: "Java", level: "beginner", desc: "Object-Oriented Programming" },
        { name: "JavaScript", level: "intermediate", desc: "Web Development" },
        { name: "PHP", level: "beginner", desc: "Server-Side Scripting" }
    ],
    "Frontend": [
        { name: "HTML", level: "intermediate", desc: "Semantic Markup" },
        { name: "CSS", level: "intermediate", desc: "Responsive Design" },
        { name: "JavaScript", level: "intermediate", desc: "DOM Manipulation" },
        { name: "React", level: "beginner", desc: "Component Libraries" },
        { name: "Bootstrap", level: "intermediate", desc: "CSS Framework" }
    ],
    "Databases": [
        { name: "SQL", level: "intermediate", desc: "Query Optimization" },
        { name: "DBMS", level: "intermediate", desc: "Database Design" },
        { name: "MySQL", level: "beginner", desc: "Relational Database" },
        { name: "MongoDB", level: "beginner", desc: "NoSQL Database" },
        { name: "PostgreSQL", level: "beginner", desc: "Advanced SQL" }
    ]
};

/* ================================ */
/* EmailJS Configuration (replace)  */
/* ================================ */
// Replace the placeholders below with your EmailJS credentials.
// Where to put values:
// - `EMAILJS_PUBLIC_KEY`: Your EmailJS public (user) key (starts with 'user_' or similar).
// - `EMAILJS_SERVICE_ID`: The service ID you created in EmailJS (e.g. 'service_xxx').
// - `EMAILJS_TEMPLATE_ID`: The template ID you created in EmailJS (e.g. 'template_xxx').
// You can set these strings directly here or replace them at build time.
const EMAILJS_PUBLIC_KEY = 'LJ_XX89TpHf54s_P8';
const EMAILJS_SERVICE_ID = 'service_js5crgd';
const EMAILJS_TEMPLATE_ID = 'template_hvbzxjy';

let _emailjsLoaded = false;
function loadEmailJSSDK() {
    if (_emailjsLoaded) return Promise.resolve();
    return new Promise((resolve, reject) => {
        const src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
            _emailjsLoaded = true;
            return resolve();
        }
        const s = document.createElement('script');
        s.src = src;
        s.async = true;
        s.onload = () => {
            _emailjsLoaded = true;
            // initialize if public key provided
            if (window.emailjs && EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY') {
                try { window.emailjs.init(EMAILJS_PUBLIC_KEY); } catch (e) { /* ignore */ }
            }
            resolve();
        };
        s.onerror = () => reject(new Error('Failed to load EmailJS SDK'));
        document.head.appendChild(s);
    });
}

function emailjsConfigValid() {
    if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) return false;
    if (EMAILJS_PUBLIC_KEY.startsWith('YOUR_') || EMAILJS_SERVICE_ID.startsWith('YOUR_') || EMAILJS_TEMPLATE_ID.startsWith('YOUR_')) return false;
    return true;
}

function extractErrorMessage(err) {
    if (!err) return 'Unknown error';
    if (typeof err === 'string') return err;
    if (err.message) return err.message;
    if (err.statusText) return err.statusText;
    // EmailJS sometimes returns an object with a 'text' property
    if (err.text) return err.text;
    try { return JSON.stringify(err); } catch (e) { return String(err); }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupCustomCursor();
    populateSkills();
    setupNavbar();
    setupProfileToLogoTransition();
    setupMobileMenu();
    setupContactForm();
    setupIntersectionObserver();
    setCurrentYear();
    setupThemeToggle();
    setupEducationDetailsToggle();
    setupScrollProgress();
    setupBackToTop();
    setupModal();
});
 
 /* ================================ */
 /* Education Details Toggle         */
 /* ================================ */
 
 function setupEducationDetailsToggle() {
     const toggleBtn = document.getElementById('education-toggle-btn');
     const detailsContainer = document.getElementById('education-details-container');
     
     if (!toggleBtn || !detailsContainer) return;
     
     toggleBtn.addEventListener('click', () => {
         const isHidden = detailsContainer.hasAttribute('hidden');
         if (isHidden) {
             detailsContainer.removeAttribute('hidden');
             toggleBtn.setAttribute('aria-expanded', 'true');
             toggleBtn.textContent = 'Less';
         } else {
             detailsContainer.setAttribute('hidden', '');
             toggleBtn.setAttribute('aria-expanded', 'false');
             toggleBtn.textContent = 'More';
         }
     });
 }

/* ================================ */
/* Navbar Functions                 */
/* ================================ */

function setupNavbar() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll for nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            const section = document.querySelector(href);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
                // Close mobile menu if open
                document.getElementById('navMenu').classList.remove('mobile-open');
                document.getElementById('mobileToggle').classList.remove('active');
            }
        });
    });
}

function setupProfileToLogoTransition() {
    const heroProfile = document.querySelector('.hero-profile');
    const heroProfileImg = document.querySelector('.hero-profile-img');
    const navbarLogoImg = document.querySelector('.navbar-logo-img');

    if (!heroProfile || !heroProfileImg || !navbarLogoImg) return;

    const originalLogoSrc = navbarLogoImg.getAttribute('src');
    const originalLogoAlt = navbarLogoImg.getAttribute('alt') || 'Roha logo';
    const profileSrc = heroProfileImg.getAttribute('src');
    const profileAlt = heroProfileImg.getAttribute('alt') || 'Profile photo';

    navbarLogoImg.style.transition = 'opacity 0.25s ease, width 0.35s ease, height 0.35s ease, border-radius 0.35s ease';

    let isInLogoPosition = false;
    let isAnimating = false;
    let logoSwapTimeoutId = null;
    const enterLogoScrollY = 150;
    const exitLogoScrollY = 85;

    const animateImageBetweenRects = (fromRect, toRect, imageSrc, imageAlt, onComplete) => {
        const clone = document.createElement('img');
        clone.src = imageSrc;
        clone.alt = imageAlt;
        clone.style.position = 'fixed';
        clone.style.left = `${fromRect.left}px`;
        clone.style.top = `${fromRect.top}px`;
        clone.style.width = `${fromRect.width}px`;
        clone.style.height = `${fromRect.height}px`;
        clone.style.borderRadius = '50%';
        clone.style.objectFit = 'cover';
        clone.style.margin = '0';
        clone.style.pointerEvents = 'none';
        clone.style.zIndex = '12000';
        clone.style.boxShadow = '0 10px 24px rgba(2, 6, 23, 0.25)';
        clone.style.opacity = '0.98';
        clone.style.transition = 'left 0.72s cubic-bezier(0.22, 1, 0.36, 1), top 0.72s cubic-bezier(0.22, 1, 0.36, 1), width 0.72s cubic-bezier(0.22, 1, 0.36, 1), height 0.72s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease';
        document.body.appendChild(clone);

        requestAnimationFrame(() => {
            clone.style.left = `${toRect.left}px`;
            clone.style.top = `${toRect.top}px`;
            clone.style.width = `${toRect.width}px`;
            clone.style.height = `${toRect.height}px`;
        });

        let finished = false;
        const cleanup = () => {
            if (finished) return;
            finished = true;
            clone.remove();
            if (typeof onComplete === 'function') onComplete();
        };

        clone.addEventListener('transitionend', cleanup, { once: true });
        window.setTimeout(cleanup, 900);
    };

    const swapNavbarLogo = (src, alt, addProfileMode) => {
        if (logoSwapTimeoutId) {
            window.clearTimeout(logoSwapTimeoutId);
            logoSwapTimeoutId = null;
        }

        navbarLogoImg.style.opacity = '0';

        logoSwapTimeoutId = window.setTimeout(() => {
            navbarLogoImg.setAttribute('src', src);
            navbarLogoImg.setAttribute('alt', alt);
            navbarLogoImg.classList.toggle('profile-photo-mode', addProfileMode);
            navbarLogoImg.style.opacity = '1';
            logoSwapTimeoutId = null;
        }, 90);
    };

    const setHeroMorphState = (hidden) => {
        heroProfile.classList.add('morph-stable');
        heroProfile.classList.toggle('morph-hidden', hidden);
        heroProfile.style.pointerEvents = hidden ? 'none' : 'auto';
    };

    const resetHeroMorphState = () => {
        heroProfile.classList.remove('morph-hidden');
        heroProfile.classList.remove('morph-stable');
        heroProfile.style.pointerEvents = 'auto';
    };

    const moveToLogo = () => {
        if (isInLogoPosition || isAnimating) return;
        isAnimating = true;

        const fromRect = heroProfile.getBoundingClientRect();
        const toRect = navbarLogoImg.getBoundingClientRect();

        setHeroMorphState(true);

        animateImageBetweenRects(fromRect, toRect, profileSrc, profileAlt, () => {
            swapNavbarLogo(profileSrc, profileAlt, true);
            isInLogoPosition = true;
            isAnimating = false;
        });
    };

    const moveBackToHero = () => {
        if (!isInLogoPosition || isAnimating) return;
        isAnimating = true;

        const fromRect = navbarLogoImg.getBoundingClientRect();

        setHeroMorphState(true);

        const toRect = heroProfile.getBoundingClientRect();

        animateImageBetweenRects(fromRect, toRect, profileSrc, profileAlt, () => {
            swapNavbarLogo(originalLogoSrc, originalLogoAlt, false);

            requestAnimationFrame(() => {
                resetHeroMorphState();
                isInLogoPosition = false;
                isAnimating = false;
            });
        });
    };

    const onScroll = () => {
        if (isAnimating) return;

        if (!isInLogoPosition && window.scrollY > enterLogoScrollY) {
            moveToLogo();
        } else if (isInLogoPosition && window.scrollY < exitLogoScrollY) {
            moveBackToHero();
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

function setupMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('mobile-open');
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('mobile-open');
        });
    });
}

/* ================================ */
/* Skills Grid                      */
/* ================================ */

function populateSkills() {
    const skillsGrid = document.getElementById('skillsGrid');
    let html = '';
    let index = 0;

    // Category icons
    const categoryIcons = {
        "Programming Languages": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="10,9 9,9 8,9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        "Frontend": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
            <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="2"/>
            <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="2"/>
        </svg>`,
        "Databases": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" stroke-width="2"/>
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" stroke="currentColor" stroke-width="2"/>
            <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" stroke="currentColor" stroke-width="2"/>
        </svg>`,
        "Tools & Technologies": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`
    };

    for (const [category, skillList] of Object.entries(skills)) {
        const icon = categoryIcons[category] || '';
        html += `<div class="skill-category">
            <h3 class="skill-category-title">
                <span class="category-icon">${icon}</span>
                ${category}
            </h3>
            <div class="skill-category-grid">`;

        skillList.forEach(skill => {
            html += `
                <div class="skill-card fade-in" style="animation-delay: ${index * 0.07}s">
                    <h4>${skill.name}</h4>
                    <p>${skill.desc}</p>
                    <span class="skill-level ${skill.level.toLowerCase()}">${skill.level}</span>
                </div>`;
            index++;
        });

        html += `</div></div>`;
    }

    skillsGrid.innerHTML = html;
}

/* ================================ */
/* Contact Form                     */
/* ================================ */

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) {
        console.warn('Contact form not found');
        return;
    }
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Validate
        if (!name || !email || !message) {
            alert('Please fill out all fields');
            return;
        }

        // Check EmailJS config before attempting to send
        if (!emailjsConfigValid()) {
            alert('EmailJS is not configured. Please open script-vanilla.js and set EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, and EMAILJS_TEMPLATE_ID.');
            return;
        }

        // Disable button during submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span>';

        try {
            // Use EmailJS to send the message (vanilla JS)
            await loadEmailJSSDK();

            if (!window.emailjs) throw new Error('EmailJS SDK not available');
            // initialize if not already
            try {
                if (EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY') {
                    window.emailjs.init(EMAILJS_PUBLIC_KEY);
                }
            } catch (initErr) {
                // ignore init errors
            }

            const templateParams = {
                from_name: name,
                from_email: email,
                message: message
            };

            // Send via EmailJS
            await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);

            // Show success message
            showSuccessModal();
            contactForm.reset();

        } catch (error) {
            console.error('Email send error (detailed):', error);
            const msg = extractErrorMessage(error);
            alert(`❌ Error: ${msg}`);
        } finally {
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
}

/* ================================ */
/* Intersection Observer            */
/* ================================ */

function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all fade-in elements that are not part of hero
    document.querySelectorAll('.fade-in:not(.hero-content .fade-in-up)').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        observer.observe(el);
    });
}

/* ================================ */
/* Utilities                        */
/* ================================ */

function setCurrentYear() {
    document.getElementById('currentYear').textContent = new Date().getFullYear();
}

function setupCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');

    if (!cursor) return;

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!finePointer) {
        cursor.remove();
        return;
    }

    const hoverTargets = 'a, button, [role="button"], input, textarea, select, .cta-button, .social-icon, .skill-card, .project-card';
    let pointerX = 0;
    let pointerY = 0;
    let prevPointerX = null;
    let prevPointerY = null;
    let animationFrame = null;
    let lastBubbleAt = 0;
    const bubbleInterval = 26;
    let swimAngle = 0;
    let movementSpeed = 0;

    const spawnTrailBubble = (x, y, angle) => {
        const bubble = document.createElement('span');
        bubble.className = 'cursor-trail-bubble';

        const trailDistance = 8 + Math.random() * 8;
        const spawnX = x - Math.cos(angle) * trailDistance + (Math.random() - 0.5) * 4;
        const spawnY = y - Math.sin(angle) * trailDistance + (Math.random() - 0.5) * 4;
        const bubbleSize = 4 + Math.random() * 5;
        const driftX = (Math.random() - 0.5) * 14;
        const driftY = -14 - Math.random() * 12;
        const duration = 0.55 + Math.random() * 0.35;

        bubble.style.left = `${spawnX}px`;
        bubble.style.top = `${spawnY}px`;
        bubble.style.setProperty('--bubble-size', `${bubbleSize}px`);
        bubble.style.setProperty('--bubble-drift-x', `${driftX}px`);
        bubble.style.setProperty('--bubble-drift-y', `${driftY}px`);
        bubble.style.setProperty('--bubble-duration', `${duration}s`);

        document.body.appendChild(bubble);
        bubble.addEventListener('animationend', () => {
            bubble.remove();
        }, { once: true });
    };

    const paintCursor = () => {
        cursor.style.left = `${pointerX}px`;
        cursor.style.top = `${pointerY}px`;
        animationFrame = null;
    };

    window.addEventListener('mousemove', (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;

        if (prevPointerX !== null && prevPointerY !== null) {
            const deltaX = pointerX - prevPointerX;
            const deltaY = pointerY - prevPointerY;
            const movement = Math.hypot(deltaX, deltaY);
            movementSpeed = movement;

            if (movement > 0.5) {
                swimAngle = Math.atan2(deltaY, deltaX);
                const angleDeg = swimAngle * (180 / Math.PI);
                cursor.style.setProperty('--cursor-rotation', `${angleDeg}deg`);
            }
        }

        prevPointerX = pointerX;
        prevPointerY = pointerY;

        const now = performance.now();
        if (now - lastBubbleAt >= bubbleInterval) {
            spawnTrailBubble(pointerX, pointerY, swimAngle);

            if (movementSpeed > 9 && Math.random() < 0.65) {
                spawnTrailBubble(pointerX, pointerY, swimAngle);
            }

            lastBubbleAt = now;
        }

        if (!animationFrame) {
            animationFrame = requestAnimationFrame(paintCursor);
        }
    }, { passive: true });

    document.querySelectorAll(hoverTargets).forEach((element) => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('is-hovering');
        });

        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('is-hovering');
        });
    });

    document.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-hovering');
    });
}

/* ================================ */
/* Smooth Scroll Enhancement        */
/* ================================ */

// Add smooth scroll behavior for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#0') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

/* ================================ */
/* Theme Toggle                     */
/* ================================ */

function applyTheme(theme) {
    const isLight = theme === 'light';
    document.body.classList.toggle('light', isLight);
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = isLight ? '☀️' : '🌙';
}

function setupThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    // Determine initial theme: saved preference or system preference
    const saved = localStorage.getItem('theme');
    let theme = saved;
    if (!theme) {
        const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
        theme = prefersLight ? 'light' : 'dark';
    }

    applyTheme(theme);

    btn.addEventListener('click', () => {
        const currentIsLight = document.body.classList.contains('light');
        const next = currentIsLight ? 'dark' : 'light';
        applyTheme(next);
        localStorage.setItem('theme', next);
    });
}

/* ================================ */
/* Active Navigation Link           */
/* ================================ */

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 200;
        const sectionHeight = section.offsetHeight;

        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${section.getAttribute('id')}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

/* ================================ */
/* Keyboard Navigation              */
/* ================================ */

document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('navMenu');
        const mobileToggle = document.getElementById('mobileToggle');

        if (navMenu.classList.contains('mobile-open')) {
            navMenu.classList.remove('mobile-open');
            mobileToggle.classList.remove('active');
        }
    }
});

/* ================================ */
/* Back to Top Button              */
/* ================================ */

function setupBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');

    if (!backToTopBtn) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    // Smooth scroll to top on click
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ================================ */
/* Success Modal                   */
/* ================================ */

function setupModal() {
    // Modal functionality is handled in showSuccessModal
}

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    const okBtn = document.getElementById('modalOkBtn');

    if (!modal || !okBtn) return;

    document.body.classList.add('modal-open');
    modal.classList.add('show');

    const closeModal = () => {
        modal.classList.remove('show');
        document.body.classList.remove('modal-open');
        document.removeEventListener('keydown', onKeyDown);
    };

    const onKeyDown = (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    };

    // Close modal on OK button click
    okBtn.onclick = closeModal;

    // Close modal on overlay click
    modal.onclick = (e) => {
        if (e.target === modal) {
            closeModal();
        }
    };

    // Close modal on Escape key
    document.addEventListener('keydown', onKeyDown);
}
