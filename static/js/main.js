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
})();
