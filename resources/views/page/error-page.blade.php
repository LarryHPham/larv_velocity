@extends ('layout.layout_error')

@section('dvperror')
    <div class="error-bg">
        <div class="error-bg_graphic">
            <img src="//images.synapsys.us/01/fallback/error/2017/11/error.svg"/>
        </div>
        <div class="error-bg_text">
            THE SITE ISN’T WORKING RIGHT NOW…
            PLEASE CHECK BACK AGAIN LATER.
        </div>
        <div class="error-bg_ad" id = "error-page-ad">
            <script type="application/javascript">
                var partner_info  = JSON.parse('{!! $partnerAds !!}');

                var zoneMediumRectangle = partner_info['adzone3'];
                var zoneLeaderboard = partner_info['adzone3'];
                var adError = document.getElementById("error-page-ad");
                var mediaCheck = matchMedia('(min-width:320px)');

                var includeAds = function (mediaQueryList) {
                    var screenWidth = document.body.offsetWidth;
                    /*check if mobile ad is already existing when resizing in order to avoid destroying and rebuilding mobile ads while resizing in mobile screen size */
                    var checkMobileAd = document.getElementById("mobile-ad-wrapper");
                    /*check if desktop ad is already existing when resizing in order to avoid destroying and rebuilding desktop ads while resizing in desktop screen size */
                    var checkDesktopAd = document.getElementById("leaderboard-ad-wrapper");

                    if (mediaQueryList.matches && screenWidth<768 && checkMobileAd === null) {
                        var mobileAdDiv = document.createElement('div');
                        mobileAdDiv.id="mobile-ad-wrapper";
                        var checkwrap = document.getElementById("leaderboard-ad-wrapper");
                        if(checkwrap!==null) {
                            while (adError.hasChildNodes()) {
                                adError.removeChild(adError.lastChild);
                            }
                        }
                        var addErrorAdScript = document.createElement('script');
                        addErrorAdScript.src = zoneMediumRectangle;
                        adError.appendChild(mobileAdDiv);
                        mobileAdDiv.appendChild(addErrorAdScript);

                    } else if (mediaQueryList.matches && screenWidth>=768 && checkDesktopAd === null) {
                        var desktopAdDiv = document.createElement('div');
                        desktopAdDiv.id="leaderboard-ad-wrapper";
                        var checkwrap = document.getElementById("mobile-ad-wrapper");
                        if(checkwrap!==null) {
                            while (adError.hasChildNodes()) {
                                adError.removeChild(adError.lastChild);
                            }
                        }
                        var addErrorAdScript = document.createElement('script');
                        addErrorAdScript.src = zoneLeaderboard;
                        adError.appendChild(desktopAdDiv);
                        desktopAdDiv.appendChild(addErrorAdScript);
                    }
                };
                includeAds(mediaCheck);
                window.addEventListener('resize', function(event){
                    includeAds(mediaCheck);
                });
            </script>
        </div>

    </div>
@endsection
