/* Portfolio interactions: animated cursor, scroll reveal, mobile menu, nav state */
(function () {
    'use strict';

    /* ---------------- Animated cursor ---------------- */
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (finePointer) {
        const dot = document.querySelector('.cursor-dot');
        const ring = document.querySelector('.cursor-ring');

        if (dot && ring) {
            let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
            let ringX = mouseX, ringY = mouseY;

            window.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                // Dot tracks the pointer instantly
                dot.style.left = mouseX + 'px';
                dot.style.top = mouseY + 'px';
            });

            // Ring follows with smooth easing (the "trailing" animation)
            const animate = () => {
                ringX += (mouseX - ringX) * 0.18;
                ringY += (mouseY - ringY) * 0.18;
                ring.style.left = ringX + 'px';
                ring.style.top = ringY + 'px';
                requestAnimationFrame(animate);
            };
            animate();

            // Grow ring over interactive elements
            const interactive = 'a, button, input, textarea, select, label, [role="button"]';
            document.addEventListener('mouseover', (e) => {
                if (e.target.closest(interactive)) ring.classList.add('is-hovering');
            });
            document.addEventListener('mouseout', (e) => {
                if (e.target.closest(interactive)) ring.classList.remove('is-hovering');
            });
            document.addEventListener('mousedown', () => ring.classList.add('is-down'));
            document.addEventListener('mouseup', () => ring.classList.remove('is-down'));

            // Hide when the cursor leaves the window
            document.addEventListener('mouseleave', () => {
                dot.style.opacity = ring.style.opacity = '0';
            });
            document.addEventListener('mouseenter', () => {
                dot.style.opacity = ring.style.opacity = '1';
            });
        }
    }

    /* ---------------- Scroll reveal ---------------- */
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealEls.length) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach((el) => io.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add('visible'));
    }

    /* ---------------- Mobile menu ---------------- */
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('mobile-menu');
    if (toggle && menu) {
        const setOpen = (open) => {
            menu.classList.toggle('hidden', !open);
            menu.classList.toggle('flex', open);
        };
        toggle.addEventListener('click', () => setOpen(menu.classList.contains('hidden')));
        menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
    }

    /* ---------------- Navbar shadow on scroll ---------------- */
    const nav = document.getElementById('site-nav');
    if (nav) {
        const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ---------------- Back to top button ---------------- */
    const toTop = document.getElementById('back-to-top');
    if (toTop) {
        // The actual scroll is handled natively by the anchor href="#hero"
        // plus CSS scroll-behavior:smooth — this only shows/hides the button.
        const toggleTop = () => toTop.classList.toggle('is-visible', window.scrollY > 300);
        toggleTop();
        window.addEventListener('scroll', toggleTop, { passive: true });
    }

    /* ---------------- Typewriter (cycling roles) ---------------- */
    const typed = document.getElementById('typed-role');
    if (typed && typed.dataset.roles) {
        const roles = typed.dataset.roles.split(',').map((r) => r.trim()).filter(Boolean);
        if (roles.length) {
            let ri = 0, ci = 0, deleting = false;
            typed.textContent = '';
            const tick = () => {
                const word = roles[ri];
                typed.textContent = word.slice(0, ci);
                if (!deleting) {
                    if (ci < word.length) { ci++; setTimeout(tick, 90); }
                    else { deleting = true; setTimeout(tick, 1600); }      // pause at full word
                } else {
                    if (ci > 0) { ci--; setTimeout(tick, 45); }
                    else { deleting = false; ri = (ri + 1) % roles.length; setTimeout(tick, 350); }
                }
            };
            setTimeout(tick, 600);
        }
    }

    /* ---------------- Animated stat counters ---------------- */
    const counters = document.querySelectorAll('.stat-count');
    if (counters.length && 'IntersectionObserver' in window) {
        const runCount = (el) => {
            const target = parseInt(el.dataset.target, 10) || 0;
            const duration = 1400;
            const start = performance.now();
            const step = (now) => {
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3);          // ease-out
                el.textContent = Math.round(eased * target);
                if (p < 1) requestAnimationFrame(step);
                else el.textContent = target;
            };
            requestAnimationFrame(step);
        };
        const cObs = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) { runCount(e.target); cObs.unobserve(e.target); }
            });
        }, { threshold: 0.5 });
        counters.forEach((c) => cObs.observe(c));
    } else {
        counters.forEach((c) => { c.textContent = c.dataset.target; });
    }
})();
