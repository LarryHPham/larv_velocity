# Passback usage #

Velocity Passbacks are HTML documents requested by igloo when no ad provider wins the auction for the ad space. We call back to ourselves for a Passback ad which passes the user back to an article on the target site (for example, SportsLoyal).

The inputs used to build that HTML document are extracted from the querystring of the igloo API request, described below.

#### Notes ####

* The passback responds to calls made from igloo.
* Calls from igloo are made through the querystring (no POST or header data) and therefore all arguments will be encoded for URI using JavaScript's `encodeURIComponent()` function. Here's how that works.

#### API call structure and input parameters ####

The url structure for a passback call looks like the following. Required parameters are in the base route; optional parameters are in the querystring.

```
/passback/{partner_id}/{event}/{size}/{rand}/{base_url}/?type={type}&category={category}&clickThrough={clickThrough}
```

Here are some example parameters, unencoded:

* **partner_id:** `75` - The id of the partner from which the call was made
* **event:** `{"p":"75","w":"dynamic_finance","z":null,"igloo_id":0}` - used in the JavaScript tracking code that gets returned in the HTML document
* **size:** `1x1` - describes the aspect ratio of the image to be returned
* **rand:** `39` - A randomizer determined by igloo, between 0 and 49, so we don't send a passback to the same article every time
* **base_url:** `http://sportsloyal.com/articles?article_id=[ARTICLE_ID]` - this describes the URL pattern used by the partner so that we can correctly build the link to the article on the destination site
* **type (optional):** `article`
* **category (optional):** `ncaaf`
* **clickThrough (optional):** `https://click_here.com/?destination=` - used in cases when our partners have proxies they want to use to track traffic

If we just plug those parameters into the route structure, it would look like the following, which is not a valid URL and would break:

```
/passback/75/{"p":"75","w":"dynamic_finance","z":null,"igloo_id":0}/1x1/39/http://sportsloyal.com/articles?article_id=[ARTICLE_ID]/?type=article&category=ncaaf&clickThrough=https://click_here.com/?destination=
```

When we encode our test parameters with JavaScript `encodeURIComponent()`, they look like this:

* partner_id: `75`
* event: `%7B%22p%22%3A%2275%22%2C%22w%22%3A%22dynamic_finance%22%2C%22z%22%3Anull%2C%22igloo_id%22%3A0%7D`
* size: `1x1`
* rand: `39`
* base_url: `http%3A%2F%2Fsportsloyal.com%2Farticles%3Farticle_id%3D%5BARTICLE_ID%5D`
* type: `article`
* category: `ncaaf`
* clickThrough: `https%3A%2F%2Fclick_here.com%2F%3Fdestination%3D`

Plugging _those_ into the url structure gives us the actual valid call used to generate a passback ad:

```
/passback/75/%7B%22p%22%3A%2275%22%2C%22w%22%3A%22dynamic_finance%22%2C%22z%22%3Anull%2C%22igloo_id%22%3A0%7D/1x1/39/http%3A%2F%2Fsportsloyal.com%2Farticles%3Farticle_id%3D%5BARTICLE_ID%5D/?type=article&category=ncaaf&clickThrough=https%3A%2F%2Fclick_here.com%2F%3Fdestination%3D
```

#### Output (Passback HTML) ####

Using the above example API call would cause the following HTML document to be returned.

```
<!DOCTYPE html>
<html>
    <head>
        <style type="text/css">img{width:100%;position: absolute;margin: auto;top: 0;left: 0;right: 0;bottom: 0;background-color: #ffffff;}</style>
    </head>
    <body style="width: 100%" id="pb-image-container">
        <a target="_blank" href="https://click_here.com/?destination=http://sportsloyal.com/articles?article_id=698346&partner_id=75&utm_source=velocity_passback_1.0&utm_medium=banner&utm_campaign=1x1&utm_content=698346">
            <img id="pb-img-link">
        </a>
        <script>var tracker=function(){function e(e){var a={"p":"75","w":"dynamic_finance","z":null,"igloo_id":0};a.event=e;var x=[],s=window,n=0,d=10;try{for(;n++
            <10&&s!==window.top;)s=s.parent,x.push(s)}catch(e){}a.messageId="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var a=16*Math.random()|0;return("x"===e?a:3&a|8).toString(16)}),t[a.messageId]=a;for(var r=0;r
                <x.length;r++)x[r].postMessage(a,"*")}function a(e){return"message"===e.type&&"object"==typeof e.data&&"string"==typeof e.data.messageId&&void 0!==t[e.data.messageId]&&(e.data.send=!0,e.source.postMessage(e.data,"*"),delete t[e.data.messageId],!0)}var t={};window.addEventListener("message",a,!1),e("passback_load");for(var x=document.getElementsByTagName("a"),s=0;s
                    <x.length;s++)x[s].addEventListener("click",e.bind(void 0,"passback_click"));return{add:e}}();
                    </script>
                    <script>var dp=window.devicePixelRatio,pi="http://dev-images.synapsys.us/dev/01/passback/2017/10/19/698346_1x1_pb.jpeg",pw=window.innerWidth*dp;document.getElementById("pb-img-link").src=pi+"?width="+pw;</script>
                </body>
            </html>
```

Of course, environment-specific URLs liks `http://dev-images.synapsys.us...` will be production URLs in a production environment.
