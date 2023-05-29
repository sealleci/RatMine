/**
 * Remove all chidlren elements from the given element.
 */
function removeChildren(elm: HTMLElement) {
    for (const child of Array.from(elm.childNodes)) {
        elm.removeChild(child)
    }
}

/**
 * Add the given class to the given element if the class doesn't exist, 
 * otherwise remove the class from the element.
 */
function toggleClass(elm: HTMLElement, class_name: string) {
    if (elm.classList.contains(class_name)) {
        elm.classList.remove(class_name)
    } else {
        elm.classList.add(class_name)
    }
}

/**
 * Add the given class to the given element.
 */
function addClass(elm: HTMLElement, class_name: string) {
    if (!elm.classList.contains(class_name)) {
        elm.classList.add(class_name)
    }
}

/**
 * Remove the given class from the given element.
 */
function removeClass(elm: HTMLElement, class_name: string) {
    if (elm.classList.contains(class_name)) {
        elm.classList.remove(class_name)
    }
}

export { removeChildren, toggleClass, addClass, removeClass }
