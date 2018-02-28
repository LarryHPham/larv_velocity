<?php

namespace App\Traits;

trait ArticleTrait
{
    /**
     * build the basic query for articles
     * @return Eloquent Query
     */
    private function basicArticleQuery()
    {
        $fields = [
            $this->articleLibraryDB->raw('abs(unix_timestamp()-publication_date) as `time_delta`'),
            'publication_date',
            'a.id as article_id',
            'a.title',
            'a.image_source as article_image',
            'a.image_url',
            'a.passback_base_url',
        ];

        // an array of sources in case at some point we open it up to more than just snt_ai
        $sources = [
            'snt_ai',
        ];

        $basicArticleQuery = $this->articleLibraryDB
            ->table('article AS a')
            ->select($fields)
            ->leftJoin('category_article_mapper as cam', 'cam.article_id', '=', 'a.id')
            ->leftJoin('category_lookup as cl', 'cl.id', '=', 'cam.category_lookup_id')
            ->leftJoin('sub_category_article_mapper AS scam', 'a.id', '=', 'scam.article_id')
            ->leftJoin('sub_category_lookup AS scl', 'scam.sub_category_lookup_id', '=', 'scl.id')
            ->where('cl.category_name', '=', 'sports')
            ->where('a.ready_to_publish', '=', 'true')
            ->whereRaw('LENGTH(a.image_url) > 0')
            ->whereIn('source', $sources)
            ->orderBy('time_delta');

        return $basicArticleQuery;
    }

    /**
     * Currently a placeholder function. Eventually, this will query the placement
     * database to find partner-specific data that is required for article URL
     * generation.
     *
     * @param $partnerId
     * @return array
     */
    private function getPlacementInfo($partnerId)
    {
        //TODO needs to have a global for this to fill in for all future links
        // $proto = isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https' ? 'https://' : 'http://';

        $fields = [
              'base_url',
              'relative_url',
              'ad1_pl_id',
              'ad1_url',
              'ad2_pl_id',
              'ad2_url',
              'ad3_pl_id',
              'ad3_url',
              'ad4_pl_id',
              'ad4_url',
              'velocity_config'
        ];

        $placementQuery = $this->sntLiveDB
            ->table('velocity_config')
            ->select($fields)
            ->where('p_id', '=', $partnerId)
            ->orderBy('updated_at', 'desc')
            ->first();

        //seperate base & relate and partner ads into 2 seperate objects for organizations
        if(is_null($placementQuery)){
          return null;
        }
        $placementInfo = [
              'partner_data'  =>[
                  'base_url'      => $placementQuery->base_url,
                  'relative_url'  => $placementQuery->relative_url,
              ],
              'partner_ads'   =>[
                  'adzone1'       => $placementQuery->ad1_url,
                  'adzone2'       => $placementQuery->ad2_url,
                  'adzone3'       => $placementQuery->ad3_url,
                  'adzone4'       => $placementQuery->ad4_url
              ]
        ];

        return $placementInfo;
    }

    /**
     * Takes placement info and uses it to generate a partner-specific url.
     *
     * @param $articleId
     * @param $partnerId
     * @param $baseUrlPattern the base URL pattern used by this partner. should have ### where the partnerId goes and *** where the articleId goes
     * @param $clickThrough clickthrough url
     * @return string
     */
    private function buildClickUrl($articleId, $partnerId, $baseUrlPattern, $clickThrough = '')
    {
        return $clickThrough . str_replace(
                ['[ARTICLE_ID]'],
                [$partnerId, $articleId],
                $baseUrlPattern
            );
    }

    /**
     * builds the url to an article for the passback ad. includes additional UTM tracking info for google analytics
     * @param  int $articleId
     * @param  int $partnerId
     * @param  string $baseUrlPattern
     * @param  string $clickThrough
     * @param  string $size the size of the banner being used, ex 300x250. for UTM info
     * @return string                 the full clickable URL to the passback article
     */
    private function buildClickUrlForPassback($articleId, $partnerId, $baseUrlPattern, $clickThrough = '', $size)
    {
        return implode('&', [
            $this->buildClickUrl($articleId, $partnerId, $baseUrlPattern, $clickThrough),
            'utm_source=velocity_passback_1.0',
            'utm_medium=banner',
            'utm_campaign=' . $size,
            'utm_content=' . $articleId,
        ]);
    }

    /**
     * checks for requested article. if does not exist, sends articleID of latest article.
     * if no articles exist, throws an error.
     * @param $articleId
     * @param bool $isRedirect
     * @return \Illuminate\Http\RedirectResponse|int
     */
    private function validateArticle($articleId, $isRedirect = false)
    {
        // check that the requested article exists. if so, return true
        $article = $this->basicArticleQuery()
            ->where('a.id', '=', $articleId)
            ->first();

        // found the article, so just send the article_id back
        if (!is_null($article)) {
            return $articleId;
        }

        // did not find the requested article. send the article_id of the latest article instead
        $latestArticleId = $this->getLatestArticleId();
        if (is_null($latestArticleId)) {
            // if no articles at all exist, throw an exception
            throw new BadRequestHttpException("No articles were found.");
        }

        // if we got here, we either have a good latest article id or an invalid id or no id at all was supplied
        // so either the latestArticleId needs to be returned or return 0 so that the controller knows that it needs to redirect
        return $isRedirect === true ? 0 : $latestArticleId;
    }

    /**
     * gets the articleId of the latest published article. used as a fallback when invalid articleId is provided.
     * @return int the articleId of the most recently published article
     */
    private function getLatestArticleId()
    {
        $article = $this->basicArticleQuery()
            ->orderBy('publication_date', 'desc')
            ->first();

        return !is_null($article) ? $article->article_id : null;
    }
}
