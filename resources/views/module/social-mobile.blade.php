<div class="dvp-shareicons" id="dvp-mobile-share">
    <div class="dvp-closesvg" onclick="closeModule(event)">
        {!! $_ENV['CLOSEICON'] !!}
    </div>
    <div class="dvp-share-allIcons">
        <div class="dvp_tooltip" id="dvp-tooltip"></div>
        <div class="dvp-each-icon" onclick="copyURL(event)" id="share-link">
            {!! $_ENV['LINK'] !!}
        </div>
        <a href="#" class="dvp-each-icon" onclick="shareUrl('twitter', event);return false;">
            {!! $_ENV['TWITTER'] !!}
        </a>
        <a href="#" class="dvp-each-icon" onclick="shareUrl('facebook', event);return false;">
            {!! $_ENV['FACEBOOK'] !!}
        </a>
        <a href="#" class="dvp-each-icon" onclick="shareUrl('pinterest', event);return false;">
            {!! $_ENV['PINTEREST'] !!}
        </a>
    </div>

</div>
