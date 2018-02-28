function loadData(apiUrl, asynchronous) {
    //TODO need to create related api call and related function become more scoped and not dependant on global variables that changes. CURRENT code below is a bandaid
    var count = relatedCount;
    var relatedContainer = document.getElementsByClassName('related-container')[count];
    var relatedBox = document.getElementsByClassName('related_box')[count];
    relatedCount++;
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
                relatedData = JSON.parse(this.responseText);
                if (relatedData.article_data && relatedData.article_data.length > 0) {
                    related(relatedContainer, count);
                } else {
                    relatedBox.style.display = 'none';
                }
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
                if (tries++ > maxTries) {
                    relatedBox.style.display = 'none';
                    tries = 0;
                    throw msg + " | PLEASE CONTACT YOUR PROVIDER API FAILED";
                }
                setTimeout(loadData(apiUrl, asynchronous), 500)
            }
        }
    };
    xhttp.open("GET", apiUrl, asynchronous);
    xhttp.send();
}

var related = function (container, rCount) {
    if (rCount === undefined) {
        rCount = 0;
    }
    var relatedContainer = container;
    var relatedLength = 0; //Will get the length of items in the list
    //inject HTML structure
    var html =
        "<div class='wrapper'><div class='button'><div class='button-left button-left-" + rCount + "'><div class='button-left-arrow'>" + arrow + "</div>" +
        "</div><div class='button-right button-right-" + rCount + "'><div class='button-right-arrow'>" + arrow + "</div>" +
        "</div></div><div class='related related-" + rCount + "' id='related-" + rCount + "' threshold='10'></div></div>";
    var related; //When content is defined set this variable to Container for where sliding blocks are inputed into
    var leftClick = "";
    var rightClick = "";
    var targetEl = document.getElementsByClassName('related-' + rCount), //Target element
        initialLoad = true; //Determines initial load so that new event listeners are not added

    function populateRelated(data) {
        var items = data['article_data'];
        var outputHTML = "";
        var listWrapper = document.createElement('div');
        listWrapper.className = 'list_wrapper list_wrapper-' + rCount;
        relatedContainer.innerHTML = html;
        related = document.getElementById("related-" + rCount);
        for (var i = 0; i < items.length && i < items.length; i++) {
            var relatedArr = {};
            relatedArr = {
                id: items[i]['article_id'],
                count: i,
                title: items[i].title,
                url: items[i].article_url
            };
            if (i < (items.length - 1)) {
                outputHTML += createTiles(relatedArr, false);
            } else {
                outputHTML += createTiles(relatedArr, true);
            }
        }
        //put related blocks into listWrapper with data attr
        listWrapper.innerHTML += outputHTML;
        //once list wrapper is created and finished put it inside of related Div for swipe feature
        related.innerHTML += listWrapper.outerHTML;
        leftClick = document.getElementsByClassName('button-left-' + rCount);
        rightClick = document.getElementsByClassName('button-right-' + rCount);
        leftClick[0].setAttribute('clicked', rCount);
        rightClick[0].setAttribute('clicked', rCount);
        targetEl[0].setAttribute('clicked', rCount);
        relatedLength = items.length - 1;
        lazyLoad(0, false);
        lineClamp(document.getElementsByClassName('related-title-offset'));
        createRelatedListeners(); // create listeners of content when content has been populated
    }

    function createTiles(titleData) {
        var relatedBlock = document.createElement('div');
        relatedBlock.className = 'related_block related_count-' + rCount;
        var titleOutput;
        var articleUrl = titleData.url;
        try {
            titleOutput =
                "<a href='" + articleUrl + "'>" +
                "<div class='title_overlay' ><div class='title_image_div overlay'>" +
                "<img class='title_image image-" + rCount + "' align='middle' imagecount='" + titleData.count + "'></div>" +
                "<div class='related-title'><span class='related-title-offset'>" + titleData.title + "</span></div></div></a>";
        } catch (e) {
            titleOutput = "";
            console.error(e);
        }
        relatedBlock.innerHTML = titleOutput;
        return relatedBlock.outerHTML;
    }

    function lazyLoad(count, clicked) {
        //set tile position. On initial load, 0 is needed. Once the user clicks then the position is changed to the correct module
        var tilePosition = !clicked ? rCount : count;
        //getArray of image tiles
        var tiles = document.getElementsByClassName('image-' + tilePosition);
        //set image src
        if (!clicked) {
            //initial load. Loop through image tile array and add image src
            for (var i = 0; i < tileCount; i++) {
                //add src to tiles in view
                tiles[i].src = buildImageUrl(relatedData['article_data'][i].image_url, 500);
            }
        } else {
            //get first and last tile.
            var firstImage = document.getElementsByClassName('image-' + tilePosition)[0];
            var lastImage = document.getElementsByClassName('image-' + tilePosition)[tileCount];
            //check if image has src
            if (!firstImage.src) {
                //add image src to first new tile
                firstImage.src = buildImageUrl(relatedData['article_data'][firstImage.getAttribute('imagecount')]['image_url'], 500);
            }
            if (!lastImage.src) {
                //add image src to last new tile
                lastImage.src = buildImageUrl(relatedData['article_data'][lastImage.getAttribute('imagecount')]['image_url'], 500);
            }
        }
    }

    function createRelatedListeners() {
        if (initialLoad) {
            setEventListeners(leftClick[0], 'click', navRight);
            setEventListeners(rightClick[0], 'click', navLeft);
            setEventListeners(leftClick[0], 'click', touchNoHover);
            setEventListeners(rightClick[0], 'click', touchNoHover);
            swipeDetect(targetEl[0], function (swipeDir, touchObj) {
                if (swipeDir === 'left') {
                    navLeft(touchObj);
                } else if (swipeDir === 'right') {
                    navRight(touchObj);
                } else {
                    navRight(touchObj);
                }
            });
            initialLoad = false;
        }

        function navRight(e) {
            var clicked = !isMobile ? e.currentTarget.getAttribute('clicked') : rCount;
            lazyLoad(clicked, true);
            //get elements and widths
            var relatedWrapper = document.getElementsByClassName('list_wrapper-' + clicked)[0];
            var tileWidth = document.getElementsByClassName('related_count-' + clicked)[0].offsetWidth;
            var firstTile = document.getElementsByClassName('related_count-' + clicked)[0];
            var lastTile = document.getElementsByClassName('related_count-' + clicked)[relatedLength];
            //turn on transition in the event navLeft shut it off
            firstTile.style.transition = 'all 0.6s ease-in-out';
            //retreat tile
            firstTile.style.marginLeft = tileWidth + 'px';
            //setTimeout so that transition can take place
            setTimeout(function () {
                //turn off transition to prevent div from snapping into place.
                firstTile.style.transition = 'none';
                //reset margin
                firstTile.style.marginLeft = 0;
                //move last tile to the beginning
                relatedWrapper.insertBefore(lastTile, relatedWrapper.firstChild);
            }, 550);
        }

        function navLeft(e) {
            var clicked = !isMobile ? e.currentTarget.getAttribute('clicked') : rCount;
            lazyLoad(clicked, true);
            //get elements and widths
            var relatedWrapper = document.getElementsByClassName('list_wrapper-' + clicked)[0];
            var tileWidth = document.getElementsByClassName('related_count-' + clicked)[0].offsetWidth;
            var firstTile = document.getElementsByClassName('related_count-' + clicked)[0];
            //turn on transition in the event navLeft shut it off
            firstTile.style.transition = 'all 0.6s ease-in-out';
            //advance tile
            firstTile.style.marginLeft = -(tileWidth) + 'px';
            //setTimeout so that transition can take place
            setTimeout(function () {
                //reset margin
                firstTile.style.marginLeft = 0;
                //move first tile to the end
                relatedWrapper.appendChild(firstTile);
            }, 550);
        }

        //this function replaces hover state to active for mobile devices so that the hover state will not stick if user clicks element
        function touchNoHover(e) {
            //check if the device supports touch events
            if ('ontouchstart' in window) {
                //loop through each element from the touch event
                for (var elements = e.path.length - 1; elements >= 0; elements--) {
                    //get styleSheet associated with element
                    var styleSheet = e.path[elements].styleSheets;
                    //check if styleSheet exists
                    if (styleSheet) {
                        //loop through styleSheets
                        for (var styles = styleSheet.length - 1; styles >= 0; styles--) {
                            //set each stylesheet
                            var css = styleSheet[styles];
                            //check to make sure stylesheet contains url and is not an inline style
                            if (css.href !== null) {
                                //loop through all rules
                                for (var styleRules = css.rules.length - 1; styleRules >= 0; styleRules--) {
                                    //check to ensure the rule has a selectorText
                                    if (css.rules[styleRules].selectorText) {
                                        //set touchState
                                        var touchState = css.rules[styleRules].selectorText;
                                        //look for hover state only
                                        if (touchState.includes(':hover')) {
                                            //switch selectorText from hover to active
                                            css.rules[styleRules].selectorText = css.rules[styleRules].selectorText.replace(":hover", ":active");
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }


    }// END createRelatedListeners
    populateRelated(relatedData);
};
loadData(firstRelatedUrl, true);
