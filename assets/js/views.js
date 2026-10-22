(function () {
    "use strict";

    var API = "/api/views";

    function fmt(n) {
        if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
        if (n >= 10000) return Math.round(n / 1000) + "k";
        if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
        return String(n);
    }

    function label(n) {
        return fmt(n) + (n === 1 ? " view" : " views");
    }

    var EYE =
        '<svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
        '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>';

    var post = location.pathname.match(/\/blogs\/(blog-[^/]+)\/?$/);
    var meta = document.querySelector("article .post-meta");
    if (post && meta) {
        fetch(API + "/" + post[1], { method: "POST", credentials: "omit" })
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (data) {
                if (!data || typeof data.count !== "number" || data.count < 1) return;
                var sep = document.createElement("span");
                sep.className = "meta-sep";
                sep.textContent = "·";
                var item = document.createElement("span");
                item.className = "meta-item meta-views";
                item.innerHTML = EYE;
                item.appendChild(document.createTextNode(" " + label(data.count)));
                meta.append(sep, item);
            })
            .catch(function () {});
    }

    var rows = Array.prototype.slice.call(document.querySelectorAll(".ls-row"));
    if (rows.length) {
        var ids = rows.map(function (row) {
            var m = (row.getAttribute("href") || "").match(/(blog-[^/]+)\/?$/);
            return m ? m[1] : null;
        });
        var wanted = ids.filter(Boolean);
        if (!wanted.length) return;
        fetch(API + "?posts=" + encodeURIComponent(wanted.join(",")), { credentials: "omit" })
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (counts) {
                if (!counts) return;
                rows.forEach(function (row, i) {
                    var n = counts[ids[i]];
                    var target = row.querySelector(".ls-meta");
                    if (!target || typeof n !== "number" || n < 1) return;
                    var v = document.createElement("span");
                    v.className = "ls-views";
                    v.textContent = label(n);
                    target.appendChild(v);
                });
            })
            .catch(function () {});
    }
})();
