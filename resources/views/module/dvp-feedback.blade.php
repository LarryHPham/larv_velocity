<div class="dvp-feedback-container" id="snt-feedback" onclick="createDVPFeedback()">
    <div class="dvp-feedback-content">
        <div class = "dvp-feedback-text"> What did you think of this article? Give us your feedback and help us to get smarter. </div>
        <div class = "dvp-feedback-plus">
            <div class="dvp-feedback-plus-text">GIVE FEEDBACK</div>
            <div class="dvp-feedback-plus-icon">
                {!! $_ENV['ADDICON'] !!}
            </div>
        </div>
    </div>
</div>

<script>
    function createDVPFeedback() {
        var feedbackOverlay = document.createElement('div');
        feedbackOverlay.id = "feedback-overlay";
        feedbackOverlay.className = "dvp-feedback-overlay";
        feedbackOverlay.innerHTML = "<div id = \" fb-dvp-close\" class=\"dvp-feedback-overlay-closebtn\" onclick=\"closeDVPFeedback()\">\n" +
            "    {!! $_ENV['GREYCLOSEICON'] !!}\n" +
            "</div>\n" +
            "<iframe src=\"https://sntmedia.typeform.com/to/GDI4MA\" width=\"100%\" height=\"100%\"></iframe>";
        document.body.appendChild(feedbackOverlay);
    }
    function closeDVPFeedback() {
        var feedbackOverlay = document.getElementById("feedback-overlay");
        document.body.removeChild(feedbackOverlay);
    }
</script>