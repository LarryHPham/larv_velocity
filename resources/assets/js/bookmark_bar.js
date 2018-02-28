//event listeners
setEventListeners(window, 'load', setPartnerElements);
setEventListeners(window, 'load', bookmarkAd);
setEventListeners(window, 'load scroll', getScrollTop);
setEventListeners(window, 'load scroll', showImage);
setEventListeners(window, 'load scroll resize', checkFixedElements);
setEventListeners(window, 'load scroll resize', currentArticleInView);
setEventListeners(window, 'load scroll resize', mobileFixedIndicators);
setEventListeners(window, 'load scroll resize', adSpacePosition);
setEventListeners(window, 'load resize', adSize);
setEventListeners(window, 'resize', checkMobile);
setEventListeners(window, 'resize', resetImageClass);

window.addEventListener("resize", function () {
    updateScreenSize(articleElement, article_count, 'right');
}, false);

//finds an element and makes it sticky and has an option adElement
function elementVerticalStickyScroll(element, socialEl, adElement) {
    if (!element.tagName || !element.nodeName) {
        return;
    }
    setEventListeners(window, 'load scroll resize', scrollFunction);

    function scrollFunction(e) {
        var container = checkElementInView(contentWrapper);
        var elementTopPadding = container.rect.top; //checks distance of the div's parent container from top of screen
        var wHeight = window.innerHeight; // grabs the current window height of client viewable screen
        var distanceFromParentBottom = element.parentElement.offsetHeight - window.innerHeight + elementTopPadding - scrollTop; //detects container distance from bottom and currently viewed window
        var heightPadding = 0;
        // checks for the padding height needed to push
        if (scrollTop <= elementTopPadding) {
            heightPadding = elementTopPadding - scrollTop;
        } else {
            heightPadding = elementTopPadding;
        }
        //sets the element position to fixed
        if (wHeight + distanceFromParentBottom < 0) {
            element.style.position = 'relative';
        } else {
            element.style.position = 'fixed';
        }
        //runs this if statement if element plus distant of element and top of page
        if (elementTopPadding - scrollTop <= partnerFixedHeight) {
            socialEl.style.position = 'fixed';
            socialEl.style.top = partnerFixedHeight + 10 + 'px';
            element.style.top = partnerFixedHeight + 'px';
            if (adSpace && distanceFromParentBottom < 0) {
                element.style.height = (wHeight - partnerFixedHeight - Math.abs(distanceFromParentBottom)) + 'px';
            } else {
                element.style.height = wHeight - partnerFixedHeight + 'px';
            }
        } else {
            element.style.height = (wHeight - heightPadding) + 'px';
            element.style.top = elementTopPadding - scrollTop + 'px';
            socialEl.style.position = 'relative';
            socialEl.style.top = '0';
        }
    }
}

function showImage() {
    try {
        if (currentArticle) {
            var firstImg = articleArray[0].getElementsByClassName('article-image')[0];
            var imageView = checkElementInView(firstImg, 50);
            var currentArticleImg = currentArticle.getElementsByClassName('article-image')[0].getElementsByTagName('img')[0];
            var currentBookmarkImage = bookmarkImage.querySelectorAll("[data-view='true']")[0];
            var newImage = bookmarkImage.querySelectorAll("[data-view='false']")[0];
            if (nowReading && currentArticle && currentArticleImg.src != currentBookmarkImage.src) {
                newImage.src = currentArticleImg.src;
                newImage.style.opacity = 1;
                newImage.setAttribute('data-view', true);
                currentBookmarkImage.style.opacity = 0;
                currentBookmarkImage.setAttribute('data-view', false);
            }
            var minImgView = imageView.rect.top + (.5 * imageView.rect.h);
            if (scrollTop >= minImgView) {
                var per = ((scrollTop - minImgView) / imageView.rect.h);
                if (per * 2 > 1) {
                    this.bookmarkImage.style.height = bookmarkImgHeight + 'px';
                } else {
                    this.bookmarkImage.style.height = ((per * 2) * bookmarkImgHeight) + 'px';
                }
            } else {
                this.bookmarkImage.style.height = '0px';
            }
        }
    } catch (e) {
        console.warn(e)
    }
}

function mobileFixedIndicators() {
    try {
        if (!currentArticle) {
            return;
        }
        var contentWrapper = articleElement;
        articleImage = currentArticle.getElementsByClassName('article-image')[0]; // div that does not change when the container is in sticky form
        currentImage = currentArticle.getElementsByClassName('article-image-container')[0]; // div that logic will add or remove sticky class
        currentOverlay = currentArticle.getElementsByClassName('article-image-overlay')[0]; // determine when overlay appears on image container
        currentImgTag = currentArticle.getElementsByClassName('article-image-tag')[0]; // determine when image tag text appears
        var wrapperPosition = checkElementInView(contentWrapper);
        var imagePosition = checkElementInView(articleImage, 100);
        var imageViewPercent = imagePosition.scrollViewPercentage;
        if (imageViewPercent >= 50 && isMobile) {
            currentOverlay.style.opacity = 0.5;
        } else {
            currentOverlay.style.opacity = 0;
        }
        //partnerFixedHeight is attained from compensatePartnerFixedHeight function
        if (wrapperPosition.rect.y > partnerFixedHeight) {
            dotId.classList.remove(fixedClass);
            currentImage.classList.remove(fixedClass);
            currentImage.style.top = partnerFixedHeight + "px";
            currentImgTag.style.opacity = 0;
        } else {
            dotId.classList.add(fixedClass);
            dotId.style.top = partnerFixedHeight + "px";
            //sticky image with defined stickyHeight
            if (imagePosition.rect.y + imagePosition.rect.h - currentImageStickyHeight <= partnerFixedHeight && isMobile) {
                currentImage.classList.add(fixedClass);
                currentImage.style.top = partnerFixedHeight - (imagePosition.rect.h - currentImageStickyHeight) + "px";
                currentImgTag.style.opacity = 1;
            } else {
                currentImage.classList.remove(fixedClass);
                currentImage.style.top = 0;
                currentImgTag.style.opacity = 0;
            }
        }
    } catch (e) {
        console.warn('Error in mobileFixedIndicators')
    }
}

function resetImageClass() {
    var images = contentWrapper.getElementsByClassName('article-image-container');
    //resets all classes for image
    for (var i = 0; i < images.length; i++) {
        images[i].classList.remove(fixedClass);
        images[i].style.top = '';
    }
}

function checkArticlePosition(index) {
    var opacityName = 'full';
    var dotsClass = imageDots.getElementsByClassName('dots');
    var dotsLength = dotsClass.length;
    var selectedDot = dotsClass[index % dotsLength];
    for (var i = 0; i < dotsLength; i++) {
        removeClass(dotsClass[i], opacityName);
    }
    selectedDot.classList.add(opacityName);
}

//finds out the current article in view and sets the global variables
function currentArticleInView() {
    if (this.articleArray.length <= 0) {
        return;
    }
    for (var a = 0; a < this.articleArray.length; a++) {
        var articleView = checkElementInView(this.articleArray[a], vPercent);
        this.articleArray[a].setAttribute('data-view', articleView.isVisible);
        //if article is visible then set the current and next article while updating the progress bar and the latest articles in bookmark bar
        if (articleView.isVisible) {
            updateProgressBar(progressBar, articleView);
            previousArticle = this.articleArray[a - 1]; // sets current article element
            currentArticle = this.articleArray[a]; // sets current article element
            nextArticle = this.articleArray[a + 1]; // sets current article element
            if (isMobile) {
                getMobileArticleHeight(currentArticle);
                stickyArticles(currentArticle, true)
            } else {
                getMobileArticleHeight(currentArticle, true);
            }
            checkArticlePosition(a);
            var articleIds = bookmarkElement.querySelectorAll("[data-id]");
            for (var i = 0; i < articleIds.length; i++) {
                var bookmarkArticleId = articleIds[i].getAttribute('data-id');
                var pageArticleId = currentArticle.getAttribute('data-id');
                if (bookmarkArticleId == pageArticleId) {
                    window.velocity['nowReading'] = bookmarkArticleId;
                    if (i + 1 >= articleIds.length) {
                        window.velocity['upNext'] = null
                    } else {
                        window.velocity['upNext'] = articleIds[i + 1].getAttribute('data-id');
                    }
                    if (i - 1 < 0) {
                        window.velocity['previous'] = null
                    } else {
                        window.velocity['previous'] = articleIds[i - 1].getAttribute('data-id');
                    }
                }
            }
        }
    }
    //if the visibility is false and is mobile then run a function to position articles
    if (isMobile) {
        //send in article to be positioned
        stickyArticles(previousArticle);
        stickyArticles(nextArticle);
    }
    //runs function that will update Now Reading
    updateLatestArticles();
}

function getMobileArticleHeight(article, reset) {
    if (reset) {
        contentWrapper.style.height = '';
        return;
    }
    var articleContainer = article.getElementsByClassName('article-container')[0];
    contentWrapper.style.height = articleContainer.offsetHeight + 'px';
}

function stickyArticles(article, reset) {
    if (!article) {
        return;
    }
    if (reset) {
        article.style.position = '';
        article.style.top = '';
        return;
    }
    var contentView = checkElementInView(contentWrapper, vPercent);
    article.style.position = 'relative';
    article.style.top = Math.abs(contentView.rect.y - partnerFixedHeight) + 'px';
}

//updates the css styling for progress bar
function updateProgressBar(progressBar, viewData) {
    progressBar.style.width = viewData.scrollBookmark + '%';
}

//finds updates global variables with the elements of the previous, current, and next articles
function updateLatestArticles() {
    if (window.velocity['nowReading']) {
        var reading = bookmarkElement.querySelectorAll("[data-id='" + window.velocity['nowReading'] + "']");
        var next = bookmarkElement.querySelectorAll("[data-id='" + window.velocity['upNext'] + "']");
        var pre = bookmarkElement.querySelectorAll("[data-id='" + window.velocity['previous'] + "']");
        nowReading = reading[0] ? reading[0] : null;
        upNext = next[0] ? next[0] : null;
        previous = pre[0] ? pre[0] : null;
        if (nowReading) {
            transitionArticles();
        }
    }
}

//sets transition
function transitionArticles() {
    //reset all text in articles
    var articleIds = bookmarkElement.querySelectorAll("[data-id]");
    var currentOffset = nowReading.offsetTop;
    var previousOffset = previous ? previous.offsetTop : currentOffset;
    var nextOffset = upNext ? upNext.offsetTop : currentOffset + 68;
    if (upNext) {
        bookmarkElement.getElementsByClassName('dvp_bookmark-next')[0].style.display = 'block';
    } else {
        bookmarkElement.getElementsByClassName('dvp_bookmark-next')[0].style.display = 'none';
    }
    for (var i = 0; i < articleIds.length; i++) {
        var id = articleIds[i].getAttribute('data-id');
        if (id == window.velocity['nowReading']) {
            var newTitle = articleIds[i].getElementsByClassName('dvp_bookmark-title')[0].innerHTML;
            if (newTitle != currentTitle.innerHTML) {
                currentTitle.style.opacity = '0';
                setTimeout(function () {
                    currentTitle.innerHTML = newTitle;
                    currentTitle.style.opacity = '1';
                    //run once article is in view and after initial page load.
                }, 250);
                if (runMetaData !== i) {
                    //increment counter and set articleIdCheck
                    if (i > runMetaData) {
                        articleIdCheck = window.velocity['previous'];
                        runMetaData++;
                    } else {
                        articleIdCheck = window.velocity['upNext'];
                        runMetaData--;
                    }
                    loadMetaTags();
                }
            }
        }
        if (id != window.velocity['nowReading']) {
            removeClass(articleIds[i], 'bg-white');
        }
    }

    // set the nowReading and next articles text
    var box = bookmarkElement.getElementsByClassName('dvp_bookmark-box');
    if (nextOffset > previousOffset) {
        box[0].style.top = '-' + nextOffset + 'px';
    } else {
        box[0].style.top = '-' + currentOffset + 'px';
    }
}

function loadMetaTags() {
    replaceHeaderUrl = headerUrl + window.velocity['nowReading'] + "/" + window.partnerId;
    getMetaTags(replaceHeaderUrl, true);
}

function hasClass(el, className) {
    if (el.classList) {
        return el.classList.contains(className);
    } else {
        return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
    }
}

function addClass(el, className) {
    if (el.classList)
        el.classList.add(className);
    else if (!hasClass(el, className)) el.className += " " + className
}

function removeClass(el, className) {
    if (el.classList) {
        el.classList.remove(className);
    } else if (hasClass(el, className)) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        el.className = el.className.replace(reg, ' ');
    }
}

elementVerticalStickyScroll(bookmarkElement, socialContainer, adSpace);
