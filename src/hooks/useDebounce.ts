import { useState, useEffect } from 'react';

/**
 * Generic debounce hook — trì hoãn cập nhật value sau `delay` ms.
 * @param value - giá trị cần debounce
 * @param delay - thời gian trì hoãn (ms)
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
