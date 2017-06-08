;(function () {
    var containerEl = document.querySelector('#container');
    ['hackerNews', 'github', 'medium', 'quora', 'lobsters', 'productHunt', 'echojs', 'brainpickings', 'smashingMagazine', 'csstricks', 'sidebar']
    .map(source => {
        var list = '<div class="card"><h2 class="title">' + camelCaseToTitleCase(source) + '</h2><ul class="list">'
        fetch('https://cdnapi.pnd.gs/v2/feeds?limit=15&page=1&sort=popular&sources=' + source)
            .then(res => res.json())
            .then(json => {
                json.map(i => {
                    list += '<li class="item"><a class="url" href="' +
                        i.source.absoluteUrl + '" target="_blank">' +
                        i.title + '</a><span class="description">' +
                        i.description + '</span> <small class="footer">' +
                        (i.source.likesCount ? '<span class="point">' + i.source.likesCount + '</span> points | ' : '') +
                        timeAgo(i.source.createdAt) +
                        (i.source.authorUrl ? (' by <a class="author-url" href="' +
                        i.source.authorUrl + '" target="_blank">' +
                        (i.source.authorName ? i.source.authorName : i.source.authorUrl.split('/').pop()) + '</a></small></li>') : '')
                })

                list += '</ul></div>'

                containerEl.innerHTML += list
            })
    })

    function camelCaseToTitleCase(camelCase) {
        if (camelCase == null || camelCase == "") {
            return camelCase;
        }

        camelCase = camelCase.trim();
        var newText = "";
        for (var i = 0; i < camelCase.length; i++) {
            if (/[A-Z]/.test(camelCase[i]) &&
                i != 0 &&
                /[a-z]/.test(camelCase[i - 1])) {
                newText += " ";
            }
            if (i == 0 && /[a-z]/.test(camelCase[i])) {
                newText += camelCase[i].toUpperCase();
            } else {
                newText += camelCase[i];
            }
        }

        return newText;
    }

    function timeAgo(datetime) {

        var templates = {
            prefix: "",
            suffix: " ago",
            seconds: "less than a minute",
            minute: "about a minute",
            minutes: "%d minutes",
            hour: "about an hour",
            hours: "about %d hours",
            day: "a day",
            days: "%d days",
            month: "about a month",
            months: "%d months",
            year: "about a year",
            years: "%d years"
        };
        var template = function (t, n) {
            return templates[t] && templates[t].replace(/%d/i, Math.abs(Math.round(n)));
        };

        var timer = function (time) {
            if (!time) return;
            time = time.replace(/\.\d+/, ""); // remove milliseconds
            time = time.replace(/-/, "/").replace(/-/, "/");
            time = time.replace(/T/, " ").replace(/Z/, " UTC");
            time = time.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"); // -04:00 -> -0400
            time = new Date(time * 1000 || time);

            var now = new Date();
            var seconds = ((now.getTime() - time) * .001) >> 0;
            var minutes = seconds / 60;
            var hours = minutes / 60;
            var days = hours / 24;
            var years = days / 365;

            return templates.prefix + (
                seconds < 45 && template('seconds', seconds) || seconds < 90 && template('minute', 1) || minutes < 45 && template('minutes', minutes) || minutes < 90 && template('hour', 1) || hours < 24 && template('hours', hours) || hours < 42 && template('day', 1) || days < 30 && template('days', days) || days < 45 && template('month', 1) || days < 365 && template('months', days / 30) || years < 1.5 && template('year', 1) || template('years', years)) + templates.suffix;
        };
        return timer(datetime);
    }

})()