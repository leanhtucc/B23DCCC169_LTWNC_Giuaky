import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../hooks/useDebounce';

describe('useDebounce hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return initial value immediately before delay expires', () => {
    const { result } = renderHook(() => useDebounce('hello', 300));
    expect(result.current).toBe('hello');
  });

  it('should NOT update debounced value before delay expires', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    rerender({ value: 'updated', delay: 300 });

    // Chưa đủ 300ms — value vẫn là 'initial'
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe('initial');
  });

  it('should update debounced value after delay expires', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    rerender({ value: 'updated', delay: 300 });

    // Đủ 300ms — value phải cập nhật
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe('updated');
  });

  it('should work with generic type number', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: number }) => useDebounce<number>(value, 500),
      { initialProps: { value: 1 } }
    );

    rerender({ value: 42 });
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe(42);
  });
});
