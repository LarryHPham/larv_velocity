/***************************** runAPI ***************************
 * @function runAPI
 * function that makes an asynchronous request using http and setting a global variable equal to the response of the text.
 * fail safe of retrying 10 times before sending error message
 *
 * @param function apiUrl -
 */
function getArticle(apiUrl, asynchronous) { //Make it to where it is easy to be reused by anyone
    hasLoaded = true;
    nextSwipe = false;
    if (window.XMLHttpRequest) {
        var xhttp = new XMLHttpRequest();
    } else {
        var xhttp = new ActiveXObject('Microsoft.XMLHTTP')
    }
    xhttp.onreadystatechange = function () {
        // Check if the loading status of the current document is done
        if (this.readyState == 4) {
            if (this.status == 200) {
                // On success parse out the response
                articleData = JSON.parse(this.responseText);
                appendData(articleElement, articleData['content']);
                currentArticleInView(articleArray);
                nextSwipe = true;
                loadRelated(window.velocity['upNext']);
            } else {
                // Error handling
                // Get the message
                var msg = this.statusText;
                if (this.status == 500) {
                    try {
                        msg = JSON.parse(this.responseText).message
                    } catch (e) {
                        console.log('No JSON message')
                    }
                }
                if (tries++ > maxTries) { // IF WIDGET FAILS THEN HIDE THE ENTIRE CONTAINER
                    tries = 0;
                    throw msg + " | PLEASE CONTACT YOUR PROVIDER API FAILED";
                }
                setTimeout(getArticle(apiUrl, asynchronous), 500)
            }
        }
    };
    xhttp.open("GET", apiUrl, asynchronous);
    xhttp.send();
}

function sntListener() {
    if (!window.velocity['upNext']) {
        return;
    }
    if (article_count <= max_article_count) {
        var body = document.body,
            html = document.documentElement;
        // for used to allow ie9 && other browsers to grab the proper height, client height and scrollTop
        var bodyHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight),
            windHeight = window.innerHeight || (document.documentElement || document.body).clientHeight,
            trackLength = bodyHeight - windHeight;
        // will return the percent of the scrolled height on client
        var heightListener = Math.floor((scrollTop / trackLength) * 100);
        //create widget identifier based on the amount of widgets that are on the page
        if (heightListener >= maxScrollPercent && !hasLoaded && window.velocity['upNext'] && valid_article_identifiers.indexOf(window.velocity['upNext']) == -1) {
            if (valid_article_identifiers.length == 0) {
                valid_article_identifiers.push(window.velocity['nowReading']);
            }
            valid_article_identifiers.push(window.velocity['upNext']);
            var loadUrl = articleURL + window.velocity['upNext'];
            getArticle(loadUrl, true);
            firstRun = true;
        }
    }
}

function loadRelated(relatedId) {
    var relatedApi = relatedUrl + relatedId + "/" + window.partnerId;
    loadData(relatedApi, true); // TODO needs to be false otherwise the count and searching for related containers asynchronously will be off
}

function appendData(e, outerHtml) {
    var tempElement = document.createElement('div');
    tempElement.innerHTML = outerHtml;
    e.appendChild(tempElement.firstChild);
    hasLoaded = false;
}

function runDesktop() {
    window.onscroll = function () {
        sntListener();
    };
    sntListener();
}

function runMobile(firstRun) {
    if (firstRun && !window.velocity['upNext']) {
        setTimeout(function () {
            runMobile(true);
        }, 500);
        return;
    } else {
        isNumberInArray(window.velocity['nowReading'], valid_article_identifiers);
        getArticle(articleURL + window.velocity['upNext'], false);
    }
    swipeDetect(contentWrapper, function (swipeDir) {
        if (nextSwipe && !hasLoaded) {
            var valid;
            if (swipeDir == 'left') {
                if (window.velocity['upNext'] && article_count !== (max_article_count - 1)) {
                    resetImageClass();
                    nextSwipe = false;
                    // valid = isNumberInArray(window.velocity['upNext'], valid_article_identifiers);
                    dotId.style.transition = 'all 0.5s ease-in-out';
                    navRight(articleElement);
                }
            } else if (swipeDir == 'right') {
                if (window.velocity['previous']) {
                    resetImageClass();
                    nextSwipe = false;
                    // valid = isNumberInArray(window.velocity['previous'], valid_article_identifiers);
                    dotId.style.transition = 'all 0.5s ease-in-out';
                    navLeft(articleElement);
                }
            } else {
                return;
            }
            setTimeout(function () {
                currentArticleInView(articleArray);
                if (swipeDir == 'left') {
                    if (window.velocity['upNext']) {
                        valid = isNumberInArray(window.velocity['upNext'], valid_article_identifiers);
                    } else {
                        valid = true;
                    }
                } else if (swipeDir == 'right') {
                    if (window.velocity['previous']) {
                        valid = isNumberInArray(window.velocity['previous'], valid_article_identifiers);
                    } else {
                        valid = true;
                    }
                }
                if (window.velocity['previous'] && window.velocity['upNext']) {
                    if (!valid && article_count < max_article_count) {
                        getArticle(articleURL + window.velocity['upNext'], true);
                        isNumberInArray(window.velocity['upNext'], valid_article_identifiers);
                    }
                }
                stickyArticles(currentArticle, true);
                window.scrollTo(0, 0);
                mobileFixedIndicators();
                dotId.style.transition = 'unset';
                nextSwipe = true;
            }, 600);
        }
    });
}

function updateScreenSize(wrapper, index, direction) {
    switch (direction) {
        case 'left':
        case 'right':
        case 'top':
        case 'bottom':
            wrapper.style[direction] = (wrapper.offsetWidth * index) + 'px';
            break;
        default:
            wrapper.style['right'] = (wrapper.offsetWidth * index) + 'px';
            break;
    }
}

function navLeft(wrapper) {
    article_count--;
    if (article_count <= 0) {
        article_count = 0;
    }
    updateScreenSize(wrapper, article_count, 'right');
    updateScreenSize(dotId, article_count, 'left');
}

function navRight(wrapper) {
    article_count++;
    if (article_count > max_article_count) {
        article_count = max_article_count - 1;
    }
    updateScreenSize(wrapper, article_count, 'right');
    updateScreenSize(dotId, article_count, 'left');
}


function isNumberInArray(number, array) {
    if (!number) {
        return true;
    }
    var isAvailable = array.indexOf(number);
    if (isAvailable == -1) {
        array.push(number);
        return false;
    } else {
        return true;
    }
}
