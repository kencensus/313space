/* 313Space — Owner mode: edit a business's Top 8 with a timed "scratch" vs "review AI picks" path. */
(function () {
  window.Pages = window.Pages || {};

  Pages.edit = function (app, params) {
    var id = params && params.id;
    var biz = id ? Data.byId(id) : null;
    if (!biz) {
      app.innerHTML = Router.notFoundHTML("We couldn't find that business, so there's no Top 8 to edit.");
      return;
    }
    var esc = Data.esc;
    var N = Data.top8Size();
    var aiIds = Data.aiTop8Ids(id).slice(0, N);
    var aiSet = {};
    aiIds.forEach(function (x) { aiSet[x] = true; });
    var current = Data.top8For(id);
    var others = Data.all().filter(function (b) { return b.id !== id; });

    var state = { mode: null, selected: [], start: 0, timer: null, done: false };

    document.title = "Edit " + biz.name + "'s Top 8 | 313Space";

    function stopTimer() {
      if (state.timer) { clearInterval(state.timer); state.timer = null; }
    }
    Router.onLeave(stopTimer);

    function elapsed() {
      if (!state.start) return 0;
      return Math.round((Date.now() - state.start) / 100) / 10;
    }

    var statusHTML = current.source === "owner"
      ? '<span class="badge badge-owner">Owner picks</span> Your profile currently shows the Top 8 you picked.'
      : '<span class="badge badge-ai">AI picks</span> Your profile currently shows the AI-suggested Top 8.';

    var checklistRows = others.map(function (b) {
      var hay = [b.name, b.category, b.neighborhood].concat(b.tags || []).join(" ").toLowerCase();
      return '<li class="owner-row" data-hay="' + esc(hay) + '">' +
        '<label><input type="checkbox" class="owner-check" data-id="' + esc(b.id) + '" disabled> ' +
        '<span class="owner-row-name">' + esc(b.name) + '</span>' +
        (aiSet[b.id] ? ' <span class="owner-aipick">AI pick</span>' : '') +
        '<br><span class="muted small">' + esc(b.category) + ' &middot; ' + esc(b.neighborhood) + '</span></label></li>';
    }).join("");

    app.innerHTML =
      '<div class="owner">' +
        '<div class="box box-orange"><div class="box-head">Edit ' + esc(biz.name) + '\'s Top 8</div>' +
        '<div class="box-body">' +
          '<p><a href="' + Data.profileHref(id) + '">&laquo; Back to ' + esc(biz.name) + '\'s profile</a></p>' +
          '<p>' + statusHTML + '</p>' +
          (N > 0
            ? '<p><b>Pick exactly ' + N + ' business' + (N === 1 ? '' : 'es') + ' to feature in your Friend Space.</b></p>'
            : '<p><b>There are no other businesses in the directory yet, so there is nothing to pick.</b></p>') +
          '<div class="owner-paths">' +
            '<button type="button" class="btn-big owner-path" data-mode="scratch">Pick from scratch</button>' +
            '<button type="button" class="btn-big btn-blue owner-path" data-mode="review">Review AI picks</button>' +
          '</div>' +
          '<p class="owner-timer-line"><span class="owner-timer" aria-live="off">Timer: 0.0s</span> ' +
            '<span class="owner-hint muted">Choose a path to start the timer.</span></p>' +
        '</div></div>' +
        '<div class="owner-panels">' +
          '<div class="box owner-panel-left"><div class="box-head owner-count">Your Top 8 (0/' + N + ')</div>' +
            '<div class="box-body"><ol class="owner-selected"></ol></div></div>' +
          '<div class="box owner-panel-right"><div class="box-head">All businesses</div>' +
            '<div class="box-body">' +
              '<label for="ownerFilter" class="sr-only">Filter businesses</label>' +
              '<input id="ownerFilter" type="search" class="owner-filter" placeholder="Filter by name, category, neighborhood, tag" autocomplete="off">' +
              '<p class="owner-nomatch muted small" hidden>No businesses match that filter.</p>' +
              '<ul class="owner-checklist">' + checklistRows + '</ul>' +
            '</div></div>' +
        '</div>' +
        '<div class="box"><div class="box-body owner-actions">' +
          '<button type="button" class="btn-big owner-save" disabled>Save my Top 8</button> ' +
          '<button type="button" class="btn owner-reset"' + (current.source === "ai" ? ' disabled' : '') + '>Reset to AI suggestion</button>' +
          (current.source === "ai" ? ' <span class="muted small">Already showing the AI suggestion.</span>' : '') +
          '<p class="muted small owner-note">Timings are saved on this device for the Impact page KPI (seconds to choose a Top 8 from scratch vs. reviewing AI picks).</p>' +
        '</div></div>' +
      '</div>';

    var root = app.querySelector(".owner");
    var timerEl = root.querySelector(".owner-timer");
    var hintEl = root.querySelector(".owner-hint");
    var countEl = root.querySelector(".owner-count");
    var listEl = root.querySelector(".owner-selected");
    var filterEl = root.querySelector(".owner-filter");
    var noMatchEl = root.querySelector(".owner-nomatch");
    var saveBtn = root.querySelector(".owner-save");
    var resetBtn = root.querySelector(".owner-reset");
    var checks = root.querySelectorAll(".owner-check");
    var rows = root.querySelectorAll(".owner-row");

    function renderSelected(focusSel) {
      var k = state.selected.length;
      countEl.textContent = "Your Top 8 (" + k + "/" + N + ")";
      if (!k) {
        listEl.innerHTML = '<li class="owner-empty muted">' + (state.mode ? "Nobody yet. Check businesses on the right to add them." : "Choose a path above to start picking.") + '</li>';
      } else {
        listEl.innerHTML = state.selected.map(function (fid, i) {
          var b = Data.byId(fid);
          if (!b) return "";
          var nm = esc(b.name);
          return '<li class="owner-item">' +
            '<span class="owner-pos">' + (i + 1) + '.</span>' + Data.picHTML(b, "sm") +
            '<span class="owner-item-name">' + nm + (aiSet[fid] ? ' <span class="owner-aipick">AI pick</span>' : '') + '</span>' +
            '<span class="owner-item-btns">' +
              '<button type="button" class="btn owner-up" data-id="' + esc(fid) + '" aria-label="Move ' + nm + ' up"' + (i === 0 ? ' disabled' : '') + '>&uarr;</button>' +
              '<button type="button" class="btn owner-down" data-id="' + esc(fid) + '" aria-label="Move ' + nm + ' down"' + (i === k - 1 ? ' disabled' : '') + '>&darr;</button>' +
              '<button type="button" class="btn owner-remove" data-id="' + esc(fid) + '" aria-label="Remove ' + nm + '">x</button>' +
            '</span></li>';
        }).join("");
      }
      for (var i = 0; i < checks.length; i++) {
        var cid = checks[i].getAttribute("data-id");
        checks[i].checked = state.selected.indexOf(cid) !== -1;
        checks[i].disabled = !state.mode;
      }
      saveBtn.disabled = !(state.mode && N > 0 && k === N);
      if (focusSel) {
        var f = listEl.querySelector(focusSel);
        if (f && !f.disabled) f.focus();
        else { var any = listEl.querySelector("button:not([disabled])"); if (any) any.focus(); }
      }
    }

    function applyFilter() {
      var q = (filterEl.value || "").trim().toLowerCase();
      var terms = q ? q.split(/\s+/) : [];
      var shown = 0;
      for (var i = 0; i < rows.length; i++) {
        var hay = rows[i].getAttribute("data-hay") || "";
        var ok = terms.every(function (t) { return hay.indexOf(t) !== -1; });
        rows[i].hidden = !ok;
        if (ok) shown++;
      }
      noMatchEl.hidden = shown > 0 || !rows.length;
    }

    function startPath(mode) {
      stopTimer();
      state.mode = mode;
      state.selected = mode === "review" ? aiIds.slice() : [];
      state.start = Date.now();
      timerEl.textContent = "Timer: 0.0s";
      hintEl.textContent = mode === "review"
        ? "Reviewing AI picks. Reorder, swap, then save."
        : "Picking from scratch. Check " + N + " businesses, then save.";
      state.timer = setInterval(function () { timerEl.textContent = "Timer: " + elapsed().toFixed(1) + "s"; }, 100);
      var pb = root.querySelectorAll(".owner-path");
      for (var i = 0; i < pb.length; i++) pb[i].classList.toggle("owner-path-active", pb[i].getAttribute("data-mode") === mode);
      renderSelected();
    }

    function move(fid, delta) {
      var i = state.selected.indexOf(fid);
      var j = i + delta;
      if (i === -1 || j < 0 || j >= state.selected.length) return;
      var tmp = state.selected[j];
      state.selected[j] = fid;
      state.selected[i] = tmp;
      renderSelected((delta < 0 ? ".owner-up" : ".owner-down") + '[data-id="' + fid.replace(/["\\]/g, "\\$&") + '"]');
    }

    root.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target.closest("button") : null;
      if (!t || !root.contains(t)) return;
      if (t.classList.contains("owner-path")) { startPath(t.getAttribute("data-mode")); return; }
      var fid = t.getAttribute("data-id");
      if (t.classList.contains("owner-up")) { move(fid, -1); return; }
      if (t.classList.contains("owner-down")) { move(fid, 1); return; }
      if (t.classList.contains("owner-remove")) {
        state.selected = state.selected.filter(function (x) { return x !== fid; });
        renderSelected(".owner-remove");
        return;
      }
      if (t === saveBtn) {
        if (!state.mode || state.selected.length !== N || N === 0 || state.done) return;
        var seconds = elapsed();
        stopTimer();
        state.done = true;
        Store.setOwnerTop8(id, state.selected.slice());
        Store.addEditTiming({ businessId: id, mode: state.mode, seconds: seconds });
        window.toast("Top 8 saved in " + seconds.toFixed(1) + "s! Your profile now shows your picks.");
        Router.go(Data.profileHref(id));
        return;
      }
      if (t === resetBtn) {
        stopTimer();
        Store.clearOwnerTop8(id);
        window.toast("Reset! Your profile shows the AI-suggested Top 8 again.");
        Router.go(Data.profileHref(id));
      }
    });

    root.addEventListener("change", function (e) {
      var t = e.target;
      if (!t.classList || !t.classList.contains("owner-check")) return;
      var fid = t.getAttribute("data-id");
      if (!state.mode) { t.checked = false; return; }
      if (t.checked) {
        if (state.selected.indexOf(fid) !== -1) return;
        if (state.selected.length >= N) {
          t.checked = false;
          window.toast("Your Top 8 is full! Remove someone first.");
          return;
        }
        state.selected.push(fid);
      } else {
        state.selected = state.selected.filter(function (x) { return x !== fid; });
      }
      renderSelected();
    });

    filterEl.addEventListener("input", applyFilter);
    renderSelected();
  };
})();
