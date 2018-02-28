//Global Variables
//var protocolToUse = (location.protocol == "https:") ? "https://" : "http://";
var imageUrl = "images.synapsys.us"; // this is global call that is used for images
var articleURL = window.vp_env_url + "/client/article-simple/";
var headerUrl = window.vp_env_url + "/client/metatags/";
var relatedUrl = window.vp_env_url + "/client/related/";
var firstRelatedUrl = window.vp_env_url + "/client/related/" + window.relatedId + "/" + window.partnerId;
var replaceHeaderUrl = "";
var articleIdCheck = ""; //Used to compare current Id with previous or next Id
var articleData = "";
var relatedBox;
var relatedData = "";
var metaData = "";
var runMetaData = 0; //Counter to ensure that the getMetaTags function runs once per page view
var firstRun = false; //Check to make sure that the page initially loaded.
var relatedCount = 0;
var article_count = 0;
var max_article_count = 25;
var maxScrollPercent = 80;
var tileCount = 8; //set counter for lazy loading images
var hasLoaded = false;
var nextSwipe = true;
var tries = 0; // flag for api to try at least 10 times before failing completely
var maxTries = 3;
var valid_article_identifiers = []; // store all valid widget identifiers in this array so that it cannot be called again
var partner_elements = [];
var fixed_partner_elements = [];
var partnerFixedHeight = 0; // help determine the height of partner's fixed headers to compensate on our fixed headers
var headerElement = document.getElementsByTagName('head')[0];
var articleElement = document.getElementById('dvp-article');
var contentWrapper = document.getElementById('content');
var bookmarkElement = document.getElementById('dvp_bookmark');
var adSpace = document.getElementById('ad_space');
var bookmarkImage = document.getElementById('dvp_bookmark-image');
var imageDots = document.getElementById('image-dots');
var dotId = document.getElementById('dots');
var progressBar = document.getElementById('progressbar');
var currentTitle = document.getElementById('current-title');
var socialContainer = document.getElementById('dvp-social');
var adZoneEl = document.getElementsByClassName('adzone_content')[0];
var vPercent = 50;
var bookmarkImgHeight = 170;
var articleArray = document.getElementsByClassName('article');
var previousArticle;
var currentArticle;
var nextArticle;
var articleImage;
var currentImage;
var currentOverlay;
var currentImgTag;
var currentImageStickyHeight = 65;
var previous;
var nowReading;
var upNext;
var scrollTop;
var isMobile = false;
var adZone = "0";
var initialLoad = false;
var fixedClass = "stick-top";
var transition = "all 0.5s ease-in-out";
var arrow = "<svg stroke=\'#3098FF\' width=\'6\' height=\'10\' viewBox=\'0 0 6 10\' xmlns=\'http://www.w3.org/2000/svg\'><title>Icon / Arrow</title>" +
    "<path d=\'M5.3 9v-.3L1 4.5H.6L.2 5v.3L3.7 9 .2 12.3v.4l.5.4H1l4.2-4v-.3z\' transform=\'translate(0 -4)\' fill=\'url(#a)\' fill-rule=\'evenodd\'/></svg>";
//relatedId is pulled from the related.blade.php file

if (!window.velocity) {
    window.velocity = {};
}
window.velocity['previous'];
window.velocity['nowReading'];
window.velocity['upNext'];

//Waits for the DOMContent to load so we know where to append the widget
//If check for mobile or desktop-display
if (window.screen.width <= 768 || window.innerWidth <= 768) {
    max_article_count = 10;
    isMobile = true;
    runMobile(true);
} else {
    runDesktop();
}

//This fires a resize event so that the video module can have the correct width
//The script that creates the video only adjusts it's width on resize and not when the content is loaded.
setTimeout(function () {
    if (document.createEvent) {
        var ev = document.createEvent('Event');
        ev.initEvent('resize', true, true);
        window.dispatchEvent(ev);
    } else { // IE :(
        element = document.documentElement;
        var event = document.createEventObject();
        element.fireEvent("onresize", event);
    }
}, 500);

//global functions
function buildImageUrl(image, size) {
    //returns image url and adds iris size parameter
    return "//" + imageUrl + image.replace("'", "") + "?width=" + size;
}

// Need to pass the container for the text which needs a defined height and width and pass the actual block of text.
function lineClamp(textContainer) {
    //loop through entire container
    for (var i = 0; i < textContainer.length; i++) {
        //set to variable
        var text = textContainer[i];
        //check that the scrollHeight is > than the offsetHeight of the container
        if (text.scrollHeight > text.offsetHeight) {
            //split each word into an array
            var wordSplitArr = text.innerHTML.split(' ');
            //used to remove words that exceed offsetHeight
            var removeWord;
            //check to make sure the content is being clamped
            var isLineClamp = false;
            //loop through split text
            for (var j = 0; j < wordSplitArr.length; j++) {
                //Keep checking scrollHeight is > than offsetHeight after each word is removed from the content
                if (text.scrollHeight > text.offsetHeight) {
                    //remove the word from the array
                    removeWord = wordSplitArr.pop();
                    //reform the sentence to check scrollHeight
                    text.innerHTML = wordSplitArr.join(' ');
                    //set LienClamp to true
                    isLineClamp = true
                } else {
                    //break ot ouf for loop
                    break;
                }
            }
            //final check
            if (isLineClamp) {
                //set innerHTML using regex to find last word in content and replace with ellipses
                text.innerHTML = text.innerHTML.replace(/\W*\s(\S)*$/, '...');
            }
        }
    }
}

function getScrollTop() {
    scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop; // detects current scroll from Top of page
}

function checkMobile() {
    if (window.screen.width <= 768 || window.innerWidth <= 768) {
        max_article_count = 10;
        isMobile = true;
    } else {
        isMobile = false;
    }
}

function setPartnerElements() {
    var elements = document.body.querySelectorAll("*");
    partner_elements = queryRemoveChildrenFromArray(elements, contentWrapper);
}

function setEventListeners(el, userEv, fn) { //Function to set listeners
    var events = userEv.split(' '); //Split events
    for (var i = 0, length = events.length; i < length; i++) {
        el.addEventListener(events[i], fn, false);
    }
}

function removeEventListeners(el, userEv, fn, option) { //Function to remove listeners if ever needed
    var events = userEv.split(' '); //Split events
    for (var i = 0, length = events.length; i < length; i++) {
        el.removeEventListener(events[i], fn, option);
    }
}
