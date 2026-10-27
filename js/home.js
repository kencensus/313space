/* 313Space — Home, Browse and Search pages. */
(function () {
  window.Pages = window.Pages || {};
  var esc = Data.esc;

  function resultCellHTML(b) {
    return '<div class="biz-cell">' + Data.tileHTML(b, "md") +
      '<div class="biz-meta small">' +
      '<span class="biz-cat">' + esc(b.category) + '</span><br>' +
      esc(b.neighborhood) + '<br>' +
      '<span class="biz-price">' + esc(b.price) + '</span>' +
      '</div></div>';
  }

  function gridHTML(list) {
    return '<div class="biz-grid">' + list.map(resultCellHTML).join("") + '</div>';
  }

  function optionsHTML(values, allLabel) {
    return '<option value="">' + esc(allLabel) + '</option>' + values.map(function (v) {
      return '<option value="' + esc(v) + '">' + esc(v) + '</option>';
    }).join("");
  }

  function countLabel(n) { return n + (n === 1 ? " business" : " businesses"); }

  /* ---------------- Home ---------------- */
  Pages.home = function (app) {
    var list = Data.all();
    var cool = list.slice(0, 8);
    var nCount = Data.count();
    var nHoods = Data.neighborhoods().length;

    app.innerHTML =
      '<div class="home">' +
      '<div class="cols">' +
        '<div class="col-right home-main">' +
          '<div class="box home-welcome">' +
            '<div class="box-head">Welcome to 313Space!</div>' +
            '<div class="box-body">' +
              '<h1 class="home-title">313Space is a place for <span class="glitter">Detroit\'s independent businesses</span>.</h1>' +
              '<p>Every local business gets a profile with a Top 8 of other local businesses it vouches for. ' +
              'Take the quiz, land on a business that fits you, then click friend to friend to find your next spot.</p>' +
              '<p class="home-cta"><a class="btn-big" href="#/quiz">Find your Detroit Top 8: take the quiz</a></p>' +
            '</div>' +
          '</div>' +
          '<div class="box box-orange home-cool">' +
            '<div class="box-head">Cool New Businesses</div>' +
            '<div class="box-body">' +
              (cool.length
                ? '<div class="tile-grid">' + cool.map(function (b) { return '<div class="tile-cell">' + Data.tileHTML(b, "md") + '</div>'; }).join("") + '</div>'
                : '<p class="muted">No businesses yet.</p>') +
              '<p class="home-viewall"><a href="#/browse">View all ' + esc(countLabel(nCount)) + ' &raquo;</a></p>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="col-left home-side">' +
          '<div class="box home-numbers">' +
            '<div class="box-head">313Space by the numbers</div>' +
            '<div class="box-body">' +
              '<table class="mys"><tbody>' +
                '<tr><td class="lbl">Businesses</td><td class="val"><b>' + nCount + '</b></td></tr>' +
                '<tr><td class="lbl">Neighborhoods</td><td class="val"><b>' + nHoods + '</b></td></tr>' +
              '</tbody></table>' +
            '</div>' +
          '</div>' +
          '<div class="box home-ai">' +
            '<div class="box-head">How AI was used</div>' +
            '<div class="box-body">' +
              '<p><span class="badge badge-ai">AI</span> Claude wrote each About Me and suggested every Top 8 ahead of time, ' +
              'balanced so every business appears in at least 3 other Top 8s. Owners can replace the AI picks. No live AI calls.</p>' +
            '</div>' +
          '</div>' +
          '<div class="box home-links">' +
            '<div class="box-head">Cool links</div>' +
            '<div class="box-body small">' +
              '<a href="#/browse">Browse businesses</a><br>' +
              '<a href="#/search">Search by name or tag</a><br>' +
              '<a href="#/quiz">Take the quiz</a><br>' +
              '<a href="#/impact">See the impact</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '</div>';
  };

  /* ---------------- Browse ---------------- */
  Pages.browse = function (app, params) {
    params = params || {};
    var cats = Data.categories();
    var hoods = Data.neighborhoods();

    app.innerHTML =
      '<div class="browse">' +
      '<div class="box">' +
        '<div class="box-head">Browse Businesses</div>' +
        '<div class="box-body">' +
          '<form class="browse-filters" id="browseFilters">' +
            '<label>Category: <select id="browseCat">' + optionsHTML(cats, "All categories") + '</select></label> ' +
            '<label>Neighborhood: <select id="browseHood">' + optionsHTML(hoods, "All neighborhoods") + '</select></label> ' +
            '<button type="button" class="btn" id="browseClear">Clear</button>' +
          '</form>' +
          '<p class="browse-count small muted" id="browseCount" aria-live="polite"></p>' +
          '<div id="browseResults"></div>' +
        '</div>' +
      '</div>' +
      '</div>';

    var catSel = app.querySelector("#browseCat");
    var hoodSel = app.querySelector("#browseHood");
    var countEl = app.querySelector("#browseCount");
    var results = app.querySelector("#browseResults");

    if (params.category && cats.indexOf(params.category) !== -1) catSel.value = params.category;
    if (params.neighborhood && hoods.indexOf(params.neighborhood) !== -1) hoodSel.value = params.neighborhood;

    function update() {
      var c = catSel.value, h = hoodSel.value;
      var list = Data.all().filter(function (b) {
        return (!c || b.category === c) && (!h || b.neighborhood === h);
      }).sort(function (a, b) { return a.name.localeCompare(b.name); });
      countEl.textContent = "Showing " + countLabel(list.length) + (c || h ? " (filtered)" : "");
      results.innerHTML = list.length ? gridHTML(list) :
        '<p>No businesses match those filters yet. <a href="#/browse" id="browseReset">Show everyone</a></p>';
    }

    catSel.addEventListener("change", update);
    hoodSel.addEventListener("change", update);
    app.querySelector("#browseFilters").addEventListener("submit", function (e) { e.preventDefault(); update(); });
    app.querySelector("#browseClear").addEventListener("click", function () {
      catSel.value = ""; hoodSel.value = ""; update();
    });
    results.addEventListener("click", function (e) {
      if (e.target && e.target.id === "browseReset") {
        e.preventDefault(); catSel.value = ""; hoodSel.value = ""; update();
      }
    });
    update();
  };

  /* ---------------- Search ---------------- */
  Pages.search = function (app, params) {
    var q = String((params && params.q) || "").trim();
    var top = document.getElementById("searchInput");
    if (top) top.value = q;

    var list = Data.search(q).sort(function (a, b) { return a.name.localeCompare(b.name); });
    var body;
    if (!q) {
      body = '<p class="search-hint">Type a business name, category, neighborhood or tag (try one of these: ' +
        Data.topTags(6).map(function (t) {
          return '<a class="tag-chip" href="#/search?q=' + encodeURIComponent(t) + '">' + esc(t) + '</a>';
        }).join(" ") +
        '). Here is everyone on 313Space:</p>' + gridHTML(list);
    } else if (!list.length) {
      body = '<p class="search-none"><b>Bummer!</b> Nobody on 313Space matches &quot;' + esc(q) + '&quot; yet. ' +
        'Try a different word, or <a href="#/browse">browse all businesses</a>.</p>';
    } else {
      body = '<p class="small muted">' + esc(countLabel(list.length)) + ' found.</p>' + gridHTML(list);
    }

    app.innerHTML =
      '<div class="search">' +
      '<div class="box">' +
        '<div class="box-head">' + (q ? 'Search results for \'' + esc(q) + '\'' : 'Search 313Space') + '</div>' +
        '<div class="box-body">' +
          '<form class="search-inline" id="searchInline" role="search">' +
            '<label for="searchInlineInput" class="sr-only">Search businesses</label>' +
            '<input type="search" id="searchInlineInput" placeholder="name or tag" value="' + esc(q) + '"> ' +
            '<button type="submit" class="btn btn-blue">Search</button>' +
          '</form>' +
          body +
        '</div>' +
      '</div>' +
      '</div>';

    app.querySelector("#searchInline").addEventListener("submit", function (e) {
      e.preventDefault();
      var nq = (app.querySelector("#searchInlineInput").value || "").trim();
      Router.go("#/search" + (nq ? "?q=" + encodeURIComponent(nq) : ""));
    });
  };
})();
