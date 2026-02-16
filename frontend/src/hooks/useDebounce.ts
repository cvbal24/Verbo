"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Debounce a value - returns the value after the specified delay
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
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

/**
 * Returns a debounced callback function
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
    callback: T,
    delay: number = 300
): T {
    const callbackRef = useRef(callback);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Update callback ref on every render
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const debouncedCallback = useCallback(
        (...args: Parameters<T>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callbackRef.current(...args);
            }, delay);
        },
        [delay]
    ) as T;

    return debouncedCallback;
}

/**
 * Debounce with immediate option - calls immediately on first trigger
 */
export function useDebouncedValue<T>(
    value: T,
    delay: number = 300,
    options: { leading?: boolean } = {}
): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (options.leading && isFirstRender.current) {
            isFirstRender.current = false;
            setDebouncedValue(value);
            return;
        }

        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay, options.leading]);

    return debouncedValue;
}
