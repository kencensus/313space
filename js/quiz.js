/* 313Space — "Find your Detroit Top 8" quiz. Pure client-side scoring, no AI at runtime. */
(function () {
  window.Pages = window.Pages || {};
  var esc = Data.esc;

  function now() {
    return (window.performance && typeof performance.now === "function") ? performance.now() : Date.now();
  }

  var STOP = { the: 1, and: 1, for: 1, with: 1, you: 1, are: 1, any: 1, some: 1, somewhere: 1, something: 1, place: 1, spot: 1,
    eat: 1, want: 1, like: 1, that: 1, this: 1, can: 1, get: 1, has: 1, have: 1, near: 1, good: 1, great: 1, really: 1, very: 1, just: 1 };

  function words(text) {
    return String(text || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(function (w) {
      return w.length >= 3 && !STOP[w];
    });
  }

  /* A free-text word matches a tag if it equals a word of the tag (or is a 4+ letter prefix of one, e.g. "veg" no, "vegan" yes). */
  function wordMatchesTag(word, tag) {
    return String(tag).toLowerCase().split(/[^a-z0-9]+/).some(function (tw) {
      return tw === word || (word.length >= 4 && tw.indexOf(word) === 0);
    });
  }

  function scoreAll(answers) {
    var vibeSet = {};
    answers.vibes.forEach(function (t) { vibeSet[String(t).toLowerCase()] = 1; });
    return Data.all().map(function (b) {
      var score = 0;
      var why = { category: false, tags: [], neighborhood: false, overBudget: false };
      if (answers.categories.indexOf(b.category) !== -1) { score += 3; why.category = true; }
      var seen = {};
      (b.tags || []).forEach(function (t) {
        var lt = String(t).toLowerCase();
        if (seen[lt]) return;
        var hit = !!vibeSet[lt] || answers.freeWords.some(function (w) { return wordMatchesTag(w, lt); });
        if (hit) { seen[lt] = 1; why.tags.push(t); }
      });
      score += 2 * why.tags.length;
      if (answers.neighborhood && b.neighborhood === answers.neighborhood) { score += 1; why.neighborhood = true; }
      if (answers.budget && Data.priceLevel(b.price) > answers.budget) { score -= 2; why.overBudget = true; }
      return { b: b, score: score, why: why };
    }).sort(function (x, y) {
      return (y.score - x.score) || (y.why.tags.length - x.why.tags.length) ||
        (x.b.name < y.b.name ? -1 : x.b.name > y.b.name ? 1 : 0);
    });
  }

  function whyLine(r) {
    var parts = [];
    if (r.why.category) parts.push("you're in the mood for " + esc(r.b.category));
    if (r.why.tags.length) parts.push("vibes: " + r.why.tags.map(function (t) { return '<span class="tag-chip">' + esc(t) + '</span>'; }).join(" "));
    if (r.why.neighborhood) parts.push("it's in " + esc(r.b.neighborhood));
    if (!parts.length) return "Nothing matched exactly, so here's the closest fit on 313Space. Try picking a few more vibes!";
    return parts.join("; ") + (r.why.overBudget ? ' <span class="muted">(a bit over your budget at ' + esc(r.b.price) + ')</span>' : "");
  }

  function formHTML() {
    var cats = Data.categories();
    var hoods = Data.neighborhoods();
    var tags = Data.topTags(12);
    return '' +
      '<div class="box quiz-box">' +
        '<div class="box-head">Find your Detroit Top 8: the 313Space quiz</div>' +
        '<div class="box-body">' +
          '<p class="small muted">Five quick questions. Answer as many as you like, then hit the button.</p>' +
          '<form id="quizForm" class="quiz-form" novalidate>' +
            '<fieldset><legend>1. What are you in the mood for?</legend><div class="quiz-opts">' +
              cats.map(function (c, i) {
                return '<label class="quiz-check"><input type="checkbox" name="cat" value="' + esc(c) + '" id="qcat' + i + '"> ' + esc(c) + '</label>';
              }).join("") +
            '</div></fieldset>' +
            '<fieldset><legend>2. Budget</legend><div class="quiz-opts">' +
              ["$", "$$", "$$$"].map(function (p) {
                return '<label class="quiz-check"><input type="radio" name="budget" value="' + p.length + '"> ' + p + '</label>';
              }).join("") +
              '<label class="quiz-check"><input type="radio" name="budget" value="0" checked> Doesn\'t matter</label>' +
            '</div></fieldset>' +
            '<fieldset><legend>3. Neighborhood you\'re near</legend>' +
              '<label for="quizHood" class="sr-only">Neighborhood</label>' +
              '<select id="quizHood"><option value="">Anywhere</option>' +
                hoods.map(function (h) { return '<option value="' + esc(h) + '">' + esc(h) + '</option>'; }).join("") +
              '</select>' +
            '</fieldset>' +
            '<fieldset><legend>4. Pick your vibes</legend><div class="quiz-chips" id="quizChips">' +
              tags.map(function (t) {
                return '<button type="button" class="quiz-chip" aria-pressed="false" data-tag="' + esc(t) + '">' + esc(t) + '</button>';
              }).join("") +
            '</div></fieldset>' +
            '<fieldset><legend>5. Anything else?</legend>' +
              '<label for="quizFree" class="small muted">Optional, e.g. &quot;somewhere cozy with late night hours&quot;</label><br>' +
              '<input type="text" id="quizFree" class="quiz-free" maxlength="200">' +
            '</fieldset>' +
            '<p class="quiz-submit"><button type="submit" class="btn-big">Find my match!</button></p>' +
          '</form>' +
        '</div>' +
      '</div>';
  }

  function resultsHTML(ranked, seconds) {
    var top = ranked[0];
    var b = top.b;
    var runners = ranked.slice(1, 4);
    return '' +
      '<div class="quiz-alert" role="status">' +
        '<div class="quiz-alert-title">You have 1 new friend request!</div>' +
        '<div class="quiz-match">' +
          '<a class="quiz-match-pic" href="' + Data.profileHref(b.id) + '">' + Data.picHTML(b, "lg") + '</a>' + Data.photoCreditHTML(b) +
          '<div class="quiz-match-info">' +
            '<h2><a href="' + Data.profileHref(b.id) + '">' + esc(b.name) + '</a></h2>' +
            (b.headline ? '<p class="quiz-headline">&quot;' + esc(b.headline) + '&quot;</p>' : '') +
            '<p class="small">' + esc(b.category) + ' &middot; ' + esc(b.neighborhood) + ' &middot; ' + esc(b.price) + '</p>' +
            '<p class="quiz-why"><b>Why you matched:</b> ' + whyLine(top) + '</p>' +
            '<p><a class="btn-big quiz-accept" href="' + Data.profileHref(b.id) + '">Accept friend request: view ' + esc(b.name) + '\'s profile</a></p>' +
          '</div>' +
        '</div>' +
        '<p class="small quiz-time">Matched in <b>' + seconds.toFixed(1) + ' seconds</b> <span class="measured">MEASURED</span></p>' +
      '</div>' +
      (runners.length ?
        '<div class="box box-orange quiz-runners">' +
          '<div class="box-head">Runners-up</div>' +
          '<div class="box-body"><div class="quiz-runner-grid">' +
            runners.map(function (r) { return '<div class="quiz-runner">' + Data.tileHTML(r.b, "md") + '</div>'; }).join("") +
          '</div></div>' +
        '</div>' : '') +
      '<p class="quiz-retake"><button type="button" class="btn" id="quizRetake">Retake quiz</button></p>';
  }

  Pages.quiz = function (app) {
    if (!Data.count()) {
      app.innerHTML = Router.notFoundHTML("There are no businesses on 313Space yet, so there's nothing to match.");
      return;
    }
    var start = now();
    app.innerHTML = '<div class="quiz">' + formHTML() + '<div id="quizResults"></div></div>';

    var form = app.querySelector("#quizForm");
    var resultsEl = app.querySelector("#quizResults");

    app.querySelector("#quizChips").addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest(".quiz-chip") : null;
      if (!btn) return;
      btn.setAttribute("aria-pressed", btn.getAttribute("aria-pressed") === "true" ? "false" : "true");
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var cats = [].map.call(form.querySelectorAll('input[name="cat"]:checked'), function (i) { return i.value; });
      var budgetEl = form.querySelector('input[name="budget"]:checked');
      var vibes = [].map.call(form.querySelectorAll('.quiz-chip[aria-pressed="true"]'), function (c) { return c.getAttribute("data-tag"); });
      var answers = {
        categories: cats,
        budget: budgetEl ? parseInt(budgetEl.value, 10) || 0 : 0,
        neighborhood: app.querySelector("#quizHood").value,
        vibes: vibes,
        freeWords: words(app.querySelector("#quizFree").value)
      };
      var ranked = scoreAll(answers);
      if (!ranked.length) return;
      var seconds = Math.round((now() - start) / 100) / 10;
      Store.addQuizTiming({ seconds: seconds, matchId: ranked[0].b.id });
      form.parentNode.parentNode.style.display = "none";
      resultsEl.innerHTML = resultsHTML(ranked, seconds);
      resultsEl.querySelector("#quizRetake").addEventListener("click", function () { Pages.quiz(app); window.scrollTo(0, 0); });
      try { resultsEl.scrollIntoView(); } catch (err) { /* ignore */ }
      if (window.toast) toast("You have 1 new friend request!");
    });
  };
})();
