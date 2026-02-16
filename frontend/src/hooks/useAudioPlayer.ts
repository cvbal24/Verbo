"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface UseAudioPlayerOptions {
    onEnd?: () => void;
    onError?: (error: Error) => void;
    autoPlay?: boolean;
}

interface AudioPlayerState {
    isPlaying: boolean;
    isLoading: boolean;
    error: Error | null;
    duration: number;
    currentTime: number;
}

/**
 * Hook for playing audio files (pronunciation, etc.)
 */
export function useAudioPlayer(options: UseAudioPlayerOptions = {}) {
    const { onEnd, onError, autoPlay = false } = options;

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [state, setState] = useState<AudioPlayerState>({
        isPlaying: false,
        isLoading: false,
        error: null,
        duration: 0,
        currentTime: 0,
    });

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const play = useCallback(
        async (src: string) => {
            // Stop any currently playing audio
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }

            setState((prev) => ({
                ...prev,
                isLoading: true,
                error: null,
            }));

            try {
                const audio = new Audio(src);
                audioRef.current = audio;

                // Set up event listeners
                audio.addEventListener("loadedmetadata", () => {
                    setState((prev) => ({
                        ...prev,
                        duration: audio.duration,
                    }));
                });

                audio.addEventListener("timeupdate", () => {
                    setState((prev) => ({
                        ...prev,
                        currentTime: audio.currentTime,
                    }));
                });

                audio.addEventListener("ended", () => {
                    setState((prev) => ({
                        ...prev,
                        isPlaying: false,
                        currentTime: 0,
                    }));
                    onEnd?.();
                });

                audio.addEventListener("error", () => {
                    const error = new Error("Failed to load audio");
                    setState((prev) => ({
                        ...prev,
                        isPlaying: false,
                        isLoading: false,
                        error,
                    }));
                    onError?.(error);
                });

                audio.addEventListener("canplaythrough", () => {
                    setState((prev) => ({
                        ...prev,
                        isLoading: false,
                    }));
                });

                await audio.play();
                setState((prev) => ({
                    ...prev,
                    isPlaying: true,
                    isLoading: false,
                }));
            } catch (err) {
                const error =
                    err instanceof Error
                        ? err
                        : new Error("Failed to play audio");
                setState((prev) => ({
                    ...prev,
                    isPlaying: false,
                    isLoading: false,
                    error,
                }));
                onError?.(error);
            }
        },
        [onEnd, onError]
    );

    const pause = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            setState((prev) => ({
                ...prev,
                isPlaying: false,
            }));
        }
    }, []);

    const resume = useCallback(async () => {
        if (audioRef.current) {
            try {
                await audioRef.current.play();
                setState((prev) => ({
                    ...prev,
                    isPlaying: true,
                }));
            } catch (err) {
                const error =
                    err instanceof Error
                        ? err
                        : new Error("Failed to resume audio");
                onError?.(error);
            }
        }
    }, [onError]);

    const stop = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setState((prev) => ({
                ...prev,
                isPlaying: false,
                currentTime: 0,
            }));
        }
    }, []);

    const seek = useCallback((time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setState((prev) => ({
                ...prev,
                currentTime: time,
            }));
        }
    }, []);

    const toggle = useCallback(() => {
        if (state.isPlaying) {
            pause();
        } else {
            resume();
        }
    }, [state.isPlaying, pause, resume]);

    return {
        ...state,
        play,
        pause,
        resume,
        stop,
        seek,
        toggle,
    };
}

/**
 * Simple hook for one-shot audio playback
 */
export function usePlaySound() {
    const { play, isPlaying, isLoading } = useAudioPlayer();

    return {
        playSound: play,
        isPlaying,
        isLoading,
    };
}
