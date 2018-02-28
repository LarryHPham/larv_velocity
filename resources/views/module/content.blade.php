<div class="article-content">
    @php
        $i = 1;
        $article = $articleData['content'];
    @endphp
    @if(is_array($article))
        @foreach ($article as $content)
            @if(!is_array($content))
                <div class="article-paragraph">
                    {!! $content !!}
                </div>
                @if ($loop->last && $articleData['source'] == 'snt_ai')
                    <div class="article-data-byline">Article written with data from {{ $articleData['data_source'] }}</div>
                @endif
                @if($i % 3 == 0 || ($loop->last && $i < 3))
                    @include ('module.ad')
                @endif
                @if($i == 3)
                    @include ('module.video')
                @endif
                @php ($i++)
            @endif
        @endforeach
    @endif
    <div class="dvp-feedback-wrapper">
        @include('module.dvp-feedback')
    </div>
    @include('module.related')

</div>