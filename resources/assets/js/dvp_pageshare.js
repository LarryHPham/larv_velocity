function addToolTip(ele, msg) {
    ele.className = 'dvp_tooltip dvp_slidein_tooltip';
    ele.style.display = 'block';
    ele.innerHTML = msg;
    setTimeout(function () {
        removeToolTip(ele)
    }, 3200);
}

function removeToolTip(ele) {
    ele.className = 'dvp_tooltip dvp_slideback_tooltip';
    setTimeout(function () {
        ele.innerHTML = '';
        ele.style.display = 'none';
    }, 200)
}

function copyURL(event) {
    event.stopPropagation();
    var temp = document.createElement('input');
    temp.value = location.href;
    document.body.appendChild(temp);
    temp.select();
    try {
        var successful = document.execCommand('copy');
        var copyStatus = successful ? 'Copied to Clipboard' : 'Failed to Copy';
        var tooltipElement = document.getElementById('dvp-tooltip');
        addToolTip(tooltipElement, copyStatus);
    } catch (e) {
        console.error("copyURL function failed" + e)
    }
    document.body.removeChild(temp);

}

function shareUrl(socialMedia, event) {
    event.stopPropagation();
    var dvp_url = window.location.href;
    var shareType = {
        'twitter': "https://twitter.com/home?status=" + dvp_url,
        'facebook': "https://www.facebook.com/sharer/sharer.php?u=" + dvp_url,
        'pinterest': "http://pinterest.com/pin/create/button/?url=" + dvp_url
    };
    window.open(shareType[socialMedia]);
}

function closeModule(event) {
    event.stopPropagation();
    var shareElement = document.getElementById('dvp-mobile-share');
    shareElement.parentNode.style.display = 'none';
}
