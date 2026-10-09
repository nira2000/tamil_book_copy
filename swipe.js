
/* =========================================
   SHARED SWIPE PAGE TURNING
   Use the existing navigation buttons
========================================= */

(() => {
    "use strict";

    const SWIPE_THRESHOLD = 65;
    const MAX_VERTICAL_MOVEMENT = 80;

    let startX = 0;
    let startY = 0;
    let trackingTouch = false;
    let isSwiping = false;
    let touchStartTarget = null;

    // Find this page's navigation buttons
    const navigation = document.querySelector(".navigation");

    if (!navigation) return;

    const navButtons = navigation.querySelectorAll(".nav-btn");

    if (navButtons.length < 2) return;

    const previousButton = navButtons[0];
    const nextButton = navButtons[navButtons.length - 1];

    // Ignore interactive elements where students tap to learn
    function isInteractive(target) {
        return target instanceof Element &&
            !!target.closest(
                "button, a, input, textarea, select, audio, video"
            );
    }

    document.addEventListener("touchstart", function (event) {
        if (event.touches.length !== 1) {
            trackingTouch = false;
            return;
        }

        const touch = event.touches[0];

        startX = touch.clientX;
        startY = touch.clientY;
        touchStartTarget = event.target;
        trackingTouch = true;
        isSwiping = false;

    }, { passive: true });

    document.addEventListener("touchmove", function (event) {
        if (!trackingTouch || event.touches.length !== 1) return;

        const touch = event.touches[0];
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;

        // Only treat a clearly horizontal movement as a swipe
        if (
            Math.abs(dx) > 12 &&
            Math.abs(dx) > Math.abs(dy) &&
            !isInteractive(touchStartTarget)
        ) {
            isSwiping = true;
        }

    }, { passive: true });

    document.addEventListener("touchend", function (event) {
        if (!trackingTouch || event.changedTouches.length !== 1) {
            resetTouch();
            return;
        }

        const touch = event.changedTouches[0];
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;

        const shouldIgnore =
            isInteractive(touchStartTarget) ||
            Math.abs(dx) < SWIPE_THRESHOLD ||
            Math.abs(dy) > MAX_VERTICAL_MOVEMENT ||
            Math.abs(dx) <= Math.abs(dy);

        resetTouch();

        if (shouldIgnore) return;

        // Avoid triggering navigation repeatedly during a page turn
        if (document.querySelector(
            ".flip-out-next, .flip-out-prev"
        )) {
            return;
        }

        // Swipe left = next page
        if (dx < 0) {
            nextButton.click();
        }

        // Swipe right = previous page
        else {
            previousButton.click();
        }

    }, { passive: true });

    document.addEventListener("touchcancel", resetTouch, {
        passive: true
    });

    function resetTouch() {
        startX = 0;
        startY = 0;
        trackingTouch = false;
        isSwiping = false;
        touchStartTarget = null;
    }

})();
