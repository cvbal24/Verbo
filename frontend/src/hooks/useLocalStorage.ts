"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Hook for persisting state in localStorage
 */
export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
    // Get stored value or use initial value
    const readValue = useCallback((): T => {
        if (typeof window === "undefined") {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    }, [initialValue, key]);

    const [storedValue, setStoredValue] = useState<T>(readValue);

    // Update state and localStorage
    const setValue = useCallback(
        (value: T | ((prev: T) => T)) => {
            if (typeof window === "undefined") {
                console.warn(
                    `Tried to set localStorage key "${key}" during SSR`
                );
                return;
            }

            try {
                const valueToStore =
                    value instanceof Function ? value(storedValue) : value;

                setStoredValue(valueToStore);
                window.localStorage.setItem(key, JSON.stringify(valueToStore));

                // Dispatch storage event for other tabs/windows
                window.dispatchEvent(
                    new StorageEvent("storage", {
                        key,
                        newValue: JSON.stringify(valueToStore),
                    })
                );
            } catch (error) {
                console.warn(`Error setting localStorage key "${key}":`, error);
            }
        },
        [key, storedValue]
    );

    // Remove from localStorage
    const removeValue = useCallback(() => {
        if (typeof window === "undefined") {
            return;
        }

        try {
            window.localStorage.removeItem(key);
            setStoredValue(initialValue);
        } catch (error) {
            console.warn(
                `Error removing localStorage key "${key}":`,
                error
            );
        }
    }, [key, initialValue]);

    // Listen for changes in other tabs/windows
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === key && event.newValue !== null) {
                try {
                    setStoredValue(JSON.parse(event.newValue));
                } catch {
                    setStoredValue(initialValue);
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [key, initialValue]);

    // Sync with localStorage on mount (for SSR hydration)
    useEffect(() => {
        setStoredValue(readValue());
    }, [readValue]);

    return [storedValue, setValue, removeValue];
}

/**
 * Hook for reading localStorage without reactivity
 */
export function useReadLocalStorage<T>(key: string): T | null {
    const [value, setValue] = useState<T | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        try {
            const item = window.localStorage.getItem(key);
            setValue(item ? JSON.parse(item) : null);
        } catch {
            setValue(null);
        }
    }, [key]);

    return value;
}
