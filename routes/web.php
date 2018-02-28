<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
 */

// Article routes

//BE

// This SHOULD be the route and method that returns FULL article data with bookmark bar stuff
Route::get('/article/{articleId}/{partnerId}', 'ArticleController@fetchArticle');

// This route ONLY returns meta tag data for the article module (main-content.blade.php)
Route::get('/metatags/{articleId}/{partnerId}', 'ArticleController@fetchHeader');

//NOTE: these two routes are for sportsloyal.com and would not appear on partner sites since they have their own disclaimer
Route::get('/disclaimer/{partnerId}', 'ArticleController@fetchDisclaimerArticle');
Route::get('/metadisclaimer/{partnerId}', 'ArticleController@fetchDisclaimerHeader');
// Error page
Route::get('/error-page/{partnerId}', 'ArticleController@fetchErrorPage');
//CLIENT

// This route ONLY returns meta tag data for the article module (main-content.blade.php)
Route::get('/client/metatags/{articleId}/{partnerId}', 'ArticleController@fetchHeaderClient');

// This route ONLY returns article data for the article module (main-content.blade.php)
Route::get('/client/article-simple/{articleId}', 'ArticleController@fetchSimpleArticle');

// This route ONLY returns data for the related module (related.blade.php)
Route::get('/client/related/{articleId}/{partnerId}', 'ArticleController@fetchRelatedArticles');

// Passback routes
Route::get('/passback/{partner_id}/{event}/{size}/{rand}/{base_url}/', 'ArticleController@getPassback')
    ->where('base_url', '(.*)'); // allows the base_url parameter to contain encoded slashes

//
// TEST ROUTES - TEMPORARY AND SHOULD BE RENAMED/REMOVED FOR PRODUCTION
//

// This route returns data for article with bookmark bar (article.blade.php)
// This route SHOULD be a testing route. it has test in the name.
Route::get('/test-page/{articleId}/{partnerId}', 'ArticleController@fetchTestPage');

// Checksum version of above function (article.blade.php)
Route::get('/test-checksum/{articleId}/{partnerId}', 'ArticleController@fetchTestPageWithCheckSum');



// THESE ARE NOT REQUIRED FOR PROD. LEFT COMMENTED FOR DEVELOPER UTILITY
//Route::get('/', 'ArticleController@getArticle');
//Route::get('fetch-related/{articleId}/{partnerId}/{urlPattern?}', 'ArticleController@fetchRelatedArticles');
//Route::get('article-fetch/{articleId}', 'ArticleController@fetchById');
//Route::get('fetch-latest/{articleId}/{partnerId}/{urlPattern?}', 'ArticleController@fetchLatest');
//Route::get('/article-header-content/{articleId}', 'ArticleController@fetchForHeaderById');
