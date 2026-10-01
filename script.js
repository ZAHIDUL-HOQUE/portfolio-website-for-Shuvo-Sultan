document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('header');

    // Smooth scrolling — handles nav links + hero CTA + any anchor to #id
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                e.preventDefault();
                const headerOffset = header ? header.offsetHeight + 12 : 80;
                const top = targetSection.getBoundingClientRect().top + window.scrollY - headerOffset;
                window.scrollTo({ top, behavior: 'smooth' });
                // update URL without jump
                history.pushState(null, '', href);
            }
        });
    });

    // Header scroll effect — uses class toggle (CSS handles transition)
    if (header) {
        const onScroll = () => {
            if (window.scrollY > 100) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // Form submission — guard if form missing
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            // basic validation — browser already does required, but trim check
            const btn = form.querySelector('.submit-button');
            const origText = btn.textContent;
            btn.textContent = 'Message Sent!';
            btn.disabled = true;
            setTimeout(() => {
                btn.textContent = origText;
                btn.disabled = false;
                form.reset();
            }, 2000);
        });
    }

    // Works category filtering — 3 categories + All (randomized placeholders)
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterBtns.length && galleryItems.length) {
        // Keyboard navigation for tabs (arrow keys)
        const filtersContainer = document.querySelector('.gallery-filters');
        if (filtersContainer) {
            filtersContainer.addEventListener('keydown', (e) => {
                const current = document.activeElement;
                if (!current.classList.contains('filter-btn')) return;
                let idx = Array.from(filterBtns).indexOf(current);
                if (e.key === 'ArrowRight') idx = (idx + 1) % filterBtns.length;
                else if (e.key === 'ArrowLeft') idx = (idx - 1 + filterBtns.length) % filterBtns.length;
                else return;
                e.preventDefault();
                filterBtns[idx].focus();
                filterBtns[idx].click();
            });
        }

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;

                // update active state
                filterBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                    b.setAttribute('tabindex', '-1');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');
                btn.setAttribute('tabindex', '0');

                // filter items
                galleryItems.forEach(item => {
                    const cat = item.dataset.category;
                    const shouldShow = filter === 'all' || cat === filter;
                    if (shouldShow) {
                        item.classList.remove('hide');
                        // re-trigger animation — use rAF to avoid forced reflow thrash
                        item.classList.remove('filter-animate');
                        requestAnimationFrame(() => {
                            // double rAF ensures class re-add triggers animation
                            requestAnimationFrame(() => item.classList.add('filter-animate'));
                        });
                    } else {
                        item.classList.add('hide');
                        item.classList.remove('filter-animate');
                    }
                });
            });
        });

        // ensure first tab is focusable
        filterBtns.forEach((b, i) => b.setAttribute('tabindex', b.classList.contains('active') ? '0' : '-1'));
    }
});
