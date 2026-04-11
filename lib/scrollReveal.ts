const DEFAULT_REVEAL_OFFSET = 0.92;

interface RevealObserverOptions extends IntersectionObserverInit {
  onReveal?: (element: HTMLElement) => void;
  revealOffset?: number;
}

export function shouldRevealEntry(
  entry: IntersectionObserverEntry,
  revealOffset = DEFAULT_REVEAL_OFFSET
) {
  return entry.isIntersecting || entry.boundingClientRect.top <= window.innerHeight * revealOffset;
}

export function createRevealObserver({
  onReveal,
  revealOffset = DEFAULT_REVEAL_OFFSET,
  threshold = 0,
  root = null,
  rootMargin = '0px',
}: RevealObserverOptions = {}) {
  return new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!shouldRevealEntry(entry, revealOffset)) return;

      const element = entry.target as HTMLElement;
      element.classList.add('revealed');
      onReveal?.(element);
      observer.unobserve(element);
    });
  }, { threshold, root, rootMargin });
}
