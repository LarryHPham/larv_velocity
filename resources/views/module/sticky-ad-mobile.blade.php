<div class="sticky_wrapper" id="sticky-wrap">

</div>

<script type="application/javascript">
    var stickyWrap = document.getElementById("sticky-wrap");
    var mediaCheck = matchMedia('(min-width:320px) and (max-width:550px)');
    var appendAds = function (mediaQueryList) {
        if (mediaQueryList.matches) {
            var addStickyAd = "<div class=\"sticky_wrapper-ad\" id=\"adZone4\">\n" +
                "        <div class=\"sticky_wrapper-close\" onclick=\"closeStickyAd()\">\n" +
                "            <div class=\"sticky_wrapper-close-icon\">\n" +
                "                {!! $_ENV['CLOSEICON'] !!}\n" +
                "            </div>\n" +
                "        </div>\n" +
                "    </div>";
            stickyWrap.innerHTML = addStickyAd;
        } else {
            while (stickyWrap.hasChildNodes()) {
                stickyWrap.removeChild(stickyWrap.lastChild);
            }
        }
    };

    appendAds(mediaCheck);
    mediaCheck.addListener(appendAds);

    function closeStickyAd() {
        var floatDVPAd = document.getElementById("sticky-wrap");
        var parentElement = floatDVPAd.parentNode;

        if (floatDVPAd !== null) {
            parentElement.removeChild(floatDVPAd);
        }
    }
</script>
