import { useEffect, useRef } from 'react';

/**
 * Infinite scrolling via IntersectionObserver.
 * Attach the returned ref to a "sentinel" element placed after the list;
 * `onLoadMore` fires when that element scrolls into view.
 *
 * `itemCount` is used to re-attach the observer after each page loads. That
 * matters when a page is short (e.g. heavily filtered results) and the sentinel
 * is still visible - re-observing fires the callback again immediately.
 */
export default function useInfiniteScroll(onLoadMore, { enabled = true, itemCount = 0, rootMargin = '600px' } = {}) {
  const sentinelRef = useRef(null);
  const callbackRef = useRef(onLoadMore);
  callbackRef.current = onLoadMore;

  useEffect(() => {
    const node = sentinelRef.current;
    if (!enabled || !node || !('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) callbackRef.current();
      },
      { rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, itemCount, rootMargin]);

  return sentinelRef;
}
