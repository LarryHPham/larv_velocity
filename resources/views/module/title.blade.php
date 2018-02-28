<div class="article-title">
    {!! $articleData['title'] !!}
</div>
<div class="article-byline">
    By: {!! $articleData['author'] !!} on {!! date('F d, Y', $articleData['publication_date']) !!}
    at {!! date('g:i A', $articleData['publication_date']) !!} ET
</div>