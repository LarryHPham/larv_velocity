let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

//change url to your local homestead box.
mix.browserSync({
    proxy: 'homestead.velocitybe',
    port: '80'
});

mix.babel([
        'resources/assets/js/global.js',
        'resources/assets/js/responsive.js',
        'resources/assets/js/bookmark_bar.js',
        'resources/assets/js/infinite_scroll.js',
        'resources/assets/js/header.js',
        'resources/assets/js/related_module.js',
        'resources/assets/js/swipe.js',
        'resources/assets/js/dvp_pageshare.js',
        'resources/assets/js/element_view.js',
        'resources/assets/js/checkFixed.js',
        'resources/assets/js/ad_space.js'
    ], 'public/client/js/app.js')
    .less('resources/assets/less/dvp_import.less', 'public/client/css/app.css');
