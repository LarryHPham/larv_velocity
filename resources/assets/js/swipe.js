// credit: http://www.javascriptkit.com/javatutors/touchevents2.shtml
// has been modified
function swipeDetect(el, callback) {
    var touchSurface = el,
        swipeDir,
        startX,
        startY,
        distX,
        distY,
        threshold = el.hasAttribute('threshold') ? el.getAttribute('threshold') : 100, //required min distance traveled to be considered swipe
        allowedTime = 1000, // maximum time allowed to travel that distance
        elapsedTime,
        startTime,
        handleSwipe = callback || function (swipeDir, touchObj) {
        };
    setEventListeners(touchSurface, 'mousedown touchstart', navStart);
    setEventListeners(touchSurface, 'mousemove touchmove', navMove);
    setEventListeners(touchSurface, 'mouseup touchend', navEnd);
    function navStart(e) {
        var touchObj = ('changedTouches' in e) ? e.changedTouches[0] : e;
        swipeDir = 'none';
        startX = touchObj.pageX;
        startY = touchObj.pageY;
        startTime = new Date().getTime(); // record time when finger first makes contact with surface
        e.stopPropagation();
    }

    function navMove(e) {
        e.preventDefault(); //Cancels any default action on element
    }

    function navEnd(e) {
        var touchObj = ('changedTouches' in e) ? e.changedTouches[0] : e;
        distX = touchObj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
        distY = touchObj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime; // get time elapsed
        if (elapsedTime <= allowedTime) { // first condition for awipe met
            if (Math.abs(distX) >= Math.abs(distY) && Math.abs(distX) >= threshold) { // 2nd condition for horizontal swipe met
                swipeDir = (distX < 0) ? 'left' : 'right'; // if dist traveled is negative, it indicates left swipe
            }
            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= Math.abs(distY)) { // 2nd condition for vertical swipe met
                swipeDir = (distY < 0) ? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
            } //disabled to allow scrolling vertically
        }
        e.stopPropagation();
        handleSwipe(swipeDir, touchObj)
    }
}