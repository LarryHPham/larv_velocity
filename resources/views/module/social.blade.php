<div id="dvp-social" class="dvp_social-auto-scroll">
    <div class="dvp_social" onclick="copyURL(event)" id="share-link">
        <div>
            {!! $_ENV['LINK'] !!}
        </div>
    </div>
    <a href="#" class="dvp_social" onclick="shareUrl('twitter', event);return false;">
        <div>
            {!! $_ENV['TWITTER'] !!}
        </div>
    </a>
    <a href="#" class="dvp_social" onclick="shareUrl('facebook', event);return false;">
        <div>
            {!! $_ENV['FACEBOOK'] !!}
        </div>
    </a>
    <a href="#" class="dvp_social" onclick="shareUrl('pinterest', event);return false;">
        <div>
            {!! $_ENV['PINTEREST'] !!}
        </div>
    </a>
</div>
