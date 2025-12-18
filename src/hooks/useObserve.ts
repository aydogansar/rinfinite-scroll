import { useEffect, useRef } from "react";

export interface ObserveProps {
  onReach: () => void;
  disabled?: boolean;
}

function useObserve<T extends HTMLElement = HTMLElement>({
  onReach,
  disabled,
}: ObserveProps) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !disabled) {
        onReach();

        observer.unobserve(entries[0].target);
      }
    });
    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [onReach, disabled]);

  return {
    ref,
  };
}
export default useObserve;
