/**
 * Sleep for the given time.
 * 
 * Usage:
 * ``` js
 * await sleep(100)
 * ```
 * @param ms Milliseconds.
 */
function sleep(ms: number) {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, ms)
    })
}

/**
 * Return a random integer within the given range.
 * 
 * Usage:
 * ``` js
 * rangeRandom(5) // value in [0, 5)
 * rangeRandom(1, 10) // value in [1, 10]
 * ```
 */
function rollRange(min: number, max?: number): number {
    if (max === undefined) {
        max = min - 1
        min = 0
    }

    if (min > max) {
        [min, max] = [max, min]
    }

    return Math.floor(Math.random() * (max - min + 1)) + Math.floor(min)
}

/**
 * Add the prefix to the given string to reach the target length.
 * @param target_len The expected length of string after padding.
 * @param pad_str The prefix for padding.
 */
function padLeft(text: string, target_len: number, pad_str: string): string {
    let padding = ''

    while (text.length + padding.length < target_len) {
        padding += pad_str.substring(
            0,
            Math.min(pad_str.length, target_len - (text.length + padding.length)))
    }

    return padding + text
}

/**
 * Add the suffix to the given string to reach the target length.
 * @param target_len The expected length of string after padding.
 * @param pad_str The suffix for padding.
 */
function padRight(text: string, target_len: number, pad_str: string): string {
    let padding = ''

    while (text.length + padding.length < target_len) {
        padding += pad_str.substring(
            0,
            Math.min(pad_str.length, target_len - (text.length + padding.length)))
    }

    return text + padding
}

/**
 * Convert the given seconds to the time string.
 * @returns The string presents the time with the "mm:ss" format.
 * 
 * Usage:
 * ``` js
 * convertSecondsToTime(70) // "01:10"
 * ```
 */
function convertSecondsToTime(seconds: number): string {
    return `${padLeft(Math.floor(seconds / 60).toString(), 2, '0')}:${padLeft(Math.floor(seconds % 60).toString(), 2, '0')}`
}

/**
 * Return a new array with the unique elements from the given array.
 * 
 * Usage:
 * ``` js
 * uniqueArray([1, 2, 3, 2, 1]) // [1, 2, 3]
 * ```
 */
function uniqueArray<T>(array: T[]): T[] {
    return Array.from(new Set(array))
}

export { convertSecondsToTime, padLeft, padRight, rollRange, sleep, uniqueArray }
