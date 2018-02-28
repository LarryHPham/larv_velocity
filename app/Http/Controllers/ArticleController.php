<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Traits\ArticleTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use HTMLMin\HTMLMin\Facades\HTMLMin;

class ArticleController extends Controller
{
    use ArticleTrait;

    protected $articleLibraryDB;
    protected $articleDB;
    protected $sntLiveDB;
    protected $request;

    /**
     * ArticleController constructor.
     */
    public function __construct(Request $request)
    {
        $this->articleLibraryDB = DB::connection('article_library');
        $this->articleDB        = new Article();
        $this->sntLiveDB        = DB::connection('synapsys-2');
        $this->request          = $request; // gets the querystring
    }

    /*******************************************************************
     * TEST PAGES USED ONLY WITHIN VELOCITY PAGES REPO NOT FOR EXTERNAL USE
     *******************************************************************/

    /**
     * Fetches data for a specific article, fetches data for the
     * bookmark-bar (latest articles), and injects them into
     * the appropriate view.
     *
     * @param $articleId
     * @param $partnerId
     * @return mixed
     */
    // TEST PAGE WITH Head and Body
    public function fetchTestPage($articleId, $partnerId)
    {
        // check that the articleID provided is valid
        $articleId = $this->validateArticle($articleId, true);
        if ($articleId === 0) {
            $redirect = redirect()->action('ArticleController@fetchTestPage', [
                'articleId' => $this->getLatestArticleId(),
                'partnerId' => $partnerId,
            ]);
            return $redirect;
        }

        $placementInfo = $this->getPlacementInfo($partnerId);
        if (is_null($placementInfo)) {
            // TODO throw a more specific type of Exception if possible
            throw new \Exception("Error invalid partner id " . $partnerId . " entered.");
        }

        $latest  = $this->fetchLatest($articleId, $partnerId);
        $latest  = $this->prepareDataSet($latest);
        $article = $this->fetchById($articleId);
        $header  = $this->fetchMetaTags($articleId, $partnerId);

        $data = [
            "articleData"   => $article,
            "articleLatest" => $latest,
            "partnerAds"    => json_encode($placementInfo['partner_ads']),
            "imageUrl"      => env('IMAGE_BASE_URL', "//images.synapsys.us"),
            "metaData"      => $header,
            "partnerId"     => $partnerId,
        ];
        $view = View::make('page.test', $data);
        return $view;
    }

    /*******************************************************************
     * END OF TEST PAGES
     *******************************************************************/

    /*******************************************************************
     * API CALLS FOR PARTNERS
     *******************************************************************/

    /**
     * Fetches data for a specific article, fetches data for the
     * bookmark-bar (latest articles), and injects them into
     * the appropriate view.
     *
     * @param $articleId
     * @param $partnerId
     * @return mixed
     */
    public function fetchArticle($articleId, $partnerId)
    {
        // check that the articleID provided is valid
        $articleId = $this->validateArticle($articleId, true);
        if ($articleId === 0) {
            $redirect = redirect()->action(
                'ArticleController@fetchArticle',
                [
                'articleId' => $this->getLatestArticleId(),
                'partnerId' => $partnerId]
            );
            return $redirect;
        }

        $placementInfo = $this->getPlacementInfo($partnerId);
        if (is_null($placementInfo)) {
            // TODO throw a more specific type of Exception if possible
            throw new \Exception("Error invalid partner id " . $partnerId . " entered.");
        }

        $latest  = $this->fetchLatest($articleId, $partnerId);
        $latest  = $this->prepareDataSet($latest);
        $article = $this->fetchById($articleId);

        $data = [
            "articleData"   => $article,
            "partnerAds"    => json_encode($placementInfo['partner_ads']),
            "articleLatest" => $latest,
            "imageUrl"      => env('IMAGE_BASE_URL', "//images.synapsys.us"),
            "partnerId"     => $partnerId,
        ];
        //return checksum using md5 hash and the content
        $view               = View::make('page.article', $data)->render();
        $view               = HTMLMin::html($view);
        $result['checksum'] = md5($view);
        $result['content']  = $view;

        return $result;
    }

    public function fetchDisclaimerArticle($partnerId)
    {
        $placementInfo = $this->getPlacementInfo($partnerId);
        if (is_null($placementInfo)) {
            // TODO throw a more specific type of Exception if possible
            throw new \Exception("Error invalid partner id " . $partnerId . " entered.");
        }

        $latest  = $this->fetchSimpleLatest($partnerId);
        $latest  = $this->prepareDataSet($latest);
        $article = $this->fetchDisclaimer();

        $data = [
            "articleData"   => $article,
            "partnerAds"    => json_encode($placementInfo['partner_ads']),
            "articleLatest" => $latest,
            "imageUrl"      => env('IMAGE_BASE_URL', "//images.synapsys.us"),
            "partnerId"     => $partnerId,
        ];

        //return checksum using md5 hash and the content
        $view               = View::make('page.article', $data)->render();
        $view               = HTMLMin::html($view);
        $result['checksum'] = md5($view);
        $result['content']  = $view;
        return $result;
    }

    public function fetchErrorPage($partnerId)
    {
        $placementInfo = $this->getPlacementInfo($partnerId);

        $data = [
            'partnerAds' => json_encode($placementInfo['partner_ads']),
        ];
        //return checksum using md5 hash and the content
        $view               = View::make('page.error-page', $data)->render();
        $view               = HTMLMin::html($view);
        $result['checksum'] = md5($view);
        $result['content']  = $view;
        return $result;
    }

    /**
     * Interpolates meta-tag data into the 'module.meta-tags' view.
     *
     * @param $articleId
     * @param $partnerId
     * @return mixed
     */
    public function fetchHeader($articleId, $partnerId)
    {
        // check that the articleID provided is valid
        $articleId = $this->validateArticle($articleId);

        $data['metaData'] = $this->fetchMetaTags($articleId, $partnerId);

        if (is_array($data['metaData'])) {
            $data['metaData']['client'] = false;
        } else {
            // Just return CSS if article doesn't exist
            $data                       = [];
            $data['metaData']['client'] = false;
        }

        $view               = View::make('module.meta-tags', $data)->render();
        $view               = HTMLMin::html($view);
        $result['checksum'] = md5($view);
        $result['content']  = $view;
        return $result;
    }

    /**
     * Interpolates meta-tag data into the 'module.meta-tags' view.
     *
     * @param $articleId
     * @param $partnerId
     * @return mixed
     */
    public function fetchDisclaimerHeader($partnerId)
    {
        $article          = $this->fetchDisclaimer();
        $data['metaData'] = $this->fetchMetaTags($article['article_id'], $partnerId);
        if (is_array($data['metaData'])) {
            $data['metaData']['client'] = false;
        } else {
            // Just return CSS if article doesn't exist
            $data                       = [];
            $data['metaData']['client'] = false;
        }

        $view               = View::make('module.meta-tags', $data)->render();
        $view               = HTMLMin::html($view);
        $result['checksum'] = md5($view);
        $result['content']  = $view;
        return $result;
    }

    /*******************************************************************
     * END OF API CALLS FOR PARTNERS
     *******************************************************************/

    /*******************************************************************
     * CLIENT API CALLS FOR CLIENT SIDE
     *******************************************************************/

    /**
     * Interpolates meta-tag data into the 'module.meta-tags' view. CLIENT SIDE mainly used to determine what gets returned on client compared to server
     *
     * @param $articleId
     * @param $partnerId
     */
    public function fetchHeaderClient($articleId, $partnerId)
    {
        // check that the articleID provided is valid
        $articleId = $this->validateArticle($articleId);

        $data['metaData']           = $this->fetchMetaTags($articleId, $partnerId);
        $data['metaData']['client'] = true;

        $view              = View::make('module.meta-tags', $data)->render();
        $view              = HTMLMin::html($view);
        $result['content'] = $view;
        return $result;
    }

    /**
     * Fetches data for a single article and injects it into
     * the appropriate view.
     *
     * @param $articleId
     * @return mixed
     */
    public function fetchSimpleArticle($articleId)
    {
        // check that the articleID provided is valid
        $articleId = $this->validateArticle($articleId);

        $data['articleData'] = $this->fetchById($articleId);

        $view              = View::make('page.main-content', $data)->render();
        $view              = HTMLMin::html($view);
        $result['content'] = $view;
        return $result;
    }

    /**
     * Given an article ID, retrieves basic metadata for 'related' articles. Generates urls based
     * on article-id/partner-id combination. Requires placement info array to build urls.
     * A user can either pass in placement info or API will query it directly from partner-id.
     *
     * @param $articleId
     * @param $partnerId
     * @param null $placementInfo
     * @return mixed
     * @throws \Exception
     */
    public function fetchRelatedArticles($articleId, $partnerId, $placementInfo = null)
    {
        // TODO create a PlacementInfo object/schema? Might be good to standardize what we
        // are talking about w.r.t placement info.

        // check that the articleID provided is valid
        $articleId = $this->validateArticle($articleId);

        if (is_null($placementInfo)) {
            $placementInfo = $this->getPlacementInfo($partnerId);
        }

        // This is to protect against SQL injection
        $articleId = (integer) $articleId;
        if (!is_integer($articleId) || !($articleId > 0)) {
            // TODO throw a more specific type of Exception if possible
            throw new \Exception("Hey, what's the big idea pal? Only integers article-ids allowed.");
        }

        $sql = "SELECT article_id, title, image_url
                FROM
                    (SELECT COUNT(*) AS counter, article_id
                        FROM keyword_article_mapper
                        WHERE keyword_lookup_id IN
                                (SELECT keyword_lookup_id
                                FROM keyword_article_mapper
                                WHERE article_id = $articleId)
                        AND article_id != $articleId
                        GROUP BY article_id
                        ORDER BY counter DESC
                    LIMIT 100) b
                    LEFT JOIN article a ON a.id = b.article_id
                    WHERE a.source = 'snt_ai'
                    AND a.ready_to_publish = 'true'
                    AND LENGTH(a.image_url) > 0
                    GROUP BY title
                    ORDER BY null
                    LIMIT 25";

        $articles             = $this->articleLibraryDB->select($sql);
        $partner_relative_url = $placementInfo['partner_data']['relative_url'];

        foreach ($articles as &$article) {
            unset($article->time_delta);
            $article->article_url = $this->buildClickUrl($article->article_id, $partnerId, $partner_relative_url);
        }

        $result['article_data'] = $articles;

        return $result;
    }

    /*******************************************************************
     * END OF CLIENT API CALLS FOR CLIENT SIDE
     *******************************************************************/

    /*******************************************************************
     * PASSBACK API CALL
     *******************************************************************/
    /**
     * takes the parameters passed in through the route and returns the HTML for the passback ad
     * @param  int $partnerId
     * @param  string /JSON $event     JSON object of the event
     * @param  string $size size of the ad being requested
     * @param  int $rand random integer from 0-49 for caching
     * @param  string $baseUrl base URL pattern for the partner. must contain the strings ### for partnerId and *** for articleId
     * @return view            builds the view which generates the HTML for the passback ad
     */
    public function getPassback($partnerId, $event, $size, $rand, $baseUrl)
    {
        header('Cache-Control: max-age=3600'); // 1 hour

        // grab whatever's been passed in as the event object and throw an exception if the JSON does not parse
        $eventJSON = json_decode($event, true);
        if ($eventJSON === null) {
            throw new UnprocessableEntityHttpException("Bad Request: \$event was not valid JSON. Contents follow: " . PHP_EOL . PHP_EOL . $event . PHP_EOL);
        }

        // grab the querystring variables and toss them into an array
        if ($this->request) {
            $inputs = $this->request->all();
        }

        // set category and clickthrough url if they were passed in
        $stringCategories = $inputs['category'] ?? 'fallback';
        $clickThrough     = $inputs['clickThrough'] ?? '';

        $arrayCategories = explode(",", $stringCategories);

        // dd(Cache::forget("PassbackArticles-{$stringCategories}"));
        // get the list of articles from the cache. if expired, get them from db
        $articles = Cache::remember("PassbackArticles-{$stringCategories}", env('ARTICLE_CACHE_MINUTES', 60), function () use ($arrayCategories) {
            return $this->fetchArticlesByCategory($arrayCategories, 50);
        });

        if ($articles->isEmpty()) {
            // throw new BadRequestHttpException("No articles found matching the provided criteria.");
            return view('layout.no_passback', []);
        }

        // if the rand passed in is greater than the number of articles returned, map the rand to another article
        if ($rand >= $articles->count()) {
            $rand = $rand % $articles->count();
        }
        $chosen_article = $articles[$rand];

        // build out the click URL of the passback
        $passback_url = $this->buildClickUrlForPassback(
            $chosen_article->article_id,
            $partnerId,
            $baseUrl,
            $clickThrough,
            $size
        );

        // build out the tracking javascript
        $tracking_js = $this->buildTrackingJS($event);

        // build image url
        $image_url = env('IMAGE_BASE_URL', "//images.synapsys.us") . $chosen_article->passback_base_url;

        // prepare data for the view
        $passbackData = [
            'image_url'    => $image_url,
            'passback_url' => $passback_url,
            'tracking_js'  => $tracking_js,
        ];

        // POW!!
        return view('layout.passback', $passbackData);
    }

    /**
     * builds the tracking javascript for insertion into the passback HTML
     * @param  JSON $event JSON event
     * @return string        javascript code with the event inserted
     */
    private function buildTrackingJS($event)
    {
        $tracking_js = <<<TRA
var tracker=function(){function e(e){var a="{{BASE_EVENT}}";a.event=e;var x=[],s=window,n=0,d=10;try{for(;n++<10&&s!==window.top;)s=s.parent,x.push(s)}catch(e){}a.messageId="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var a=16*Math.random()|0;return("x"===e?a:3&a|8).toString(16)}),t[a.messageId]=a;for(var r=0;r<x.length;r++)x[r].postMessage(a,"*")}function a(e){return"message"===e.type&&"object"==typeof e.data&&"string"==typeof e.data.messageId&&void 0!==t[e.data.messageId]&&(e.data.send=!0,e.source.postMessage(e.data,"*"),delete t[e.data.messageId],!0)}var t={};window.addEventListener("message",a,!1),e("passback_load");for(var x=document.getElementsByTagName("a"),s=0;s<x.length;s++)x[s].addEventListener("click",e.bind(void 0,"passback_click"));return{add:e}}();
TRA;

        $tracking_js = str_replace(
            '"{{BASE_EVENT}}"',
            $event,
            $tracking_js
        );

        return $tracking_js;
    }

    /*******************************************************************
     * PASSBACK API CALL
     *******************************************************************/

    /*******************************************************************
     * GLOBAL LARAVEL FUNCTIONS
     *******************************************************************/

    /**
     * Fetches meta-tag data (as an array) for interpolation into a view.
     *
     * @param $articleId
     * @param $partnerId
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */

    public function fetchMetaTags($articleId, $partnerId)
    {
        $data = $this->fetchForHeaderById($articleId);

        $placementInfo = $this->getPlacementInfo($partnerId);

        $partner_full_url = $placementInfo['partner_data']['base_url'] . $placementInfo['partner_data']['relative_url'];

        //base_url required due to a full url required to have a proper canonical url
        $data['article_url'] = $this->buildClickUrl($articleId, $partnerId, $partner_full_url);
        $data['image_url']   = env('IMAGE_BASE_URL', "//images.synapsys.us") . $data['image_url'];
        $data['client']      = false; // Quick and Dirty will need to be looked at again
        return $data;
    }

    /**
     * Returns a conglomeration of the most recently generated AI articles, and the
     * article with the ID requested.
     *
     * If the ID requested is already in the 'latest' data-set, it is moved to the
     * top of the Collection.
     *
     * If the ID is not present in the 'latest' data-set, it is retrieved and placed
     * at the top of the Collection, and the oldest article is removed.
     *
     * Returns a Collection of articles with 25 elements.
     *
     * @param int $articleId
     * @param int $partnerId
     * @param null $placementInfo
     * @param int $limit limit the number of articles returned
     * @return Collection
     */
    public function fetchLatest($articleId, $partnerId, $placementInfo = null, $limit = 25)
    {
        if (is_null($placementInfo)) {
            $placementInfo = $this->getPlacementInfo($partnerId);
        }

        $articles = $this->basicArticleQuery()
            ->limit($limit)
            ->get();

        $needsIdArticle = true;

        // look for the requested article in the returned set. if it's present,
        // make sure it's the top article.
        foreach ($articles as $index => $article) {
            if ($article->article_id == $articleId) {
                $needsIdArticle = false;
                unset($articles[$index]);
                $articles->prepend($article);
            }
        }
        // if the requested article is not present, go get it and prepend it to the stack.
        if ($needsIdArticle) {
            $articles = $this->prependTargetArticle($articles, $articleId);
        }

        $partner_relative_url = $placementInfo['partner_data']['relative_url'];

        foreach ($articles as &$article) {
            unset($article->time_delta);
            $article->article_url = $this->buildClickUrl($article->article_id, $partnerId, $partner_relative_url);
        }

        return $articles;
    }

    public function fetchSimpleLatest($partnerId)
    {
        $placementInfo = $this->getPlacementInfo($partnerId);

        $articles = $this->basicArticleQuery()
            ->limit(25)
            ->get();

        $partner_relative_url = $placementInfo['partner_data']['relative_url'];

        foreach ($articles as &$article) {
            unset($article->time_delta);
            $article->article_url = $this->buildClickUrl($article->article_id, $partnerId, $partner_relative_url);
        }

        return $articles;
    }

    /**
     * A helper function for fetchLatest(). Given a Collection of articles and an
     * article ID, this function retrieves article data for the given ID,
     * prepends it to the Collection, and removes the last element of
     * Collection.
     *
     * @param Collection $articles
     * @param $articleId
     * @return Collection
     */
    private function prependTargetArticle(Collection $articles, $articleId)
    {
        $article = $this->basicArticleQuery()
            ->where('a.id', '=', $articleId)
            ->first();
        if (is_null($article)) {
            // article ID provided is bad; redirect to most recent article
            return null;
        }

        $articles->pop();
        $articles->prepend($article);
        return $articles;
    }

    /**
     * Query the Article-Library API to get full article content for a single
     * article. Also adds in some data-points specific to Velocity-Pages.
     *
     * @param $articleId
     * @return mixed
     */
    private function fetchById($articleId)
    {
        $url  = env('ARTICLE_LIBRARY_FQDN') . "velocity-fetch/";
        $json = file_get_contents("{$url}{$articleId}");
        $data = json_decode($json, true);

        $data['video_url'] = null;
        $data['share_url'] = null;

        if (array_key_exists('image_url', $data)) {
            $data['image_url'] = env('IMAGE_BASE_URL', "//images.synapsys.us") . $data['image_url'];
        } else {
            $data['image_url'] = null; // TODO get a stock image
        }

        return $data;
    }

    private function fetchDisclaimer()
    {
        $url = env('ARTICLE_LIBRARY_FQDN') . 'velocity-disclaimer/';

        $json = file_get_contents("{$url}");
        $data = json_decode($json, true);

        $data['video_url'] = null;
        $data['share_url'] = null;

        foreach ($data['content'] as $index => $paragraph) {
            $data['content'][$index] = html_entity_decode($paragraph);
        }

        if (array_key_exists('image_url', $data)) {
            $data['image_url'] = env('IMAGE_BASE_URL', "//images.synapsys.us") . $data['image_url'];
        }

        return $data;
    }

    private function fetchForHeaderById($articleId)
    {
        $fields = [
            'id as article_id',
            'title',
            'author',
            'publisher',
            'image_url',
            'publication_date',
            'teaser',
        ];

        $article = Article::select($fields)
            ->whereRaw("(`source` = 'snt_ai' OR `source` = 'SNT Media')")
            ->where('id', "=", $articleId)
            ->get()
            ->first();

        $article->keywords = $this->fetchArticleKeywords($article);
        $article->teaser   = strip_tags($article->teaser);
        return $article->toArray();
    }

    // TODO clean this up to use query builder or model relationships...
    private function fetchArticleKeywords($article)
    {
        $id  = $article->article_id;
        $sql = "SELECT kl.keyword FROM article a
                LEFT JOIN keyword_article_mapper kam on kam.article_id = a.id
                LEFT JOIN keyword_lookup kl on kam.keyword_lookup_id = kl.id
                WHERE article_id = $id";
        $keywords = DB::connection('article_library')->select($sql);

        $result = [];
        foreach ($keywords as $keyword) {
            $result[] = $keyword->keyword;
        }
        return $result;
    }

    /**
     * queries the database for articles based on the provided category, defaulting to all articles
     * @param  array $categories the category(s) of articles to search for.
     * @param  int $limit how many articles to return
     * @return array           array of articles returned from db. each article is an Eloquent Collection object
     */
    public function fetchArticlesByCategory($categories, $limit)
    {
        if ($categories[0] == 'fallback') {
            $categoryArticleQuery = $this->fallbackArticleQuery();
        } else {
            $categoryArticleQuery = $this->basicArticleQuery();
            $categoryArticleQuery->whereIn('scl.sub_category_name', $categories);
            $categoryArticleQuery->whereNotNull('passback_base_url');
        }

        return $categoryArticleQuery
            ->limit($limit)
            ->get();
    }

    /**
     * Prepares data for interpolation into a view. Converts a Collection
     * into an array, and converts each element from an object to an
     * array.
     *
     * @param Collection $data
     * @return array
     */
    private function prepareDataSet(Collection $data)
    {
        $data = $data->toArray();
        foreach ($data as &$datum) {
            $datum = get_object_vars($datum);
        }
        return $data;
    }

    /**
     * build the fallback query for articles. This grabs all sport categories in a ranking system.
     * @return Eloquent Query
     */
    private function fallbackArticleQuery()
    {
        // If we ever do one category scl.sub_category_name IN ('nba','mlb','nfl','ncaam','ncaaf') for the $subQuerySqlWhere, then
        // we must run SET @row_num:=0, @cur_type:=''; before this query to ensure data integrity. For now this is ok.
        DB::statement("SET @row_num:=0, @cur_type:=''");

        $subQuerySqlWhere = "a.passback_base_url is not null AND a.ready_to_publish = 'true' AND length(a.image_url) > 0 and a.source = 'snt_ai'
                    AND scl.sub_category_name IN ('nba','mlb','nfl','ncaam','ncaaf') AND abs(unix_timestamp() - a.publication_date) <= 604800";

        $subQuery = DB::table('article as a')->selectRaw('a.publication_date, abs(unix_timestamp() - a.publication_date) as `time_delta`,
                        a.id as article_id,
                        a.title,
                        a.image_source as article_image,
                        a.image_url,
                        a.passback_base_url, scl.sub_category_name')
            ->leftJoin('sub_category_article_mapper as scam', 'a.id', '=', 'scam.article_id')
            ->leftJoin('sub_category_lookup as scl', 'scam.sub_category_lookup_id', '=', 'scl.id')
            ->whereRaw($subQuerySqlWhere, [])
            ->orderBy('scl.sub_category_name', 'ASC')
            ->orderBy('time_delta', 'ASC');

        $fallbackArticleQuery = $this->articleDB
            ->selectRaw(
                "publication_date, article_id, title, article_image, image_url, passback_base_url,
                    (
                        CASE sub_category_name
                        WHEN @cur_type
                        THEN @row_num := @row_num + 1
                        ELSE @row_num := 1 AND @cur_type := sub_category_name
                        END
                    ) + 1 as rank"
            )
            ->from(DB::raw(' ( ' . $subQuery->toSql() . ' ) as articles'))
            ->setBindings($subQuery->getBindings())
        // ->(DB::raw("(select @row_num:=0, @cur_type:='') as r"))
            ->havingRaw("rank < 50");

        return $fallbackArticleQuery;
    }
}
