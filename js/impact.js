/* 313Space — Impact dashboard. Every number is computed live from Store + Data and tagged MEASURED or PROJECTED. */
(function () {
  window.Pages = window.Pages || {};

  var M = '<span class="measured">MEASURED</span>';
  var P = '<span class="projected">PROJECTED</span>';
  var DASH = "—";

  function avg(nums) {
    var v = nums.filter(function (x) { return typeof x === "number" && isFinite(x); });
    if (!v.length) return null;
    var s = 0;
    v.forEach(function (x) { s += x; });
    return s / v.length;
  }
  function f1(x) { return x == null || !isFinite(x) ? DASH : x.toFixed(1); }

  function compute() {
    var timings = Store.getEditTimings().filter(function (t) { return t && Data.byId(t.businessId); });
    var scratch = timings.filter(function (t) { return t && t.mode === "scratch"; }).map(function (t) { return Number(t.seconds); });
    var review = timings.filter(function (t) { return t && t.mode === "review"; }).map(function (t) { return Number(t.seconds); });
    var avgS = avg(scratch), avgR = avg(review);
    var pctSaved = null;
    if (avgS != null && avgR != null && avgS > 0) pctSaved = (avgS - avgR) / avgS * 100;

    var ratings = Store.getRatings();
    var aiYes = 0, aiNo = 0, ownYes = 0, ownNo = 0;
    Object.keys(ratings).forEach(function (k) {
      var r = ratings[k];
      if (!r || !Data.byId(r.biz) || !Data.byId(r.friend)) return;
      if (r.source === "owner") { if (r.value === "yes") ownYes++; else if (r.value === "no") ownNo++; }
      else if (r.source === "ai") { if (r.value === "yes") aiYes++; else if (r.value === "no") aiNo++; }
    });
    var aiN = aiYes + aiNo, ownN = ownYes + ownNo;
    var aiPct = aiN ? aiYes / aiN * 100 : null;

    var bizCount = Data.count();
    var links = 0;
    Data.all().forEach(function (b) { links += Data.top8For(b.id).list.length; });
    var app = Data.appearances();
    var appVals = Object.keys(app).map(function (k) { return app[k]; });
    var minApp = appVals.length ? Math.min.apply(null, appVals) : null;
    var avgApp = avg(appVals);
    var hoods = Data.neighborhoods();
    var owners = Store.getAllOwnerTop8() || {};
    var customized = Object.keys(owners).filter(function (k) {
      return Data.byId(k) && Array.isArray(owners[k]) && owners[k].length;
    }).length;

    var quiz = Store.getQuizTimings().filter(function (q) { return q && (!q.matchId || Data.byId(q.matchId)); }).map(function (q) { return Number(q && q.seconds); });
    var avgQuiz = avg(quiz);

    var perBiz = bizCount ? links / bizCount : null;
    var proj100 = perBiz != null ? Math.round(perBiz * 100) : null;

    var meta = Data.meta || {};
    var target = typeof meta.minAppearances === "number" ? meta.minAppearances : null;

    return {
      avgS: avgS, avgR: avgR, nS: scratch.length, nR: review.length, pctSaved: pctSaved,
      aiYes: aiYes, aiNo: aiNo, aiN: aiN, aiPct: aiPct, ownYes: ownYes, ownNo: ownNo, ownN: ownN,
      bizCount: bizCount, links: links, minApp: minApp, avgApp: avgApp, hoods: hoods, customized: customized,
      avgQuiz: avgQuiz, nQuiz: quiz.length, perBiz: perBiz, proj100: proj100,
      meta: meta, target: target, meets: target != null && minApp != null ? minApp >= target : null
    };
  }

  function speedText(pct) {
    if (pct == null || !isFinite(pct)) return null;
    var r = Math.round(Math.abs(pct));
    if (pct >= 0) return r + "% faster with AI picks";
    return r + "% slower with AI picks";
  }

  function buildText(d) {
    var L = [];
    L.push("313Space Impact results (" + Data.todayStr() + ")");
    L.push("[MEASURED] Time to choose a Top 8 from scratch: " + (d.nS ? f1(d.avgS) + "s avg" : "no data yet") + " (n=" + d.nS + ")");
    L.push("[MEASURED] Time to review AI picks: " + (d.nR ? f1(d.avgR) + "s avg" : "no data yet") + " (n=" + d.nR + ")");
    L.push("[MEASURED] Time saved: " + (speedText(d.pctSaved) || (d.nS && d.nR ? DASH + " (scratch average is 0s)" : "no data yet")) + " (n=" + d.nS + " scratch, " + d.nR + " review)");
    L.push("[MEASURED] AI picks rated Good match: " + (d.aiN ? Math.round(d.aiPct) + "%" : "no data yet") + " (n=" + d.aiN + "; " + d.aiYes + " yes, " + d.aiNo + " no)");
    if (d.ownN) L.push("[MEASURED] Owner-pick ratings: " + d.ownN + " (" + d.ownYes + " yes, " + d.ownNo + " no)");
    L.push("[MEASURED] Businesses in directory: " + d.bizCount);
    L.push("[MEASURED] Cross-promotion links: " + d.links);
    L.push("[MEASURED] Appearances in other Top 8s: min " + (d.minApp == null ? DASH : d.minApp) + ", avg " + f1(d.avgApp) + " (n=" + d.bizCount + " businesses)");
    L.push("[MEASURED] Neighborhoods covered: " + d.hoods.length + (d.hoods.length ? " (" + d.hoods.join(", ") + ")" : ""));
    L.push("[MEASURED] Owners who customized their Top 8: " + d.customized);
    L.push("[MEASURED] Quiz: " + (d.nQuiz ? f1(d.avgQuiz) + "s avg to a match" : "no data yet") + " (n=" + d.nQuiz + " quizzes)");
    if (d.proj100 != null) {
      L.push("[PROJECTED] At 100 businesses: ~" + d.proj100 + " cross-promotion links (assumes the current average of " + f1(d.perBiz) + " links per business)");
    } else {
      L.push("[PROJECTED] At 100 businesses: no data yet");
    }
    return L.join("\n");
  }

  function row(label, valueHTML) {
    return '<tr><td class="lbl">' + label + '</td><td class="val">' + valueHTML + '</td></tr>';
  }

  function copyText(text) {
    function fallback() {
      var ok = false;
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed"; ta.style.left = "-9999px"; ta.style.top = "0";
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand("copy");
        document.body.removeChild(ta);
      } catch (e) { ok = false; }
      window.toast(ok ? "Results copied!" : "Couldn't copy automatically. Select the text below and copy it.");
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext !== false) {
        navigator.clipboard.writeText(text).then(function () { window.toast("Results copied!"); }).catch(fallback);
        return;
      }
    } catch (e) { /* fall through */ }
    fallback();
  }

  Pages.impact = function (app) {
    var esc = Data.esc;
    var resetTimer = null;
    document.title = "Impact | 313Space";
    Router.onLeave(function () { if (resetTimer) { clearTimeout(resetTimer); resetTimer = null; } });

    var d = compute();
    var text = buildText(d);
    var noData = '<span class="muted">' + DASH + ' no data yet</span>';

    var speed = speedText(d.pctSaved);
    var timeBox =
      '<div class="box"><div class="box-head">Time per task ' + M + '</div><div class="box-body"><table class="mys">' +
        row("From scratch", d.nS ? '<b>' + f1(d.avgS) + 's</b> avg ' + M + ' <span class="muted small">(n=' + d.nS + ')</span>' : noData + ' <span class="muted small">(n=0)</span>') +
        row("Reviewing AI picks", d.nR ? '<b>' + f1(d.avgR) + 's</b> avg ' + M + ' <span class="muted small">(n=' + d.nR + ')</span>' : noData + ' <span class="muted small">(n=0)</span>') +
        row("Time saved", speed ? '<b>' + esc(speed) + '</b> ' + M : (d.nS && d.nR ? '<span class="muted">' + DASH + ' (scratch average is 0s)</span>' : noData + ' <span class="muted small">(needs at least 1 of each)</span>')) +
      '</table><p class="small muted">Try it: open any business, click "Edit Top 8", and use both paths.</p></div></div>';

    var successBox =
      '<div class="box"><div class="box-head">Task success ' + M + '</div><div class="box-body"><table class="mys">' +
        row("AI picks rated &quot;Good match&quot;", d.aiN ? '<b>' + Math.round(d.aiPct) + '%</b> ' + M : noData) +
        row("Ratings of AI picks", '<b>' + d.aiN + '</b> ' + M + ' <span class="muted small">(' + d.aiYes + ' yes, ' + d.aiNo + ' no)</span>') +
        (d.ownN ? row("Ratings of owner picks", '<b>' + d.ownN + '</b> ' + M + ' <span class="muted small">(' + d.ownYes + ' yes, ' + d.ownNo + ' no)</span>') : '') +
      '</table></div></div>';

    var meetsHTML = d.meets == null ? '<span class="muted">' + DASH + '</span>'
      : d.meets ? '<span class="impact-ok">Yes, current min meets it</span>'
      : '<span class="impact-no">Not yet (current min is ' + d.minApp + ')</span>';

    var communityBox =
      '<div class="box box-orange"><div class="box-head">Detroit community value ' + M + '</div><div class="box-body"><table class="mys">' +
        row("Businesses", '<b>' + d.bizCount + '</b> ' + M) +
        row("Cross-promotion links", '<b>' + d.links + '</b> ' + M + ' <span class="muted small">(sum of every business\'s current Top 8)</span>') +
        row("Min appearances in other Top 8s", (d.minApp == null ? noData : '<b>' + d.minApp + '</b> ' + M)) +
        row("Avg appearances in other Top 8s", (d.avgApp == null ? noData : '<b>' + f1(d.avgApp) + '</b> ' + M)) +
        row("Target min appearances", (d.target == null ? '<span class="muted">' + DASH + '</span>' : '<b>' + esc(d.target) + '</b> <span class="muted small">(goal set when the AI built the directory)</span> ' + meetsHTML)) +
        row("Neighborhoods covered", '<b>' + d.hoods.length + '</b> ' + M + (d.hoods.length ? '<br><span class="small">' + d.hoods.map(esc).join(", ") + '</span>' : '')) +
        row("Owners who customized their Top 8", '<b>' + d.customized + '</b> ' + M) +
      '</table></div></div>';

    var quizBox =
      '<div class="box"><div class="box-head">Quiz ' + M + '</div><div class="box-body"><table class="mys">' +
        row("Avg time to a match", d.nQuiz ? '<b>' + f1(d.avgQuiz) + 's</b> ' + M : noData) +
        row("Quizzes taken", '<b>' + d.nQuiz + '</b> ' + M) +
      '</table></div></div>';

    var projBox =
      '<div class="box impact-proj"><div class="box-head">Projected ' + P + '</div><div class="box-body">' +
        '<p>' + P + ' ' + (d.proj100 != null
          ? 'At 100 businesses: <b>~' + d.proj100 + '</b> cross-promotion links (assumes the current average of ' + f1(d.perBiz) + ' links per business).'
          : 'At 100 businesses: ' + noData) + '</p>' +
        '<p class="small muted">This is a projection, not a measurement.</p>' +
      '</div></div>';

    app.innerHTML =
      '<div class="impact">' +
        '<div class="box box-orange"><div class="box-head">313Space Impact</div><div class="box-body">' +
          '<p>Live numbers from this device and the directory. Every number is labeled ' + M + ' or ' + P + '.</p>' +
          '<p class="small">Generated by: ' + esc(d.meta.generatedBy || DASH) + ', ' + esc(d.meta.generatedAt || DASH) +
          ' &middot; Target minimum appearances: ' + (d.target == null ? DASH : esc(d.target)) + ' ' + meetsHTML + '</p>' +
        '</div></div>' +
        '<div class="impact-grid">' +
          '<div class="impact-col">' + timeBox + successBox + quizBox + '</div>' +
          '<div class="impact-col">' + communityBox + projBox + '</div>' +
        '</div>' +
        '<div class="box"><div class="box-head">Share results</div><div class="box-body">' +
          '<p><button type="button" class="btn btn-blue impact-copy">Copy results</button> ' +
          '<button type="button" class="btn impact-reset">Reset test data</button></p>' +
          '<label for="impactText" class="small"><b>Plain-text summary</b> (select and copy manually if needed):</label>' +
          '<textarea id="impactText" class="impact-text" readonly rows="10">' + esc(text) + '</textarea>' +
        '</div></div>' +
        '<p class="small muted">MEASURED numbers come from this device\'s localStorage (ratings, owner timings, quiz timings) and the live directory data. PROJECTED numbers are estimates.</p>' +
      '</div>';

    var root = app.querySelector(".impact");
    var resetBtn = root.querySelector(".impact-reset");
    var armed = false;

    root.querySelector(".impact-copy").addEventListener("click", function () { copyText(text); });
    resetBtn.addEventListener("click", function () {
      if (!armed) {
        armed = true;
        resetBtn.textContent = "Click again to confirm reset";
        resetBtn.classList.add("impact-armed");
        resetTimer = setTimeout(function () {
          armed = false;
          resetTimer = null;
          resetBtn.textContent = "Reset test data";
          resetBtn.classList.remove("impact-armed");
        }, 3000);
        return;
      }
      if (resetTimer) { clearTimeout(resetTimer); resetTimer = null; }
      Store.resetTestData();
      window.toast("Test data cleared.");
      Pages.impact(app);
    });
  };
})();
