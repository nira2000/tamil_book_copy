/* =========================================
   SWIPE PAGE TURNING
   Works with existing navigation buttons
========================================= */

(() => {

    let startX = 0;
    let startY = 0;

    const SWIPE_THRESHOLD = 60;

    /* Find the existing navigation buttons */
    const navigation = document.querySelector(".navigation");

    if (!navigation) {
        return;
    }

    const navButtons = navigation.querySelectorAll(".nav-btn");

    if (navButtons.length < 2) {
        return;
    }

    /* First button = Previous
       Last button  = Next */
    const previousButton = navButtons[0];
    const nextButton = navButtons[navButtons.length - 1];


    /* =========================================
       TOUCH START
    ========================================= */

    document.addEventListener("touchstart", function (event) {

        /* Only accept one finger */
        if (event.touches.length !== 1) {
            return;
        }

        /*
           Don't interfere with buttons,
           links, audio controls, text inputs, etc.
        */
        const target = event.target;

        if (
            target.closest(
                "button, a, input, textarea, select, audio"
            )
        ) {
            startX = 0;
            startY = 0;
            return;
        }

        startX = event.changedTouches[0].screenX;
        startY = event.changedTouches[0].screenY;

    }, {
        passive: true
    });


    /* =========================================
       TOUCH END
    ========================================= */

    document.addEventListener("touchend", function (event) {

        if (startX === 0 && startY === 0) {
            return;
        }

        const endX = event.changedTouches[0].screenX;
        const endY = event.changedTouches[0].screenY;

        const distanceX = endX - startX;
        const distanceY = endY - startY;

        /* Reset */
        startX = 0;
        startY = 0;


        /* =========================================
           IGNORE SMALL MOVEMENTS
        ========================================= */

        if (Math.abs(distanceX) < SWIPE_THRESHOLD) {
            return;
        }


        /* =========================================
           IGNORE VERTICAL SWIPES
        ========================================= */

        if (Math.abs(distanceX) <= Math.abs(distanceY)) {
            return;
        }


        /* =========================================
           SWIPE LEFT = NEXT PAGE
        ========================================= */

        if (distanceX < 0) {

            if (nextButton) {
                nextButton.click();
            }

        }


        /* =========================================
           SWIPE RIGHT = PREVIOUS PAGE
        ========================================= */

        else {

            if (previousButton) {
                previousButton.click();
            }

        }

    }, {
        passive: true
    });

})();