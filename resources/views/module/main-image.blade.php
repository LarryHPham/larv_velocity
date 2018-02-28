<div class="article-image">
  <div class="article-image-container" >
    <div class="article-image-overlay"></div>
    <img src="{!! $articleData['image_url'] !!}?width=800" />
    <span class="article-image-tag">{!! $articleData['title'] !!}</span>
  </div>
</div>

<div class="article-share_wrapper" id="show-share-wrapper">
    @include('module.social-mobile')
</div>

<script>
    function showShareWrapper(event) {
        event.stopPropagation();
        var shareWrapper = document.getElementById('show-share-wrapper');
        shareWrapper.style.display = 'block';
    }
    document.getElementById('share-mobile-wrapper').addEventListener("click", showShareWrapper, false);
</script>
