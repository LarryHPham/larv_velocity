<div class="dvp_bookmark" id="dvp_bookmark">
  @if(!is_null($articleLatest))
  <div class="dvp_bookmark-image" id="dvp_bookmark-image">
    <img onerror="" src="{!! $articleData['image_url'] !!}?width=300" alt="" data-prev="" data-next="" data-view="true" style="opacity: 1">
    <img onerror="" src="{!! $articleData['image_url'] !!}?width=300" alt="" data-view="false" style="opacity: 0">
  </div>
  <div class="dvp_bookmark-current bg-white">
    <span class="dvp_represent">NOW READING</span>
    <div class="dvp_bookmark-title reading line-clamp line-clamp-2" id="current-title">
      {{ $articleLatest[0]['title'] }}
    </div>
  </div>
  <div class="dvp_bookmark-progressbar">
    <div class="dvp_bookmark-progressbar-percent" id="progressbar"></div>
  </div>
  <div class="dvp_bookmark-next">
    <span class="dvp_represent">UP NEXT</span>
  </div>
  <aside class="dvp_bookmark-container">
    <div class="dvp_bookmark-box">
      @for($i = 0; $i < count($articleLatest); $i++)
      <a href="{{$articleLatest[$i]['article_url']}}" data-id="{{$articleLatest[$i]['article_id']}}" class="" >
        <article class="dvp_bookmark-article">
          <header>
            <h1 class="dvp_bookmark-title line-clamp line-clamp-2" title="{{$articleLatest[$i]['title']}}">
              {{ $articleLatest[$i]['title'] }}
            </h1>
          </header>
        </article>

      </a>
      @endfor
    </div>
  </aside>
  @endif
  <div class="bottom_sticky" id="ad_space">
      <div class="adZone" id='adZone1'></div>
  </div>
</div>
