
/* =========================================
   RESPONSIVE SWIPE PAGE TURNING
========================================= */

(() => {
    "use strict";

    const SWIPE_THRESHOLD = 55;

    let startX = 0;
    let startY = 0;
    let tracking = false;
    let startTarget = null;
    let horizontalSwipe = false;

    const navigation = document.querySelector(".navigation");
    if (!navigation) return;

    const navButtons = navigation.querySelectorAll(".nav-btn");
    if (navButtons.length < 2) return;

    const previousButton = navButtons[0];
    const nextButton = navButtons[navButtons.length - 1];

    function reset() {
        tracking = false;
        horizontalSwipe = false;
        startTarget = null;
    }

    function isExcluded(target) {
        if (!(target instanceof Element)) return true;

        // Keep navigation taps and form/media controls unaffected.
        // Word-learning buttons are intentionally allowed.
        return !!target.closest(
            ".nav-btn, a, input, textarea, select, audio, video"
        );
    }

    document.addEventListener("touchstart", event => {
        if (event.touches.length !== 1) {
            reset();
            return;
        }

        startTarget = event.target;

        if (isExcluded(startTarget)) {
            reset();
            return;
        }

        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
        tracking = true;
        horizontalSwipe = false;
    }, { passive: true });

    document.addEventListener("touchmove", event => {
        if (!tracking || event.touches.length !== 1) return;

        const dx = event.touches[0].clientX - startX;
        const dy = event.touches[0].clientY - startY;

        if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
            horizontalSwipe = true;
        }
    }, { passive: true });

    document.addEventListener("touchend", event => {
        if (!tracking || event.changedTouches.length !== 1) {
            reset();
            return;
        }

        const dx = event.changedTouches[0].clientX - startX;
        const dy = event.changedTouches[0].clientY - startY;

        const validSwipe =
            horizontalSwipe &&
            Math.abs(dx) >= SWIPE_THRESHOLD &&
            Math.abs(dx) > Math.abs(dy);

        reset();

        if (!validSwipe) return;

        // Do not interrupt an animation already in progress.
        if (document.querySelector(
            ".flip-out-next, .flip-out-prev"
        )) {
            return;
        }

        if (dx < 0) {
            nextButton.click();
        } else {
            previousButton.click();
        }
    }, { passive: true });

    document.addEventListener("touchcancel", reset, {
        passive: true
    });
})();
