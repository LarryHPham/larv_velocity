function getMetaTags(apiUrl) { //Make it to where it is easy to be reused by anyone
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
                metaData = JSON.parse(this.responseText);
                replaceMetaTags(headerElement, metaData['content']);
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
                    throw msg + " | PLEASE CONTACT YOUR PROVIDER API FAILED";
                }
                setTimeout(getArticle(apiUrl), 500)
            }
        }
    };
    xhttp.open("GET", apiUrl, true);
    xhttp.send();
}

function replaceMetaTags(e, metaData) {
    var previousUrl = window.location.toString();
    var currentUrl = previousUrl.replace(articleIdCheck, window.velocity['nowReading']);
    if (currentUrl === previousUrl) {
        currentUrl = previousUrl.replace(window.velocity['nowReading'], articleIdCheck);
    }
    history.replaceState('', '', currentUrl);
    //get all elements with the meta tag name. Assign to metaIndex variable
    var elements = document.getElementsByTagName('meta'), metaIndex;
    //loop through elements
    for (metaIndex = elements.length - 1; metaIndex >= 0; metaIndex--) {
        //check if element has dochead attribute and that it is = 1
        if (elements[metaIndex].getAttribute('dochead') === '1') {
            //remove element
            elements[metaIndex].parentNode.removeChild(elements[metaIndex]);
        }
    }
    //get all elements with the link tag name
    var canonical = document.getElementsByTagName('link'), linkIndex;
    //loop through elements
    for (linkIndex = canonical.length - 1; linkIndex >= 0; linkIndex--) {
        //check if element has dochead attribute and that it is = 1
        if (canonical[linkIndex].getAttribute('dochead') === '1') {
            //remove element
            canonical[linkIndex].parentNode.removeChild(canonical[linkIndex]);
        }
    }
    //insert new metaData
    e.insertAdjacentHTML('afterbegin', metaData);
}
