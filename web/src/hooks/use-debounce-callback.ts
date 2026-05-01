import { useEffect, useMemo } from 'react';
import { useUnmount } from './use-unmount';

type DebounceOptions = {
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
};

type ControlFunctions = {
    cancel: () => void;
    flush: () => void;
    isPending: () => boolean;
};

export type DebouncedState<T extends (...args: any[]) => any> = ((
    ...args: Parameters<T>
) => ReturnType<T> | undefined) &
    ControlFunctions;

function createDebounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    options: DebounceOptions = {},
) {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let lastCallTime: number | null = null;
    let lastInvokeTime = 0;
    let lastArgs: Parameters<T> | null = null;
    let result: ReturnType<T> | undefined;

    const { leading = false, trailing = true, maxWait } = options;

    const invoke = () => {
        if (!lastArgs) return;

        lastInvokeTime = Date.now();
        result = func(...lastArgs);
        lastArgs = null;
    };

    const startTimer = () => {
        timer = setTimeout(() => {
            timer = null;

            if (trailing && lastArgs) {
                invoke();
            }
        }, wait);
    };

    const debounced = (...args: Parameters<T>) => {
        const now = Date.now();
        lastArgs = args;
        lastCallTime = now;

        const shouldInvokeLeading = leading && !timer;
        const reachedMaxWait = maxWait !== undefined && now - lastInvokeTime >= maxWait;

        if (shouldInvokeLeading) {
            invoke();
        }

        if (timer) {
            clearTimeout(timer);
        }

        if (reachedMaxWait) {
            invoke();
        }

        startTimer();

        return result;
    };

    debounced.cancel = () => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        lastArgs = null;
    };

    debounced.flush = () => {
        if (timer) {
            clearTimeout(timer);
            timer = null;

            if (lastArgs) {
                invoke();
            }
        }

        return result;
    };

    debounced.isPending = () => {
        return timer !== null;
    };

    return debounced;
}

export function useDebounceCallback<T extends (...args: any[]) => any>(
    func: T,
    delay = 500,
    options?: DebounceOptions,
): DebouncedState<T> {
    const debounced = useMemo(() => createDebounce(func, delay, options), [func, delay, options]);

    useUnmount(() => {
        debounced.cancel();
    });

    useEffect(() => {
        return () => {
            debounced.cancel();
        };
    }, [debounced]);

    return debounced as DebouncedState<T>;
}
