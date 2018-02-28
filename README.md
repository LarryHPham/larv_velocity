# SNT Velocity Pages #

Velocity Pages are dynamic articles that are generated and an html markup is created server-side to return to consumers to spit out on consumer servers.

Main Content on Velocity are seperated out into two Apis. Server Side and Client Side

Server Side Api (used to be given to consumer servers to return html markup to be used on their website)
1. article
2. metatags
3. passback

Client Side Api (used on velocity pages as external client side calls to provide additional content that does not need to be rendered or created on the server)
1. article-simple
2. metatags
3. related article

## Quick Start ##

* [Dev Installation](dev_installation.md)

## Documentation ##

* [Passback](passback.md)
* [fetchArticle](fetcharticle.md)
* [Velocity Configuration](velocity_config.md)
