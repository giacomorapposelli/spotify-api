(function () {
    var moreUrl;
    var baseUrl = "https://spicedify.herokuapp.com/spotify";
    var results;

    $("#submit-btn").on("click", function () {
        var userInput = $("input[name=user-input]").val();
        var albumOrArtist = $("select").val();

        $.ajax({
            url: baseUrl,
            method: "GET",
            data: {
                query: userInput,
                type: albumOrArtist,
            },
            success: function (data) {
                data = data.albums || data.artists;
                if (!data.items.length) {
                    results = '<div>No results for "' + userInput + '"</div>';
                } else {
                    results =
                        '<div>Search results for: "' + userInput + '"</div>';
                }
                $("#results-info").html(results);
                generateResultsHtml(data.items);
                $("#results-container").html(generateResultsHtml(data.items));
                setNextUrl(data.next);
                infCheck();
            },
        });
    });

    function infCheck() {
        var reachedBottom =
            $(window).height() + $(window).scrollTop() == $(document).height();

        if (!reachedBottom) {
            setTimeout(infCheck, 500);
        } else {
            $.ajax({
                url: moreUrl,
                method: "GET",
                success: function (data) {
                    data = data.albums || data.artists;
                    setNextUrl(data.next);
                    $("#results-container").append(
                        generateResultsHtml(data.items)
                    );
                    infCheck();
                },
            });
        }
    }

    $("#more").on("click", function () {
        $.ajax({
            url: moreUrl,
            method: "GET",
            success: function (data) {
                data = data.albums || data.artists;
                setNextUrl(data.next);
                $("#results-container").append(generateResultsHtml(data.items));
            },
        });
    });

    function setNextUrl(nextUrl) {
        if (nextUrl != null) {
            moreUrl =
                nextUrl &&
                nextUrl.replace("https://api.spotify.com/v1/search", baseUrl);
            $("#more").css({ display: "block" });
        } else {
            $("#more").css({ display: "none" });
        }
    }

    function generateResultsHtml(spotifyData) {
        var imgUrl = "/default.jpg";
        var html = "";
        for (var i = 0; i < spotifyData.length; i++) {
            if (spotifyData[i].images.length > 0) {
                imgUrl = spotifyData[i].images[0].url;
            }
            if (spotifyData[i].name.length > 15) {
                spotifyData[i].name = spotifyData[i].name.slice(0, 15) + "...";
            }

            html +=
                '<div class="artist-container"><a href="' +
                spotifyData[i].external_urls.spotify +
                '"><img src="' +
                imgUrl +
                '" class="artist-img"><p>' +
                spotifyData[i].name +
                "</p></a></div>";
        }
        return html;
    }
})();
