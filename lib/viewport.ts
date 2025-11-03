/**
 * Viewport/visibility detection utilities for lazy-loading components
 */

/**
 * Hook to detect when an element becomes visible in the viewport
 * Used for lazy-mounting interactive components like plots
 */
export function useIntersectionObserver(
  callback: (isVisible: boolean) => void,
  options: IntersectionObserverInit = {}
): (element: HTMLElement | null) => void {
  const defaultOptions: IntersectionObserverInit = {
    threshold: 0.1,
    ...options,
  };

  let observer: IntersectionObserver | null = null;

  const setElement = (element: HTMLElement | null) => {
    // Clean up previous observer
    if (observer) {
      observer.disconnect();
      observer = null;
    }

    // Set up new observer if element exists
    if (element) {
      observer = new IntersectionObserver(([entry]) => {
        callback(entry.isIntersecting);
      }, defaultOptions);

      observer.observe(element);
    }
  };

  return setElement;
}

/**
 * Check if an element is currently visible in the viewport
 * Useful for immediate visibility checks
 */
export function isElementVisible(element: HTMLElement | null): boolean {
  if (!element) return false;

  const rect = element.getBoundingClientRect();
  return (
    rect.top < window.innerHeight &&
    rect.bottom > 0 &&
    rect.left < window.innerWidth &&
    rect.right > 0
  );
}

/**
 * Get viewport dimensions
 */
export function getViewportSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

/**
 * Check if viewport is mobile-sized
 */
export function isMobileViewport(): boolean {
  return getViewportSize().width < 768;
}
