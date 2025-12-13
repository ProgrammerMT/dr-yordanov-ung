// Advanced JavaScript функционалност за Д-р Йорданов УНГ сайт
// Допълнителни модерни features и оптимизации

// ==========================================
// 1. ADVANCED SCROLL ANIMATIONS
// ==========================================

class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        // Паралакс ефект за hero секция
        this.parallaxHero();
        
        // Scroll reveal за елементи
        this.revealOnScroll();
        
        // Scroll progress bar
        this.progressBar();
        
        // Smooth scrolling с easing
        this.smoothScroll();
    }

    parallaxHero() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            if (hero.querySelector('.hero-bg')) {
                hero.querySelector('.hero-bg').style.transform = 
                    `translateY(${scrolled * parallaxSpeed}px)`;
            }
        });
    }

    revealOnScroll() {
        const elements = document.querySelectorAll('.fade-in, .service-card, .review-card');
        
        const revealOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100); // Staggered animation
                    observer.unobserve(entry.target);
                }
            });
        }, revealOptions);

        elements.forEach(el => revealObserver.observe(el));
    }

    progressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #00A8CC, #00D4FF);
            z-index: 9999;
            transition: width 0.3s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.pageYOffset / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    smoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
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
    }
}

// ==========================================
// 2. PERFORMANCE OPTIMIZATION
// ==========================================

class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // Lazy loading за изображения
        this.lazyLoadImages();
        
        // Defer non-critical resources
        this.deferResources();
        
        // Image optimization
        this.optimizeImages();
        
        // Prefetch important links
        this.prefetchLinks();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    deferResources() {
        // Defer YouTube embeds if any
        const videos = document.querySelectorAll('iframe[data-src]');
        videos.forEach(video => {
            setTimeout(() => {
                video.src = video.dataset.src;
            }, 3000);
        });
    }

    optimizeImages() {
        // WebP support detection
        const supportsWebP = document.createElement('canvas')
            .toDataURL('image/webp')
            .indexOf('data:image/webp') === 0;

        if (supportsWebP) {
            document.querySelectorAll('img[data-webp]').forEach(img => {
                img.src = img.dataset.webp;
            });
        }
    }

    prefetchLinks() {
        // Prefetch important resources on hover
        document.querySelectorAll('a').forEach(link => {
            link.addEventListener('mouseenter', () => {
                if (link.href && !link.href.includes('#')) {
                    const prefetchLink = document.createElement('link');
                    prefetchLink.rel = 'prefetch';
                    prefetchLink.href = link.href;
                    document.head.appendChild(prefetchLink);
                }
            }, { once: true });
        });
    }
}

// ==========================================
// 3. USER EXPERIENCE ENHANCEMENTS
// ==========================================

class UXEnhancements {
    constructor() {
        this.init();
    }

    init() {
        // Click-to-call анимация
        this.animatePhoneLinks();
        
        // Tooltip за икони
        this.addTooltips();
        
        // Keyboard navigation
        this.improveKeyboardNav();
        
        // Focus visible for accessibility
        this.addFocusVisible();
        
        // Copy-to-clipboard за телефон
        this.copyToClipboard();
    }

    animatePhoneLinks() {
        document.querySelectorAll('a[href^="tel:"]').forEach(link => {
            link.addEventListener('click', function(e) {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
            });
        });
    }

    addTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(el => {
            const tooltip = document.createElement('span');
            tooltip.className = 'custom-tooltip';
            tooltip.textContent = el.dataset.tooltip;
            tooltip.style.cssText = `
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                padding: 0.5rem 1rem;
                background: rgba(10, 47, 90, 0.95);
                color: white;
                border-radius: 8px;
                font-size: 0.85rem;
                white-space: nowrap;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s;
                margin-bottom: 0.5rem;
            `;

            el.style.position = 'relative';
            el.appendChild(tooltip);

            el.addEventListener('mouseenter', () => {
                tooltip.style.opacity = '1';
            });

            el.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
            });
        });
    }

    improveKeyboardNav() {
        // Skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Прескочи към съдържанието';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 0;
            background: #0A2F5A;
            color: white;
            padding: 8px;
            text-decoration: none;
            z-index: 10000;
        `;
        
        skipLink.addEventListener('focus', function() {
            this.style.top = '0';
        });
        
        skipLink.addEventListener('blur', function() {
            this.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    addFocusVisible() {
        // Only show focus on keyboard navigation
        let mouseDown = false;

        document.addEventListener('mousedown', () => {
            mouseDown = true;
        });

        document.addEventListener('mouseup', () => {
            mouseDown = false;
        });

        document.addEventListener('focus', (e) => {
            if (mouseDown) {
                e.target.classList.add('no-focus-outline');
            } else {
                e.target.classList.remove('no-focus-outline');
            }
        }, true);

        // Add CSS
        const style = document.createElement('style');
        style.textContent = `
            .no-focus-outline:focus {
                outline: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    copyToClipboard() {
        document.querySelectorAll('.phone-link').forEach(phoneLink => {
            const copyBtn = document.createElement('button');
            copyBtn.innerHTML = '📋';
            copyBtn.title = 'Копирай номер';
            copyBtn.style.cssText = `
                margin-left: 0.5rem;
                padding: 0.3rem 0.6rem;
                background: rgba(0, 168, 204, 0.1);
                border: 1px solid #00A8CC;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s;
            `;

            copyBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const phoneNumber = phoneLink.textContent.trim();
                
                navigator.clipboard.writeText(phoneNumber).then(() => {
                    this.innerHTML = '✓';
                    this.style.background = 'rgba(0, 168, 204, 0.3)';
                    
                    setTimeout(() => {
                        this.innerHTML = '📋';
                        this.style.background = 'rgba(0, 168, 204, 0.1)';
                    }, 2000);
                });
            });

            phoneLink.parentElement.appendChild(copyBtn);
        });
    }
}

// ==========================================
// 4. ANALYTICS & TRACKING
// ==========================================

class AnalyticsTracker {
    constructor() {
        this.init();
    }

    init() {
        // Track clicks
        this.trackClicks();
        
        // Track scroll depth
        this.trackScrollDepth();
        
        // Track time on page
        this.trackTimeOnPage();
        
        // Track video plays
        this.trackVideoPlays();
    }

    trackClicks() {
        document.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('click', function() {
                const label = this.textContent.trim() || this.getAttribute('aria-label') || 'Unknown';
                console.log(`Click tracked: ${label}`);
                
                // Integrate with Google Analytics if available
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'click', {
                        'event_category': 'engagement',
                        'event_label': label
                    });
                }
            });
        });
    }

    trackScrollDepth() {
        const milestones = [25, 50, 75, 100];
        const tracked = new Set();

        window.addEventListener('scroll', () => {
            const scrollPercent = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

            milestones.forEach(milestone => {
                if (scrollPercent >= milestone && !tracked.has(milestone)) {
                    tracked.add(milestone);
                    console.log(`Scroll depth: ${milestone}%`);
                    
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'scroll', {
                            'event_category': 'engagement',
                            'event_label': `${milestone}%`
                        });
                    }
                }
            });
        });
    }

    trackTimeOnPage() {
        const startTime = Date.now();

        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            console.log(`Time on page: ${timeSpent}s`);
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'timing_complete', {
                    'name': 'time_on_page',
                    'value': timeSpent,
                    'event_category': 'engagement'
                });
            }
        });
    }

    trackVideoPlays() {
        document.querySelectorAll('video').forEach(video => {
            video.addEventListener('play', function() {
                console.log('Video started');
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'video_start', {
                        'event_category': 'engagement'
                    });
                }
            });

            video.addEventListener('ended', function() {
                console.log('Video completed');
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'video_complete', {
                        'event_category': 'engagement'
                    });
                }
            });
        });
    }
}

// ==========================================
// 5. INITIALIZE ALL MODULES
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    new ScrollAnimations();
    new PerformanceOptimizer();
    new UXEnhancements();
    new AnalyticsTracker();

    console.log('✅ All advanced features initialized');
});

// ==========================================
// 6. PWA INSTALL PROMPT
// ==========================================

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent default prompt
    e.preventDefault();
    deferredPrompt = e;

    // Show custom install button
    const installBtn = document.createElement('button');
    installBtn.textContent = '📱 Инсталирай като приложение';
    installBtn.className = 'install-btn';
    installBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: linear-gradient(135deg, #00A8CC, #00D4FF);
        color: white;
        border: none;
        border-radius: 50px;
        font-weight: 700;
        box-shadow: 0 10px 30px rgba(0,168,204,0.3);
        cursor: pointer;
        z-index: 9998;
        animation: slideIn 0.5s ease;
    `;

    installBtn.addEventListener('click', async () => {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('PWA installed');
        }
        
        deferredPrompt = null;
        installBtn.remove();
    });

    document.body.appendChild(installBtn);

    // Auto-hide after 10 seconds
    setTimeout(() => {
        if (installBtn.parentNode) {
            installBtn.style.opacity = '0';
            setTimeout(() => installBtn.remove(), 300);
        }
    }, 10000);
});

// ==========================================
// 7. ERROR HANDLING & REPORTING
// ==========================================

window.addEventListener('error', (e) => {
    console.error('Error caught:', e.error);
    
    // Could send to error tracking service
    // Example: Sentry, LogRocket, etc.
});

// ==========================================
// 8. ONLINE/OFFLINE DETECTION
// ==========================================

function updateOnlineStatus() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 12px;
        font-weight: 600;
        z-index: 9999;
        animation: slideInRight 0.5s ease;
    `;

    if (navigator.onLine) {
        notification.style.background = 'rgba(46, 213, 115, 0.95)';
        notification.style.color = 'white';
        notification.textContent = '✓ Връзката е възстановена';
    } else {
        notification.style.background = 'rgba(255, 71, 87, 0.95)';
        notification.style.color = 'white';
        notification.textContent = '⚠ Няма интернет връзка';
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);