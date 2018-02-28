@extends ('master') <!--TODO used as test wrapper when on partner sites REMOVE-->
@include('module.meta-tags')
@section ('page')
    <script type="text/javascript">
    var partner_info  = JSON.parse('{!! $partnerAds !!}');
    var vp_env_url    = '{!! $_ENV['APP_URL'] !!}';
    var relatedId     = '{{$articleData['article_id']}}';
    var partnerId     = '{{$partnerId}}';
    </script>
    <div class="content module module-resize" id="content">
        <div class="content-bookmark">@yield('bookmark')</div>
        <div class="content-article" id="dvp-article">
            <div class="article-swipe_indicators" id="dots">
                <div class="article-dots" id="image-dots">
                  @for($i = 0; $i < 10; $i++)
                    <div class="dots"></div>
                  @endfor
                </div>
                <div class="article-share_icon" id = "share-mobile-wrapper">
                    {!! $_ENV['SHAREICON'] !!}
                </div>
            </div>
            @yield('article')
            <div class="adzone_content">
                <div id='adZone2'></div>
                <div id='adZone3'></div>
            </div>
        </div>
        <div class="content-social">@yield('social')</div>
        @include('module.sticky-ad-mobile')
    </div>
    <script src="{!! $_ENV['APP_URL'] !!}/client/js/app.js"></script>
@endsection
