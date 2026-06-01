/* Interactivity Script for Double V Contracting - Premium General Contractor Website */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Light/Dark Theme Switcher State Management
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = themeToggleBtn.querySelector('.material-symbols-outlined');
    
    // Check local storage or browser preference
    const storedTheme = localStorage.getItem('double-v-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme === 'dark' || (!storedTheme && systemPrefersDark)) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
    
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    });
    
    function setTheme(theme) {
        const headerLogo = document.getElementById('header-logo');
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('double-v-theme', 'dark');
            themeIcon.textContent = 'light_mode'; // icon to switch back to light
            if (headerLogo) headerLogo.src = 'assets/logo_dark.png?v=2';
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('double-v-theme', 'light');
            themeIcon.textContent = 'dark_mode'; // icon to switch back to dark
            if (headerLogo) headerLogo.src = 'assets/logo_light.png?v=2';
        }
        
        // Trigger a custom event to notify other scripts of theme changes if needed
        window.dispatchEvent(new CustomEvent('themechanged', { detail: { theme } }));
    }

    // ==========================================
    // 2. Interactive Navigation Scroll Effect
    // ==========================================
    const mainNav = document.getElementById('main-nav');
    const scrollProgress = document.getElementById('scroll-progress');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Navbar size compression
        if (scrollY > 50) {
            mainNav.classList.add('shadow-md', 'h-16');
            mainNav.classList.remove('h-20');
        } else {
            mainNav.classList.remove('shadow-md', 'h-16');
            mainNav.classList.add('h-20');
        }
        
        // Dynamic top scroll progress bar
        if (documentHeight > 0) {
            const pct = (scrollY / documentHeight) * 100;
            scrollProgress.style.width = `${pct}%`;
        }
    });

    // Mobile Hamburger Menu Overlay
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    
    menuToggle.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.contains('hidden');
        if (isHidden) {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('flex');
            menuToggle.querySelector('span').textContent = 'close';
        } else {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex');
            menuToggle.querySelector('span').textContent = 'menu';
        }
    });

    // Close menu when a link is clicked
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex');
            menuToggle.querySelector('span').textContent = 'menu';
        });
    });

    // ==========================================
    // 3. Subtle Parallax Cursor Tracking
    // ==========================================
    const heroSection = document.getElementById('hero');
    const heroBg = document.getElementById('hero-bg-img');
    const heroPanel = document.getElementById('hero-panel');
    
    if (window.innerWidth > 768) {
        heroSection.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.012;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.012;
            
            heroBg.style.transform = `scale(1.06) translate(${moveX}px, ${moveY}px)`;
            heroPanel.style.transform = `translate(${-moveX * 0.5}px, ${-moveY * 0.5}px)`;
        });
    }

    // ==========================================
    // 4. Scroll Reveal Intersection Observer
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-left, .reveal-right');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================
    // 5. Scroll-triggered Stats Counting Animation
    // ==========================================
    const statsSection = document.getElementById('stats');
    const statsElements = document.querySelectorAll('.stat-counter');
    let countersTriggered = false;
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersTriggered) {
                countersTriggered = true;
                statsElements.forEach(animateCounter);
            }
        });
    }, { threshold: 0.5 });
    
    if (statsSection) statsObserver.observe(statsSection);
    
    function animateCounter(counterEl) {
        const target = parseFloat(counterEl.getAttribute('data-target'));
        const isDecimal = target % 1 !== 0;
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Cubic-bezier ease-out curve proxy
            const easeProgress = 1 - Math.pow(1 - progress, 3); 
            const currentValue = easeProgress * target;
            
            if (isDecimal) {
                counterEl.textContent = currentValue.toFixed(1);
            } else {
                counterEl.textContent = Math.floor(currentValue);
            }
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counterEl.textContent = target; // Ensure exact final value
            }
        }
        requestAnimationFrame(update);
    }

    // ==========================================
    // 6. Bento Card 3D Tilt Effect
    // ==========================================
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    if (window.innerWidth > 1024) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; // x position inside element
                const y = e.clientY - rect.top;  // y position inside element
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((centerY - y) / centerY) * 5; // Max 5 deg tilt
                const rotateY = ((x - centerX) / centerX) * 5;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            });
        });
    }

    // ==========================================
    // 7. Dynamic Project Estimator Logic
    // ==========================================
    const estimatorType = document.getElementById('est-type');
    const estimatorArea = document.getElementById('est-area');
    const estimatorAreaValue = document.getElementById('est-area-value');
    const estimatorFinish = document.getElementById('est-finish');
    
    const minResult = document.getElementById('est-result-min');
    const maxResult = document.getElementById('est-result-max');
    
    // Sliders interactive text
    estimatorArea.addEventListener('input', (e) => {
        estimatorAreaValue.textContent = e.target.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        calculateEstimate();
    });
    
    estimatorType.addEventListener('change', calculateEstimate);
    estimatorFinish.addEventListener('change', calculateEstimate);
    
    function calculateEstimate() {
        const type = estimatorType.value;
        const size = parseInt(estimatorArea.value);
        const finish = estimatorFinish.value;
        
        // Square foot multipliers based on metropolitan masterpiece values
        let baseCostPerSqFt = 150;
        switch (type) {
            case 'gut':
                baseCostPerSqFt = 280;
                break;
            case 'brownstone':
                baseCostPerSqFt = 350;
                break;
            case 'commercial':
                baseCostPerSqFt = 200;
                break;
            case 'millwork':
                baseCostPerSqFt = 120;
                break;
        }
        
        let finishMultiplier = 1.0;
        switch (finish) {
            case 'premium':
                finishMultiplier = 1.0;
                break;
            case 'ultra':
                finishMultiplier = 1.45;
                break;
            case 'legacy':
                finishMultiplier = 2.1;
                break;
        }
        
        const calculatedCost = size * baseCostPerSqFt * finishMultiplier;
        
        // Spread range (+/- 10%)
        const minCost = Math.round((calculatedCost * 0.9) / 5000) * 5000;
        const maxCost = Math.round((calculatedCost * 1.1) / 5000) * 5000;
        
        // Animate counter for output values
        animateValCounter(minResult, minCost);
        animateValCounter(maxResult, maxCost);
    }
    
    function animateValCounter(element, targetVal) {
        const currentVal = parseInt(element.textContent.replace(/[$,]/g, '')) || 0;
        const duration = 800; // 0.8 seconds quick counter
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            const currentValue = currentVal + (easeProgress * (targetVal - currentVal));
            
            element.textContent = '$' + Math.floor(currentValue).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = '$' + targetVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        }
        requestAnimationFrame(update);
    }
    
    // Initial run
    calculateEstimate();

    // ==========================================
    // 8. Vertical Process Scroll Progress Timeline Tracker
    // ==========================================
    const timelineProgress = document.getElementById('timeline-progress');
    const timelineSteps = document.querySelectorAll('.timeline-step');
    
    window.addEventListener('scroll', () => {
        if (!timelineSteps.length || !timelineProgress) return;
        
        const timelineBox = document.querySelector('.timeline-container');
        const rect = timelineBox.getBoundingClientRect();
        
        // Compute how far down the timeline box the screen is scrolled
        const totalHeight = rect.height;
        const topOffset = rect.top; // Relative to viewport top
        
        // Screen scroll cursor point: centered in the viewport
        const triggerPoint = window.innerHeight * 0.45;
        
        let progressPct = 0;
        if (topOffset < triggerPoint) {
            const elapsed = triggerPoint - topOffset;
            progressPct = Math.min((elapsed / totalHeight) * 100, 100);
        }
        
        timelineProgress.style.height = `${progressPct}%`;
        
        // Highlight corresponding steps
        timelineSteps.forEach((step, idx) => {
            const stepRect = step.getBoundingClientRect();
            if (stepRect.top < triggerPoint + 80) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    });

    // ==========================================
    // 9. Bento Detail Drawer Drawer
    // ==========================================
    const serviceDrawer = document.getElementById('service-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const drawerCloseBtn = document.getElementById('drawer-close-btn');
    const drawerDetails = document.querySelectorAll('.service-card-trigger');
    
    const drawerTitle = document.getElementById('drawer-title');
    const drawerDesc = document.getElementById('drawer-desc');
    const drawerDeliverables = document.getElementById('drawer-deliverables');
    const drawerCompliance = document.getElementById('drawer-compliance');
    const drawerImage = document.getElementById('drawer-img');
    
    // Service data profiles
    const serviceData = {
        gut: {
            title: "Residential Gut Renovations",
            desc: "A complete reconstruction process designed for co-ops, condominiums, and historic luxury high-rises in New York City. We manage the spatial redistribution of rooms, replacement of mechanical and structural framing, utility upgrades, and installation of premium luxury surface designs.",
            compliance: "Board Alteration Agreement checks, building security insurances, DOB standard filings, LPC reviews (if designated), asbestos surveys, and dust mitigation compliance.",
            deliverables: [
                "Full architectural and load calculations",
                "Advanced spatial floor plan re-designing",
                "Dual-duct HVAC climate zone setups",
                "Italian marble and bookmatched countertop overlays",
                "Integrated automated smart house systems"
            ],
            image: "assets/brownstone.png"
        },
        brownstone: {
            title: "Historic Brownstone Restoration",
            desc: "Expert preservation of historic architectural profiles integrated with ultra-modern infrastructural utilities. Our artisan teams specialize in the replication and restoration of century-old mahogany moldings, plaster crowns, and structural brownstone facades.",
            compliance: "Strict LPC (Landmarks Preservation Commission) certifications, specialized historic brick DOB waivers, structural stabilization requirements, and neighborhood landmark protections.",
            deliverables: [
                "Detailed historical plaster detail casting",
                "Hand-finished walnut structural woodwork",
                "Facade stone tooling and masonry preservation",
                "Modern structural floor leveling and truss reinforcement",
                "Multi-level climate zoning integration"
            ],
            image: "assets/masonry.png"
        },
        commercial: {
            title: "Commercial & Retail Fit-Outs",
            desc: "High-end corporate environments, corporate flagships, and upscale dining interiors that project instant brand authority and architectural stability. Optimized for strict deadlines, heavy footfall durability, and pristine minimalism.",
            compliance: "ADA (Americans with Disabilities Act) accessibility integration, public assembly certifications, commercial zoning compliance, high-load MEP engineering approvals.",
            deliverables: [
                "Industrial-grade acoustic insulation solutions",
                "Custom glass structural panelings",
                "Heavy-traffic custom flooring structures",
                "Bespoke commercial lighting systems",
                "Comprehensive HVAC zoning for public spaces"
            ],
            image: "assets/commercial.png"
        },
        millwork: {
            title: "Bespoke Millwork & Masonry",
            desc: "Artisanal details that define the elite NYC residence. Crafted within our state-of-the-art Brooklyn workshop, we construct high-end custom cabinetry, hidden built-in storage panels, and expert stone installations that feel integrated into the architectural legacy.",
            compliance: "Fire-rated wood certifications (Class A), co-op weight restriction reviews, wet-over-dry co-op guidelines compliance.",
            deliverables: [
                "Bespoke walk-in wardrobe architectures",
                "Hidden flush doors and custom panels",
                "Custom-crafted stone fireplace surrounds",
                "Veneer grain matching (bookmatched cabinetry)",
                "Solid timber outdoor custom decks"
            ],
            image: "assets/logo.png"
        }
    };
    
    drawerDetails.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceKey = trigger.getAttribute('data-service');
            const data = serviceData[serviceKey];
            
            if (data) {
                // Populate details
                drawerTitle.textContent = data.title;
                drawerDesc.textContent = data.desc;
                drawerCompliance.textContent = data.compliance;
                drawerImage.src = data.image;
                
                // Populate deliverables
                drawerDeliverables.innerHTML = '';
                data.deliverables.forEach(item => {
                    const li = document.createElement('li');
                    li.className = 'flex items-center gap-3 font-body-md text-body-md text-text-secondary';
                    li.innerHTML = `<span class="material-symbols-outlined text-accent text-sm" style="font-variation-settings: 'FILL' 1;">check_circle</span> <span>${item}</span>`;
                    drawerDeliverables.appendChild(li);
                });
                
                // Open drawer
                serviceDrawer.classList.add('open');
                drawerOverlay.classList.add('active');
                document.body.classList.add('overflow-hidden');
            }
        });
    });
    
    function closeDrawer() {
        serviceDrawer.classList.remove('open');
        drawerOverlay.classList.remove('active');
        document.body.classList.remove('overflow-hidden');
    }
    
    drawerCloseBtn.addEventListener('click', closeDrawer);
    drawerOverlay.addEventListener('click', closeDrawer);

    // ==========================================
    // 10. Filterable Luxury Portfolio Grid
    // ==========================================
    const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active style from all buttons
            filterBtns.forEach(b => {
                b.classList.remove('bg-charcoal-slate', 'text-warm-white', 'bg-accent', 'text-ink-black');
                b.classList.add('bg-surface-container', 'text-on-surface-variant');
            });
            
            // Add active style to current button based on theme
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (isDark) {
                btn.classList.add('bg-accent', 'text-ink-black');
            } else {
                btn.classList.add('bg-charcoal-slate', 'text-warm-white');
            }
            btn.classList.remove('bg-surface-container', 'text-on-surface-variant');
            
            const filterValue = btn.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                const categories = item.getAttribute('data-categories').split(' ');
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    item.classList.remove('hidden');
                    // smooth fade in animation trigger
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 400);
                }
            });
        });
    });

    // ==========================================
    // 11. Testimonial Slider Carousel
    // ==========================================
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('test-prev-btn');
    const nextBtn = document.getElementById('test-next-btn');
    let currentSlideIdx = 0;
    
    function showSlide(index) {
        testimonialSlides.forEach(slide => slide.classList.remove('active'));
        
        currentSlideIdx = (index + testimonialSlides.length) % testimonialSlides.length;
        testimonialSlides[currentSlideIdx].classList.add('active');
    }
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            showSlide(currentSlideIdx - 1);
        });
        
        nextBtn.addEventListener('click', () => {
            showSlide(currentSlideIdx + 1);
        });
    }

    // ==========================================
    // 12. FAQ Accordion Click Logics
    // ==========================================
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const trigger = item.querySelector('.accordion-trigger');
        trigger.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Collapse all
            accordionItems.forEach(i => i.classList.remove('active'));
            
            // Expand current if it wasn't already active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ==========================================
    // 13. Consultation Booking Submission & Success Modal
    // ==========================================
    const contactForm = document.getElementById('consultation-form');
    const submissionModal = document.getElementById('success-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic validation
            const nameInput = contactForm.querySelector('input[type="text"]');
            const emailInput = contactForm.querySelector('input[type="email"]');
            
            if (nameInput.value.trim() === '' || emailInput.value.trim() === '') {
                alert('Please enter your name and email address.');
                return;
            }
            
            // Add loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="inline-block animate-spin mr-2">✦</span> Customizing details...`;
            
            setTimeout(() => {
                // Success trigger
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                
                // Show modal
                submissionModal.classList.remove('hidden');
                submissionModal.classList.add('flex');
                
                // Reset form
                contactForm.reset();
                calculateEstimate(); // reset estimator ranges
            }, 1800);
        });
    }
    
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            submissionModal.classList.remove('flex');
            submissionModal.classList.add('hidden');
        });
    }
});
