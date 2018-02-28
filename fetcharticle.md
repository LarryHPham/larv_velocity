# Article Api usage #

Velocity Article Api are requests to the article library to return content that velocity will create a HTML Markup populated with links and ads related with our partner.

#### Notes ####

* Velocity Pages are reliant on Article Library `https://github.com/passit/Article-Library`


#### API call structure and input parameters ####

The url structure for a article api call looks like the following. Required parameters are in the base route;

```
/article/{articleId}/{partnerId}
```

* **articleId** - article identifier to grab the article that is requested
* **partnerID** - partner info that will assist in populating the urls and adspaces stored on the article content

#### Output (Article HTML) ####

Using the above example API call would cause the following HTML document to be returned in a json Format.

```
{
checksum: "2596f8d76d6b34ed9919310159bc2b35",
content: "<script type="text/javascript">
var vp_env_url = "//homestead.velocitybe";
//passes articleId to the app.js file
var relatedId = '698436';
var partnerId = '12';
</script>
<div class="content module module-resize" id="content">
    <div class="content-bookmark">    <div class="dvp_bookmark" id="dvp_bookmark">
    <div class="dvp_bookmark-image" id="dvp_bookmark-image">...
  }
"
```

Of course, environment-specific URLs like `http://images.synapsys.us...` will be production URLs in a production environment.
