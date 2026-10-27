/* 313Space — hash router + tiny render helpers.
   Pages register themselves: Pages.<name> = function (app, params) { app.innerHTML = ...; wire events }.
   Routes: #/ home | #/browse | #/search?q= | #/quiz | #/b/<id> profile | #/edit/<id> edit | #/impact */
(function () {
  window.Pages = window.Pages || {};
  var cleanup = null;
  var toastTimer = null;

  function parse(hash) {
    var h = String(hash || "").replace(/^#/, "");
    if (!h || h === "/") return { name: "home", params: {} };
    var qIdx = h.indexOf("?");
    var path = qIdx === -1 ? h : h.slice(0, qIdx);
    var query = {};
    if (qIdx !== -1) {
      h.slice(qIdx + 1).split("&").forEach(function (kv) {
        if (!kv) return;
        var p = kv.split("=");
        try { query[decodeURIComponent(p[0])] = decodeURIComponent((p[1] || "").replace(/\+/g, " ")); } catch (e) { /* ignore */ }
      });
    }
    var parts = path.split("/").filter(Boolean);
    var id = parts[1] ? safeDecode(parts[1]) : "";
    switch (parts[0]) {
      case "browse": return { name: "browse", params: query };
      case "search": return { name: "search", params: query };
      case "quiz": return { name: "quiz", params: query };
      case "impact": return { name: "impact", params: query };
      case "b": return { name: "profile", params: { id: id } };
      case "edit": return { name: "edit", params: { id: id } };
      default: return { name: "notfound", params: {} };
    }
  }
  function safeDecode(s) { try { return decodeURIComponent(s); } catch (e) { return s; } }

  function setActiveNav(name) {
    var navName = name === "profile" || name === "edit" ? "browse" : name;
    var links = document.querySelectorAll("#navbar a[data-nav]");
    for (var i = 0; i < links.length; i++) {
      links[i].classList.toggle("active", links[i].getAttribute("data-nav") === navName);
    }
  }

  function render() {
    var app = document.getElementById("app");
    if (!app) return;
    if (typeof cleanup === "function") { try { cleanup(); } catch (e) { /* ignore */ } }
    cleanup = null;
    var route = parse(location.hash);
    setActiveNav(route.name);
    var si = document.getElementById("searchInput");
    if (si && route.name !== "search") si.value = "";
    document.title = "313Space | a place for Detroit's independent businesses";
    var fn = window.Pages[route.name];
    try {
      if (typeof fn === "function") fn(app, route.params || {});
      else if (route.name === "notfound") app.innerHTML = notFoundHTML("That page isn't in 313Space.");
      else app.innerHTML = '<div class="box"><div class="box-head">Coming soon</div><div class="box-body">This page is still being built.</div></div>';
    } catch (err) {
      if (window.console) console.error(err);
      app.innerHTML = notFoundHTML("Sorry! An unexpected error has occurred. This error has been forwarded to Tom. (Just kidding, try refreshing.)");
    }
    window.scrollTo(0, 0);
  }

  function notFoundHTML(msg) {
    return '<div class="box"><div class="box-head">Oops!</div><div class="box-body"><p>' + Data.esc(msg) +
      '</p><p><a href="#/">Back to 313Space home</a> &middot; <a href="#/browse">Browse businesses</a></p></div></div>';
  }

  function toast(msg) {
    var el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("show"); }, 2400);
  }

  function go(hash) { if (location.hash === hash) render(); else location.hash = hash; }

  function start() {
    var form = document.getElementById("searchForm");
    if (form) form.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = (document.getElementById("searchInput").value || "").trim();
      go("#/search" + (q ? "?q=" + encodeURIComponent(q) : ""));
    });
    window.addEventListener("hashchange", render);
    render();
  }

  window.Router = {
    parse: parse, render: render, go: go, notFoundHTML: notFoundHTML,
    /* A page may register a cleanup fn (e.g. clear timers) that runs before the next route renders. */
    onLeave: function (fn) { cleanup = fn; }
  };
  window.toast = toast;

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
