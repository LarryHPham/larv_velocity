//checks the current element to see if it is within window client view
function checkElementInView(el, viewPercentage, debug) {
    if (!viewPercentage || viewPercentage < 0) {
        viewPercentage = 0;
    }
    //check if parent element has padding to determine proper positioning
    var style = el.parentNode.currentStyle || window.getComputedStyle(el.parentNode);
    var paddingLeft = parseFloat(style.paddingLeft);
    var marginLeft = parseFloat(style.marginLeft);
    var totalLeftPadding = paddingLeft + marginLeft;
    //check if current element has padding to determine proper positioning
    var elStyle = el.currentStyle || window.getComputedStyle(el);
    var pLeft = parseFloat(elStyle.paddingLeft);
    var mLeft = parseFloat(elStyle.marginLeft);
    var tPadding = pLeft + mLeft;
    var elementRect = {
        x: el.getBoundingClientRect().left,
        y: el.getBoundingClientRect().top,
        w: el.offsetWidth,
        h: el.offsetHeight,
        top: el.offsetTop,
        bot: el.getBoundingClientRect().bottom
    };
    var scrollView = 0;
    var visiblePercentage = 0;
    var scrollBookmark = 0;

    //Get percentage of viewability of the element compared to window
    if (elementRect.y > 0) {
        scrollBookmark = 0;
        scrollView = 0;
    } else {
        scrollView = elementRect.h == 0 ? 0 : (Math.abs(elementRect.y) / Math.abs(elementRect.h)) * 100;
        scrollBookmark = (Math.abs(elementRect.y) / Math.abs(elementRect.h - window.innerHeight)) * 100;
    }

    //Code to check the visibility of the element
    if (elementRect.y < window.innerHeight && elementRect.y > 0 && elementRect.h != 0) {
        //if the element height is larger than the screen then logic will need to be changed
        if (elementRect.h > window.innerHeight) {
            visiblePercentage = ((window.innerHeight - elementRect.y) / window.innerHeight) * 100;
        } else {
            //if the element is in the screen then determin how much is visible on screen
            if (elementRect.y < window.innerHeight && elementRect.bot > window.innerHeight) {
                visiblePercentage = (Math.abs(elementRect.y - window.innerHeight) / elementRect.h) * 100;
            } else {
                visiblePercentage = 100;
            }
        }
    } else {
        //if the element height is larger than the screen then logic will need to be changed
        if (elementRect.h > window.innerHeight) {
            if (elementRect.bot > window.innerHeight) {
                if (elementRect.y > window.innerHeight) {
                    visiblePercentage = 0;
                } else {
                    visiblePercentage = 100;
                }
            } else {
                visiblePercentage = ((elementRect.y + elementRect.h) / window.innerHeight) * 100;
            }
        } else {
            //if the element top of element has passed the window screen on top then determine how much of the element is still visible
            if (elementRect.y <= 0) {
                if (elementRect.y + elementRect.h > 0) {
                    visiblePercentage = ((elementRect.y + elementRect.h) / elementRect.h) * 100;
                } else {
                    visiblePercentage = 0;
                }
            }
        }
        //if the bottom of the element is below 0 pixels from the top of window screen then it will for sure be not visible
        if (elementRect.bot < 0) {
            visiblePercentage = 0;
        }
    }

    if (visiblePercentage < 0) {
        visiblePercentage = 0;
    } else if (visiblePercentage >= 100) {
        visiblePercentage = 100;
    }
    var xAxisPadding = elementRect.x - (totalLeftPadding + tPadding);
    var xAxis = xAxisPadding >= -5 && xAxisPadding <= 5;

    var isVisible = isMobile ? (visiblePercentage >= viewPercentage) && xAxis : visiblePercentage >= viewPercentage;

    return {
        "rect": elementRect,
        "isVisible": isVisible,
        "scrollViewPercentage": scrollView,
        "scrollBookmark": scrollBookmark,
        "visiblePercentage": visiblePercentage
    };
}
