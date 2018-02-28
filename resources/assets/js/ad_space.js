function adSize() {
    //get width of body for appropriate ad size
    var screenWidth = document.body.offsetWidth;
    //create script for ad to reside
    var contentScript = document.createElement("script");
    //Sets value for which adZone will be visible
    var adZoneNumElement;
    //Give the script an id for script verification
    contentScript.className = 'adzoneScript';
    //TODO REFACTOR CODE too many if/else statements
    if (!mediaCheck['matches'] && screenWidth >= 1280) { //Sets the wide ad
        adZoneNumElement = document.getElementById('adZone2');
        //add src attribute
        contentScript.setAttribute('src', partner_info['adzone2']);
        //add adzone attribute for verification
        contentScript.setAttribute('adzone', '2');
    } else if (!mediaCheck['matches'] && screenWidth < 1280) { //Sets the standard ad
        adZoneNumElement = document.getElementById('adZone3');
        //add src attribute
        contentScript.setAttribute('src', partner_info['adzone3']);
        //add adzone attribute for verification
        contentScript.setAttribute('adzone', '3');
    } else if (mediaCheck['matches']) { //Sets the mobile ad
        adZoneNumElement = document.getElementById('adZone4');
        //add src attribute
        contentScript.setAttribute('src', partner_info['adzone4']);
        //add adzone attribute for verification
        contentScript.setAttribute('adzone', '4');
    }
    contentScript.async = true;
    //ensure that an ad will fit within the viewable screen
    var scriptCheck = adZoneNumElement.getElementsByClassName('adzoneScript');
    if(scriptCheck.length == 0){
      adZoneNumElement.appendChild(contentScript);
    }
}

function adSpacePosition() {
    if (currentArticle) {
        setAdSpaceView(currentArticle);
    }
}

function setAdSpaceView(element) {
    var adDataView = element.querySelectorAll("[ad-view]");
    var adInView = false;
    for (var a = 0; a < adDataView.length; a++) {
        //determine if current element is in view
        var adView = checkElementInView(adDataView[a], 1, true);
        //get all ad-block's within visible element
        var adBlock = element.getElementsByClassName('ad-block');
        //set height of ad-block
        adBlock[a].style.height = adZoneEl.offsetHeight + 'px';
        //add attribute for visible flag
        adDataView[a].setAttribute('ad-view', adView.isVisible);
        //check if element is visible
        if (adView.isVisible) {
            adInView = true;
            //NOTE: below will not work too well in IE not very smooth
            adBlock[a].style.width = adZoneEl.offsetWidth + 'px';
            adBlock[a].style.height = adZoneEl.offsetHeight + 'px';
            adZoneEl.style.position = 'fixed';
            adZoneEl.style.top = adView.rect.y + 'px';
        }
    }
    if (!adInView) {
        adZoneEl.style.top = '-9999px';
    }
}

//should only run onload once
function bookmarkAd(){
  var bookmark = document.getElementById('adZone1');
  var script = document.createElement('script');
      script.src = partner_info['adzone1'];
      script.async = true;
      bookmark.insertBefore(script, bookmark.firstElementChild);
}
