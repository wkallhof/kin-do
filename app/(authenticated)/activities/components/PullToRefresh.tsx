import { useCallback, useEffect, useState, useRef } from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface PullToRefreshProps {
  onRefresh: () => void;
  isLoading: boolean;
  children: React.ReactNode;
}

export function PullToRefresh({ onRefresh, isLoading, children }: PullToRefreshProps) {
  const [startY, setStartY] = useState(0);
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const threshold = 80; // Distance in pixels needed to trigger refresh

  const handleTouchStart = useCallback((e: TouchEvent) => {
    // Only enable pull-to-refresh when at the top of the page
    // and the touch started within our component
    if (window.scrollY === 0 && containerRef.current?.contains(e.target as Node)) {
      setStartY(e.touches[0].clientY);
      setPulling(true);
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!pulling || isLoading) return;

    // Only handle touch move if it's within our component
    if (!containerRef.current?.contains(e.target as Node)) {
      setPulling(false);
      setPullDistance(0);
      return;
    }

    const y = e.touches[0].clientY;
    const distance = Math.max(0, y - startY);
    
    // Apply resistance to make the pull feel more natural
    const resistance = 0.4;
    setPullDistance(distance * resistance);

    // Prevent default scrolling while pulling
    if (distance > 0 && window.scrollY === 0) {
      e.preventDefault();
    }
  }, [pulling, startY, isLoading]);

  const handleTouchEnd = useCallback(() => {
    if (!pulling) return;

    if (pullDistance >= threshold && !isLoading) {
      onRefresh();
    }

    setPulling(false);
    setPullDistance(0);
  }, [pulling, pullDistance, threshold, onRefresh, isLoading]);

  useEffect(() => {
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <div ref={containerRef} className="relative">
      {/* Pull indicator */}
      <div
        className={cn(
          "absolute left-0 right-0 flex items-center justify-center transition-transform duration-200 ease-out",
          (pulling && pullDistance > 0) || isLoading ? "opacity-100" : "opacity-0"
        )}
        style={{
          transform: `translateY(${Math.min(pullDistance - 20, threshold)}px)`,
        }}
      >
        <RefreshCw
          className={cn(
            "h-6 w-6 transition-transform",
            isLoading && "animate-spin",
            !isLoading && pulling && pullDistance > 0 && "rotate-180"
          )}
          style={{
            transform: `rotate(${(pullDistance / threshold) * 180}deg)`,
          }}
        />
      </div>

      {/* Content */}
      <div
        className="transition-transform duration-200 ease-out will-change-transform"
        style={{
          transform: pulling ? `translateY(${pullDistance}px)` : "none",
        }}
      >
        {children}
      </div>
    </div>
  );
} 