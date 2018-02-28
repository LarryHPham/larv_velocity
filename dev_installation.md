## Dev Installation ##

This application uses Laravel 5.5 and php 7+.

1. To get started, install a laravel/homestead vagrant box, as outlined [here](https://laravel.com/docs/5.5/homestead).
1. Once you've installed homestead, ssh into your virtual machine and download this repo.
1. Then copy the file `local.env` to `.env`. Replace the `ARTICLE_LIBRARY_USERNAME` and `ARTICLE_LIBRARY_PASSWORD`
1. fields of the .env with your dev database credentials. Alternatively, you can get a dump of the `article_library` database and host it locally in your homestead.
1. Run `composer update` to update using your composer.json
1. Run `npm install` OR `npm i` to update using your package.json
1. Run `npm run watch` to watch all files with browsersync it will auto refresh browser on any changes

###When FE code is under Development
* Run `npm run dev` or `npm run development` to compile javascript non-minified

###When FE code is ready for Production
* Run `npm run prod` or `npm run production` so it will uglified javascript

NOTE: look at laravel-elixer-uglify to uglify javascript
