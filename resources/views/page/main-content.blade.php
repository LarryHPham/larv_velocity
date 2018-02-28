<div class="article" id="article_page" data-id="{{$articleData['article_id']}}">
  <div class="article-container">
    @if(!is_null($articleData))
    @include ('module.title')
    @include ('module.main-image')
    @include ('module.content')
    @endif
  </div>
</div>
