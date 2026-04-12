const navs = document.querySelectorAll<HTMLElement>('[data-priority-nav]');
const menuAnimations = new WeakMap<HTMLDetailsElement, Animation>();
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function numericGap(element: HTMLElement): number {
  // Flex gaps contribute to the total row width, but they are not included in
  // individual link offsetWidth values.
  const styles = getComputedStyle(element);
  return Number.parseFloat(styles.columnGap || styles.gap || '0') || 0;
}

function updatePriorityNav(nav: HTMLElement) {
  const links = [...nav.querySelectorAll<HTMLAnchorElement>('[data-priority-link]')];
  const more = nav.querySelector<HTMLDetailsElement>('[data-priority-more]');
  const menuLinks = [...nav.querySelectorAll<HTMLAnchorElement>('[data-priority-menu-link]')];

  if (!links.length || !more || menuLinks.length !== links.length) {
    return;
  }

  // Measure from a clean slate. All primary links need to be visible so their
  // actual rendered widths reflect the current font, viewport, and zoom level.
  links.forEach((link) => {
    link.hidden = false;
  });
  menuLinks.forEach((link) => {
    link.hidden = true;
  });
  more.hidden = true;
  more.open = false;

  const gap = numericGap(nav);
  const linkWidths = links.map((link) => link.offsetWidth);
  const allLinksWidth = linkWidths.reduce((sum, width) => sum + width, 0) + gap * Math.max(links.length - 1, 0);

  // Fast path: if every link fits, do not reserve space for the overflow menu.
  if (allLinksWidth <= nav.clientWidth) {
    return;
  }

  // Once overflow is needed, the More control itself consumes width. Reserve
  // that width first, then keep links in priority order until the row is full.
  more.hidden = false;
  const moreWidth = more.offsetWidth;
  const availableWidth = Math.max(nav.clientWidth - moreWidth - gap, 0);

  let usedWidth = 0;
  let visibleCount = 0;

  for (const width of linkWidths) {
    const nextWidth = usedWidth + width + (visibleCount > 0 ? gap : 0);
    if (nextWidth > availableWidth) {
      break;
    }

    usedWidth = nextWidth;
    visibleCount += 1;
  }

  links.forEach((link, index) => {
    link.hidden = index >= visibleCount;
  });
  menuLinks.forEach((link, index) => {
    link.hidden = index < visibleCount;
  });
}

function scheduleUpdate(nav: HTMLElement) {
  // Defer measurement until after layout has settled for this frame.
  requestAnimationFrame(() => updatePriorityNav(nav));
}

function menuFor(more: HTMLDetailsElement): HTMLElement | null {
  return more.querySelector<HTMLElement>('[data-priority-menu]');
}

function cancelMenuAnimation(more: HTMLDetailsElement) {
  // Avoid competing animations if someone taps repeatedly while the menu is
  // still opening or closing.
  menuAnimations.get(more)?.cancel();
  menuAnimations.delete(more);
}

function openMenu(more: HTMLDetailsElement) {
  cancelMenuAnimation(more);
  more.open = true;

  const menu = menuFor(more);
  if (!menu || prefersReducedMotion.matches) {
    return;
  }

  // Keep the motion small and physical: a slight drop, scale, and fade without
  // adding a glass/blur treatment.
  const animation = menu.animate(
    [
      { opacity: 0, transform: 'translateY(-8px) scale(0.96)' },
      { opacity: 1, transform: 'translateY(0) scale(1)' }
    ],
    { duration: 180, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', fill: 'both' }
  );
  menuAnimations.set(more, animation);
  animation.addEventListener('finish', () => menuAnimations.delete(more), { once: true });
}

function closeMenu(more: HTMLDetailsElement) {
  cancelMenuAnimation(more);

  const menu = menuFor(more);
  if (!more.open || !menu || prefersReducedMotion.matches) {
    more.open = false;
    return;
  }

  const animation = menu.animate(
    [
      { opacity: 1, transform: 'translateY(0) scale(1)' },
      { opacity: 0, transform: 'translateY(-8px) scale(0.96)' }
    ],
    { duration: 140, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'both' }
  );
  menuAnimations.set(more, animation);
  animation.addEventListener(
    'finish',
    () => {
      more.open = false;
      menuAnimations.delete(more);
    },
    { once: true }
  );
}

navs.forEach((nav) => {
  scheduleUpdate(nav);
  // Recompute whenever the header changes size, including orientation changes
  // and mobile browser chrome resizing.
  new ResizeObserver(() => scheduleUpdate(nav)).observe(nav);

  // Native <details> toggles instantly. Prevent the default toggle so the menu
  // can animate closed before removing the open state.
  nav.querySelector<HTMLDetailsElement>('[data-priority-more] summary')?.addEventListener('click', (event) => {
    event.preventDefault();
    const more = event.currentTarget instanceof HTMLElement
      ? event.currentTarget.closest<HTMLDetailsElement>('[data-priority-more]')
      : null;

    if (!more) {
      return;
    }

    if (more.open) {
      closeMenu(more);
    } else {
      openMenu(more);
    }
  });
});

document.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Node)) {
    return;
  }

  navs.forEach((nav) => {
    if (!nav.contains(target)) {
      const more = nav.querySelector<HTMLDetailsElement>('[data-priority-more]');
      if (more) {
        closeMenu(more);
      }
    }
  });
});

if ('fonts' in document) {
  // Webfont swaps can change link widths after the first layout pass.
  document.fonts.ready.then(() => {
    navs.forEach((nav) => scheduleUpdate(nav));
  });
}
