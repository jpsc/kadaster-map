export default browserSupportsAnimations;

/*
 * Returns true if the user's browser supports CSS animations
 * https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Detecting_CSS_animation_support
 *
 * @returns {boolean}
 */
function browserSupportsAnimations() {
    const domPrefixes = 'Webkit Moz O ms Khtml'.split(' ');
    const elm = document.createElement('div');

    if (elm.style.animationName !== undefined) {
        return true;
    }

    for (let i = 0; i < domPrefixes.length; i++) {
        if (elm.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
            return true;
        }
    }

    return false;
}
