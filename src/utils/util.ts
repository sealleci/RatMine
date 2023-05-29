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
function rangeRoll(min: number, max?: number): number {
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
 * @param targetLength The expected length of string after padding.
 * @param padString The prefix for padding.
 */
function padLeft(text: string, targetLength: number, padString: string): string {
    let padding = ''

    while (text.length + padding.length < targetLength) {
        padding += padString.substring(
            0,
            Math.min(padString.length, targetLength - (text.length + padding.length)))
    }

    return padding + text
}

/**
 * Add the suffix to the given string to reach the target length.
 * @param targetLength The expected length of string after padding.
 * @param padString The suffix for padding.
 */
function padRight(text: string, targetLength: number, padString: string): string {
    let padding = ''

    while (text.length + padding.length < targetLength) {
        padding += padString.substring(
            0,
            Math.min(padString.length, targetLength - (text.length + padding.length)))
    }

    return text + padding
}

/**
 * convert the given seconds to the time string.
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

export { sleep, rangeRoll }
export { padLeft, padRight, convertSecondsToTime }
