/* 313Space — data helpers over window.BUSINESSES (read-only) + owner overrides from Store. */
(function () {
  var LIST = Array.isArray(window.BUSINESSES) ? window.BUSINESSES : [];
  var BY_ID = {};
  LIST.forEach(function (b) { if (b && b.id) BY_ID[b.id] = b; });

  var PALETTE = ["#003399", "#FF6600", "#6699CC", "#CC0066", "#339933", "#9933CC", "#CC3300", "#008080", "#996600", "#3366CC", "#CC6699", "#666699"];

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function all() { return LIST.slice(); }
  function byId(id) { return BY_ID[id] || null; }
  function count() { return LIST.length; }

  function initials(name) {
    var words = String(name || "?").replace(/[^A-Za-z0-9& ]/g, " ").split(/\s+/).filter(function (w) {
      return w && !/^(the|of|and|a|an|&)$/i.test(w);
    });
    if (!words.length) return "?";
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  function colorFor(id) {
    var h = 0, s = String(id || "");
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return PALETTE[h % PALETTE.length];
  }
  function profileHref(id) { return "#/b/" + encodeURIComponent(id); }
  function editHref(id) { return "#/edit/" + encodeURIComponent(id); }

  /* Profile "pic": colored square with initials + category. size: 'sm' | 'md' | 'lg' */
  function picHTML(b, size) {
    if (!b) return "";
    return '<div class="pic pic-' + (size || "md") + '" style="background:' + colorFor(b.id) + '" aria-hidden="true">' +
      '<span class="pic-initials">' + esc(initials(b.name)) + '</span>' +
      '<span class="pic-cat">' + esc(b.category) + '</span></div>';
  }
  /* Linked tile: name above pic, both link to profile. */
  function tileHTML(b, size) {
    if (!b) return "";
    return '<a class="tile tile-' + (size || "md") + '" href="' + profileHref(b.id) + '">' +
      '<span class="tile-name">' + esc(b.name) + '</span>' + picHTML(b, size) + '</a>';
  }

  /* Effective Top 8 for a business: owner override (if saved) else AI top8.
     Returns { source: 'owner'|'ai', list: [{id, why}] } — only ids that exist in the data. */
  function top8For(id) {
    var b = BY_ID[id];
    if (!b) return { source: "ai", list: [] };
    var aiWhy = {};
    (b.top8 || []).forEach(function (f) { if (f && f.id) aiWhy[f.id] = f.why; });
    var owner = window.Store ? Store.getOwnerTop8(id) : null;
    if (owner && owner.length) {
      return {
        source: "owner",
        list: owner.filter(function (fid) { return BY_ID[fid] && fid !== id; }).map(function (fid) {
          return { id: fid, why: aiWhy[fid] || ("Hand-picked by the owner of " + b.name + " as a Top 8 friend.") };
        })
      };
    }
    return { source: "ai", list: (b.top8 || []).filter(function (f) { return f && BY_ID[f.id] && f.id !== id; }) };
  }
  function aiTop8Ids(id) {
    var b = BY_ID[id];
    return b ? (b.top8 || []).map(function (f) { return f.id; }).filter(function (fid) { return BY_ID[fid] && fid !== id; }) : [];
  }
  /* How many friends a Top 8 should have (8, or fewer if the directory is tiny). */
  function top8Size() { return Math.min(8, Math.max(0, LIST.length - 1)); }

  /* { [businessId]: number of OTHER businesses' effective Top 8s it appears in } */
  function appearances() {
    var counts = {};
    LIST.forEach(function (b) { counts[b.id] = 0; });
    LIST.forEach(function (b) {
      top8For(b.id).list.forEach(function (f) { if (f.id !== b.id && counts[f.id] != null) counts[f.id]++; });
    });
    return counts;
  }
  /* Who lists this business in their Top 8 (effective). */
  function friendedBy(id) {
    return LIST.filter(function (b) {
      return b.id !== id && top8For(b.id).list.some(function (f) { return f.id === id; });
    });
  }

  function uniq(arr) { var seen = {}; return arr.filter(function (x) { if (x == null || seen[x]) return false; seen[x] = 1; return true; }); }
  function categories() { return uniq(LIST.map(function (b) { return b.category; })).sort(); }
  function neighborhoods() { return uniq(LIST.map(function (b) { return b.neighborhood; })).sort(); }
  /* Most common tags, descending by frequency then alpha. */
  function topTags(n) {
    var c = {};
    LIST.forEach(function (b) { (b.tags || []).forEach(function (t) { t = String(t).toLowerCase(); c[t] = (c[t] || 0) + 1; }); });
    return Object.keys(c).sort(function (a, b) { return c[b] - c[a] || (a < b ? -1 : 1); }).slice(0, n || 12);
  }
  function priceLevel(p) { return String(p || "").length || 0; }

  /* Simple text search across name, tags, category, neighborhood. */
  function search(q) {
    q = String(q || "").trim().toLowerCase();
    if (!q) return LIST.slice();
    var terms = q.split(/\s+/);
    return LIST.filter(function (b) {
      var hay = [b.name, b.category, b.neighborhood].concat(b.tags || []).join(" ").toLowerCase();
      return terms.every(function (t) { return hay.indexOf(t) !== -1; });
    });
  }

  function todayStr() {
    var d = new Date();
    return (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
  }

  window.Data = {
    esc: esc, all: all, byId: byId, count: count, initials: initials, colorFor: colorFor,
    profileHref: profileHref, editHref: editHref, picHTML: picHTML, tileHTML: tileHTML,
    top8For: top8For, aiTop8Ids: aiTop8Ids, top8Size: top8Size, appearances: appearances, friendedBy: friendedBy,
    categories: categories, neighborhoods: neighborhoods, topTags: topTags, priceLevel: priceLevel,
    search: search, todayStr: todayStr, meta: window.DIRECTORY_META || {}
  };
})();
