/* ================================ */
/* Vanilla JS Functionality         */
/* ================================ */

// Skills Data
const skills = [
    { name: "C++", desc: "OOP & Data Structures" },
    { name: "Java", desc: "Object-Oriented Programming" },
    { name: "C", desc: "Programming Language" },
    { name: "JavaScript", desc: "Web Development" },
    { name: "HTML", desc: "Markup Language" },
    { name: "CSS", desc: "Styling & Layouts" },
    { name: "PHP", desc: "Server-Side Scripting" },
    { name: "SQL", desc: "Database Queries" },
    { name: "DBMS", desc: "Database Management" },
    { name: "OOP", desc: "Design Principles" },
    { name: "Front-End Dev", desc: "HTML, CSS, JS" },
];

/* ================================ */
/* EmailJS Configuration (replace)  */
/* ================================ */
// Replace the placeholders below with your EmailJS credentials.
// Where to put values:
// - `EMAILJS_PUBLIC_KEY`: Your EmailJS public (user) key (starts with 'user_' or similar).
// - `EMAILJS_SERVICE_ID`: The service ID you created in EmailJS (e.g. 'service_xxx').
// - `EMAILJS_TEMPLATE_ID`: The template ID you created in EmailJS (e.g. 'template_xxx').
// Prefer injecting these from a deployment-time script to avoid committing live values.
const EMAILJS_PUBLIC_KEY = window.__EMAILJS_PUBLIC_KEY || 'rwJBUq6XjSE1B97c-';
const EMAILJS_SERVICE_ID = window.__EMAILJS_SERVICE_ID || 'service_dcj3zr4';
const EMAILJS_TEMPLATE_ID = window.__EMAILJS_TEMPLATE_ID || 'template_6dz33cc';

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
    setupNavbar();
    setupHeroScrollHint();
    setupProfileToLogoTransition();
    setupMobileMenu();
    setupContactForm();
    setupIntersectionObserver();
    setupMobileProjectThumbnailPreview();
    setupSkillsProgressObserver();
    setupDarkModeBackgroundMotion();
    setCurrentYear();
    setupThemeToggle();
    setupEducationDetailsToggle();
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

    const updateNavbarState = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', updateNavbarState, { passive: true });
    updateNavbarState();

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

function setupHeroScrollHint() {
    const heroScrollHint = document.querySelector('.hero-scroll');
    if (!heroScrollHint) return;

    const toggleHintVisibility = () => {
        if (window.scrollY > 20) {
            heroScrollHint.classList.add('is-hidden');
        } else {
            heroScrollHint.classList.remove('is-hidden');
        }
    };

    window.addEventListener('scroll', toggleHintVisibility, { passive: true });
    toggleHintVisibility();
}

function setupProfileToLogoTransition() {
    const heroProfile = document.querySelector('.hero-profile');
    const heroProfileImg = document.querySelector('.hero-profile-img');
    const navbarLogoImg = document.querySelector('.navbar-logo-img');

    if (!heroProfile || !heroProfileImg || !navbarLogoImg) return;

    heroProfile.classList.add('morph-stable');
    heroProfile.classList.remove('morph-hidden');

    const originalLogoSrc = navbarLogoImg.getAttribute('src');
    const originalLogoAlt = navbarLogoImg.getAttribute('alt') || 'Roha logo';
    const profileSrc = heroProfileImg.getAttribute('src');
    const profileAlt = heroProfileImg.getAttribute('alt') || 'Profile photo';

    let isInLogoPosition = false;
    let isAnimating = false;
    let logoSwapTimeoutId = null;

    const ENTER_SCROLL = 150;
    const EXIT_SCROLL  = 85;

    // Create a flying clone that animates between two rects
    const flyClone = (fromRect, toRect, onDone) => {
        const clone = document.createElement('img');
        clone.src = profileSrc;
        clone.alt = profileAlt;
        Object.assign(clone.style, {
            position:     'fixed',
            left:         `${fromRect.left}px`,
            top:          `${fromRect.top}px`,
            width:        `${fromRect.width}px`,
            height:       `${fromRect.height}px`,
            borderRadius: '50%',
            objectFit:    'cover',
            pointerEvents:'none',
            zIndex:       '12000',
            margin:       '0',
            padding:      '0',
            transition:   'left 0.68s cubic-bezier(0.22,1,0.36,1),' +
                          'top 0.68s cubic-bezier(0.22,1,0.36,1),' +
                          'width 0.68s cubic-bezier(0.22,1,0.36,1),' +
                          'height 0.68s cubic-bezier(0.22,1,0.36,1),' +
                          'opacity 0.3s ease',
            opacity:      '1',
        });
        document.body.appendChild(clone);

        // Force reflow before starting transition
        clone.getBoundingClientRect();

        requestAnimationFrame(() => {
            clone.style.left   = `${toRect.left}px`;
            clone.style.top    = `${toRect.top}px`;
            clone.style.width  = `${toRect.width}px`;
            clone.style.height = `${toRect.height}px`;
        });

        let done = false;
        const finish = () => {
            if (done) return;
            done = true;
            clone.remove();
            if (typeof onDone === 'function') onDone();
        };
        clone.addEventListener('transitionend', finish, { once: true });
        setTimeout(finish, 800); // safety fallback
    };

    // Swap the navbar logo src with a fade
    const swapLogo = (src, alt, profileMode) => {
        if (logoSwapTimeoutId) clearTimeout(logoSwapTimeoutId);
        navbarLogoImg.style.opacity = '0';
        logoSwapTimeoutId = setTimeout(() => {
            navbarLogoImg.src = src;
            navbarLogoImg.alt = alt;
            navbarLogoImg.classList.toggle('profile-photo-mode', profileMode);
            navbarLogoImg.style.opacity = '1';
        }, 80);
    };

    // -- Move DOWN: hero -> logo -------------------------
    const moveToLogo = () => {
        if (isInLogoPosition || isAnimating) return;
        isAnimating = true;

        // Snapshot rects BEFORE hiding anything
        const fromRect = heroProfile.getBoundingClientRect();
        const toRect   = navbarLogoImg.getBoundingClientRect();

        // Hide hero photo -- clone will represent it during flight
        heroProfile.style.opacity = '0';

        flyClone(fromRect, toRect, () => {
            swapLogo(profileSrc, profileAlt, true);
            isInLogoPosition = true;
            isAnimating = false;
            // heroProfile stays hidden -- it's now "in" the navbar
        });
    };

    // -- Move UP: logo -> hero ---------------------------
    const moveBackToHero = () => {
        if (!isInLogoPosition || isAnimating) return;
        isAnimating = true;

        // Snapshot logo rect BEFORE swapping it back
        const fromRect = navbarLogoImg.getBoundingClientRect();

        // Swap logo back to original immediately (logo area shows
        // original logo while clone is flying)
        swapLogo(originalLogoSrc, originalLogoAlt, false);

        // Snapshot hero rect -- it's invisible so layout is stable
        const toRect = heroProfile.getBoundingClientRect();

        flyClone(fromRect, toRect, () => {
            // Fade hero photo back in cleanly
            heroProfile.style.transition = 'opacity 0.35s ease';
            heroProfile.style.opacity = '1';

            // Clean up inline transition after fade completes
            setTimeout(() => {
                heroProfile.style.transition = '';
            }, 380);

            isInLogoPosition = false;
            isAnimating = false;
        });
    };

    // -- Scroll listener --------------------------------
    window.addEventListener('scroll', () => {
        if (isAnimating) return;
        if (!isInLogoPosition && window.scrollY > ENTER_SCROLL) {
            moveToLogo();
        } else if (isInLogoPosition && window.scrollY < EXIT_SCROLL) {
            moveBackToHero();
        }
    }, { passive: true });
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
    if (!skillsGrid) return;
    skillsGrid.innerHTML = skills.map((skill, index) => `
        <div class="skill-card fade-in" style="animation-delay: ${index * 0.07}s">
            <h4>${skill.name}</h4>
            <p>${skill.desc}</p>
        </div>
    `).join('');
}

/* ================================ */
/* Contact Form                     */
/* ================================ */

function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('contactSubmitBtn');
    if (!contactForm || !submitBtn) {
        console.warn('Contact form not found');
        return;
    }
    const btnText = submitBtn.querySelector('.feedback-btn-text');
    const formInputs = [
        document.getElementById('name'),
        document.getElementById('email'),
        document.getElementById('message')
    ].filter(Boolean);

    function setButtonLoading(loading) {
        submitBtn.disabled = loading;
        if (btnText) btnText.textContent = loading ? 'Sending...' : 'Send Message';
    }

    function showFormMessage(msg, type = 'success') {
        let msgDiv = contactForm.querySelector('.form-status-msg');
        if (!msgDiv) {
            msgDiv = document.createElement('div');
            msgDiv.className = 'form-status-msg';
            msgDiv.style.marginTop = '1em';
            msgDiv.style.fontWeight = 'bold';
            msgDiv.style.textAlign = 'center';
            contactForm.appendChild(msgDiv);
        }
        msgDiv.textContent = msg;
        msgDiv.style.color = type === 'success' ? 'green' : 'red';
    }

    async function ensureEmailJSLoadedAndInit() {
        for (let i = 0; i < 40; i++) { // Wait up to ~4s
            if (window.emailjs) break;
            await new Promise(res => setTimeout(res, 100));
        }
        if (!window.emailjs) {
            console.error('EmailJS SDK not loaded');
            alert('Email service not loaded');
            return false;
        }
        if (!window.__emailjs_inited) {
            try {
                window.emailjs.init(EMAILJS_PUBLIC_KEY);
                window.__emailjs_inited = true;
                console.log('EmailJS initialized');
            } catch (e) {
                console.error('EmailJS init error', e);
                alert('Email service not loaded');
                return false;
            }
        } else {
            console.log('EmailJS already initialized');
        }
        return true;
    }

    const resetOnEdit = () => {
        showFormMessage('', 'success');
        setButtonLoading(false);
    };
    formInputs.forEach((inputEl) => {
        inputEl.addEventListener('input', resetOnEdit);
    });

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        setButtonLoading(true);
        showFormMessage('', 'success');

        // Wait for EmailJS SDK and init
        const ready = await ensureEmailJSLoadedAndInit();
        if (!ready) {
            setButtonLoading(false);
            showFormMessage('Email service not loaded. Please try again later.', 'error');
            return;
        }
        if (!emailjsConfigValid()) {
            setButtonLoading(false);
            showFormMessage('Email service not configured. Please try again later.', 'error');
            return;
        }

        // Get form data
        const formData = {
            name: contactForm.name.value.trim(),
            email: contactForm.email.value.trim(),
            message: contactForm.message.value.trim(),
        };

        if (!formData.name || !formData.email || !formData.message) {
            setButtonLoading(false);
            showFormMessage('Please fill out all fields.', 'error');
            return;
        }

        try {
            const result = await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formData);
            console.log('EmailJS send success', result);
            setButtonLoading(false);
            submitBtn.classList.add('is-success');
            if (btnText) btnText.textContent = 'Message Sent!';
            submitBtn.disabled = true;
            contactForm.reset();
        } catch (err) {
            console.error('EmailJS send error', err);
            setButtonLoading(false);
            showFormMessage('Failed to send message. Please try again.', 'error');
        }
    });
}

/* ================================ */
/* Intersection Observer            */
/* ================================ */

function setupIntersectionObserver() {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        // Animate once for a polished, non-distracting reveal effect.
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: '0px 0px -40px 0px'
            }
        );

        document.querySelectorAll('.reveal').forEach(el => {
            revealObserver.observe(el);
        });
}

function setupMobileProjectThumbnailPreview() {
    const isMobileLike = window.matchMedia('(max-width: 767px), (hover: none), (pointer: coarse)').matches;
    if (!isMobileLike) return;

    const projectCards = Array.from(document.querySelectorAll('#projects .project-card')).filter((card) => {
        return card.querySelector('.project-thumb.webscraper-thumb, .project-thumb.sudoku-thumb');
    });

    if (!projectCards.length) return;

    const thumbObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                entry.target.classList.toggle('mobile-thumb-preview', entry.isIntersecting);
            });
        },
        {
            threshold: 0.35,
            rootMargin: '0px 0px -12% 0px'
        }
    );

    projectCards.forEach((card) => {
        thumbObserver.observe(card);
    });
}

function setupSkillsProgressObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
                        bar.style.width = bar.getAttribute('data-width') + '%';
                    });
                }
            });
        }, { threshold: 0.3 });

        document.querySelectorAll('.skills-grid').forEach(grid => {
            observer.observe(grid);
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
    document.body.classList.toggle('dark-mode', !isLight);
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = isLight ? '☀️' : '🌙';
    updateDarkModeBackgroundMotion();
}

let _dmBgMotionBound = false;
let _dmBgMotionRaf = null;
let _dmCurrentGlowY = 24;
let _dmCurrentGlowAlpha = 0.12;
let _dmTargetGlowY = 24;
let _dmTargetGlowAlpha = 0.12;

function applyDarkModeBackgroundVars() {
    document.body.style.setProperty('--dm-glow-y', `${_dmCurrentGlowY.toFixed(2)}%`);
    document.body.style.setProperty('--dm-glow-alpha', _dmCurrentGlowAlpha.toFixed(3));
}

function animateDarkModeBackgroundVars() {
    _dmBgMotionRaf = null;
    if (!document.body.classList.contains('dark-mode')) return;

    const lerp = 0.085;
    _dmCurrentGlowY += (_dmTargetGlowY - _dmCurrentGlowY) * lerp;
    _dmCurrentGlowAlpha += (_dmTargetGlowAlpha - _dmCurrentGlowAlpha) * lerp;

    applyDarkModeBackgroundVars();

    const done =
        Math.abs(_dmCurrentGlowY - _dmTargetGlowY) < 0.01 &&
        Math.abs(_dmCurrentGlowAlpha - _dmTargetGlowAlpha) < 0.001;

    if (!done) {
        _dmBgMotionRaf = window.requestAnimationFrame(animateDarkModeBackgroundVars);
    }
}

function updateDarkModeBackgroundMotion() {
    if (!document.body.classList.contains('dark-mode')) return;

    const scrollTop = window.scrollY || window.pageYOffset || 0;
    const scrollRange = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(scrollTop / scrollRange, 1);

    // Keep motion very subtle and slow for a premium cinematic backdrop.
    _dmTargetGlowY = 24 + progress * 8;
    _dmTargetGlowAlpha = 0.11 + progress * 0.02;

    if (_dmBgMotionRaf === null) {
        _dmBgMotionRaf = window.requestAnimationFrame(animateDarkModeBackgroundVars);
    }
}

function setupDarkModeBackgroundMotion() {
    if (_dmBgMotionBound) {
        updateDarkModeBackgroundMotion();
        return;
    }

    const onScroll = () => {
        updateDarkModeBackgroundMotion();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    _dmBgMotionBound = true;
    updateDarkModeBackgroundMotion();
}

function setupThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;


    // Always default to light mode unless user has chosen
    const saved = localStorage.getItem('theme');
    let theme = saved || 'light';
    applyTheme(theme);

    btn.addEventListener('click', () => {
        const currentIsLight = document.body.classList.contains('light');
        const next = currentIsLight ? 'dark' : 'light';
        applyTheme(next);
        localStorage.setItem('theme', next);
    });

    setupThemeTutorialPopup(btn);
}

function setupThemeTutorialPopup(themeButton) {
    const popup = document.getElementById('theme-tutorial');
    const closeBtn = document.getElementById('theme-tutorial-close');
    const gotItBtn = document.getElementById('theme-tutorial-gotit');
    if (!popup || !themeButton) return;

    const SEEN_KEY = 'themeTutorialSeen';
    const hasSeen = localStorage.getItem(SEEN_KEY) === 'true';
    if (hasSeen) return;

    let popupTimer = null;

    const hidePopup = () => {
        if (popupTimer) {
            window.clearTimeout(popupTimer);
            popupTimer = null;
        }
        popup.classList.remove('is-visible');
        window.setTimeout(() => {
            popup.hidden = true;
        }, 230);
        localStorage.setItem(SEEN_KEY, 'true');
    };

    const showPopup = () => {
        if (localStorage.getItem(SEEN_KEY) === 'true') return;
        popup.hidden = false;
        window.requestAnimationFrame(() => {
            popup.classList.add('is-visible');
        });
    };

    // Show after a short reading window so users can first notice current mode.
    const POPUP_DELAY_MS = 6000;
    popupTimer = window.setTimeout(showPopup, POPUP_DELAY_MS);

    if (closeBtn) {
        closeBtn.addEventListener('click', hidePopup);
    }

    if (gotItBtn) {
        gotItBtn.addEventListener('click', hidePopup);
    }

    themeButton.addEventListener('click', () => {
        localStorage.setItem(SEEN_KEY, 'true');
        if (!popup.hidden) hidePopup();
    }, { once: true });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !popup.hidden) {
            hidePopup();
        }
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
