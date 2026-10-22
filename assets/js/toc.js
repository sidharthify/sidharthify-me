document.addEventListener('DOMContentLoaded', () => {
    const article = document.querySelector('article');
    if (!article) return;

    const tocContainer = document.querySelector('.toc');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior = reduceMotion ? 'instant' : 'smooth';
    const termBody = article.closest('.term-body');

    function scrollRoot() {
        if (!termBody) return null;
        const overflow = getComputedStyle(termBody).overflowY;
        return (overflow === 'auto' || overflow === 'scroll') && termBody.scrollHeight > termBody.clientHeight ? termBody : null;
    }

    function offset(root) {
        if (root) return 20;
        const panel = document.querySelector('.panel');
        return (panel ? panel.offsetHeight : 0) + 20;
    }

    function scrollToEl(target, smooth) {
        const root = scrollRoot();
        const b = smooth ? behavior : 'instant';
        if (root) {
            const top = target.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop - offset(root);
            root.scrollTo({ top, behavior: b });
        } else {
            const top = target.getBoundingClientRect().top + window.scrollY - offset(null);
            window.scrollTo({ top, behavior: b });
        }
    }

    const titleHeading = article.querySelector('header h1');
    const headings = Array.from(article.querySelectorAll('h1, h2, h3')).filter((h) => h !== titleHeading && !h.closest('header'));

    const slugify = (text) =>
        text.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'section';
    const taken = new Set(Array.from(document.querySelectorAll('[id]')).filter((el) => !headings.includes(el)).map((el) => el.id));

    headings.forEach((h) => {
        let id = h.id || slugify(h.textContent);
        if (taken.has(id)) {
            let n = 2;
            while (taken.has(`${id}-${n}`)) n++;
            id = `${id}-${n}`;
        }
        taken.add(id);
        h.id = id;

        const anchor = document.createElement('a');
        anchor.className = 'heading-anchor';
        anchor.href = `#${id}`;
        anchor.setAttribute('aria-label', `Link to section: ${h.textContent.trim()}`);
        anchor.textContent = '#';
        h.appendChild(anchor);
    });

    const headingText = (h) => Array.from(h.childNodes).filter((n) => !(n.classList && n.classList.contains('heading-anchor'))).map((n) => n.textContent).join('').trim();

    article.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        const target = document.getElementById(decodeURIComponent(link.getAttribute('href').slice(1)));
        if (!target) return;
        e.preventDefault();
        scrollToEl(target, true);
        history.replaceState(null, '', `#${target.id}`);
    });

    const progress = document.createElement('div');
    progress.className = 'read-progress';
    progress.setAttribute('aria-hidden', 'true');
    const titlebar = article.closest('.terminal') && article.closest('.terminal').querySelector('.term-titlebar');
    if (titlebar) titlebar.appendChild(progress);
    else document.body.appendChild(progress);

    const linksById = new Map();
    const groups = [];

    function buildList(collapsible) {
        const list = document.createElement('ul');
        list.className = 'toc-list';
        let currentGroup = null;
        const topLevel = headings.some((h) => h.tagName === 'H1') ? 'H1' : 'H2';

        headings.forEach((h) => {
            const li = document.createElement('li');
            li.className = `toc-item toc-${h.tagName.toLowerCase()}`;
            const link = document.createElement('a');
            link.href = `#${h.id}`;
            link.className = 'toc-link';
            link.textContent = headingText(h);
            link.dataset.target = h.id;
            li.appendChild(link);

            if (h.tagName === topLevel || !currentGroup) {
                list.appendChild(li);
                if (h.tagName === topLevel) {
                    const sub = document.createElement('div');
                    sub.className = 'toc-sub';
                    const inner = document.createElement('ul');
                    inner.className = 'toc-sub-inner';
                    sub.appendChild(inner);
                    li.appendChild(sub);
                    currentGroup = { li, sub, inner, ids: [h.id] };
                    if (collapsible) groups.push(currentGroup);
                }
            } else {
                currentGroup.inner.appendChild(li);
                currentGroup.ids.push(h.id);
            }

            if (!linksById.has(h.id)) linksById.set(h.id, []);
            linksById.get(h.id).push(link);

            link.addEventListener('click', (e) => {
                e.preventDefault();
                scrollToEl(h, true);
                history.replaceState(null, '', `#${h.id}`);
                const details = link.closest('details');
                if (details) details.open = false;
            });
        });

        list.querySelectorAll('.toc-sub').forEach((sub) => {
            if (!sub.querySelector('li')) sub.remove();
        });
        return list;
    }

    let tocNav = null;
    if (tocContainer && headings.length >= 2) {
        tocNav = document.createElement('nav');
        tocNav.className = 'toc-nav';
        tocNav.setAttribute('aria-label', 'Table of contents');
        const title = document.createElement('span');
        title.className = 'toc-title';
        title.textContent = 'Contents';
        tocNav.appendChild(title);
        const list = buildList(headings.length > 16);
        if (headings.length > 16) list.classList.add('is-collapsible');
        tocNav.appendChild(list);
        tocContainer.appendChild(tocNav);
    } else if (tocContainer) {
        tocContainer.style.display = 'none';
    }

    if (headings.length >= 4) {
        const header = article.querySelector('header');
        const details = document.createElement('details');
        details.className = 'toc-inline';
        const summary = document.createElement('summary');
        summary.textContent = 'Contents';
        details.appendChild(summary);
        details.appendChild(buildList(false));
        if (header) header.after(details);
        else article.prepend(details);
    }

    let activeId = null;

    function setActive(id) {
        if (id === activeId) return;
        activeId = id;
        linksById.forEach((links, key) => links.forEach((l) => {
            l.classList.toggle('active', key === id);
            if (key === id) l.setAttribute('aria-current', 'location');
            else l.removeAttribute('aria-current');
        }));
        groups.forEach((g) => g.li.classList.toggle('is-open', id !== null && g.ids.includes(id)));

        if (!tocNav || !id) return;
        const link = tocNav.querySelector(`.toc-link[data-target="${CSS.escape(id)}"]`);
        if (!link) return;
        window.requestAnimationFrame(() => {
            const top = link.offsetTop;
            const view = tocNav.clientHeight;
            if (top < tocNav.scrollTop + 48 || top > tocNav.scrollTop + view - 64) {
                tocNav.scrollTo({ top: Math.max(0, top - view / 3), behavior });
            }
        });
    }

    let ticking = false;
    function update() {
        ticking = false;
        const root = scrollRoot();
        const line = (root ? root.getBoundingClientRect().top : 0) + offset(root) + 24;
        let current = null;
        for (const h of headings) {
            if (h.getBoundingClientRect().top <= line) current = h;
            else break;
        }
        const scroller = root || document.scrollingElement;
        const atBottom = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight < 4;
        const last = headings[headings.length - 1];
        if (atBottom && last && last.getBoundingClientRect().top < (root ? root.getBoundingClientRect().bottom : window.innerHeight)) {
            current = last;
        }
        setActive(current ? current.id : null);

        const rect = article.getBoundingClientRect();
        const viewTop = root ? root.getBoundingClientRect().top : 0;
        const viewHeight = root ? root.clientHeight : window.innerHeight;
        const total = rect.height - viewHeight;
        const done = total > 0 ? Math.min(1, Math.max(0, (viewTop - rect.top) / total)) : 1;
        progress.style.transform = `scaleX(${done})`;
    }

    function onScroll() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    if (termBody) termBody.addEventListener('scroll', onScroll, { passive: true });
    update();

    const posts = window.SITE && window.SITE.posts;
    const match = location.pathname.match(/\/blogs\/([^/]+)\/?/);
    if (posts && match) {
        const i = posts.findIndex((p) => p.dir === match[1]);
        if (i !== -1) {
            const nav = document.createElement('nav');
            nav.className = 'post-nav';
            nav.setAttribute('aria-label', 'More posts');
            const make = (post, label, cls) => {
                const a = document.createElement('a');
                a.className = `post-nav-link ${cls}`;
                a.href = `../${post.dir}/`;
                const l = document.createElement('span');
                l.className = 'post-nav-label';
                l.textContent = label;
                const t = document.createElement('span');
                t.className = 'post-nav-title';
                t.textContent = post.title;
                a.append(l, t);
                return a;
            };
            if (posts[i + 1]) nav.appendChild(make(posts[i + 1], '← older', 'is-older'));
            if (posts[i - 1]) nav.appendChild(make(posts[i - 1], 'newer →', 'is-newer'));
            const all = document.createElement('a');
            all.className = 'post-nav-all';
            all.href = '../';
            all.textContent = 'all posts';
            article.append(nav, all);
        }
    }

    if (window.location.hash) {
        const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
        if (target) {
            setTimeout(() => scrollToEl(target, false), 60);
            window.addEventListener('load', () => scrollToEl(target, false), { once: true });
        }
    }
});
