(function (e) {
    e.responsive = function (event) {
        if (!( "querySelector" in e.document ) || !( "getComputedStyle" in e )) {
            return;
        }
        var responsiveClass = event && event.selector || ".module";
        var modules = e.document.querySelectorAll(responsiveClass);
        for (var i = 0; i < modules.length; i++) {
            var container = modules[i],
                setBreakpoints = e.getComputedStyle(container, ":before").getPropertyValue("content"),
                widthsArr = setBreakpoints.replace(/[^\d ]/g, "").split(" "),
                partnerWidth = container.clientWidth,
                containerMinWidths = [],
                containerMaxWidths = [];
            for (var j = 0; j < widthsArr.length; j++) {
                if (e.parseFloat(widthsArr[j]) <= partnerWidth) {
                    containerMinWidths.push(widthsArr[j]);
                }
            }
            for (var k = 0; k < widthsArr.length; k++) {
                if (e.parseFloat(widthsArr[k]) >= partnerWidth) {
                    containerMaxWidths.push(widthsArr[k]);
                }
            }
            container.setAttribute("data-min-width", containerMinWidths.join(" "));
            container.setAttribute("data-max-width", containerMaxWidths.join(" "));
        }
    };
})(this);
setEventListeners(window, 'load resize', window.responsive);