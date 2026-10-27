/* 313Space — data helpers over window.BUSINESSES (read-only) + owner overrides from Store. */
(function () {
  /* global BUSINESSES */
  var LIST = Array.isArray(window.BUSINESSES) ? window.BUSINESSES
    : (typeof BUSINESSES !== "undefined" && Array.isArray(BUSINESSES) ? BUSINESSES : []);
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
    var words = String(name || "?").replace(/['\u2019]/g, "").replace(/[^A-Za-z0-9& ]/g, " ").split(/\s+/).filter(function (w) {
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

  /* Original category illustrations (white line-art on the business color). viewBox 0 0 48 48. */
  var ART = {
    "Coffee": '<path d="M10 20h22v10a9 9 0 0 1-9 9h-4a9 9 0 0 1-9-9z" fill="#fff"/><path d="M32 23h3a5 5 0 0 1 0 10h-3" fill="none" stroke="#fff" stroke-width="3"/><path d="M16 7c-2 3 2 5 0 8M22 7c-2 3 2 5 0 8M28 7c-2 3 2 5 0 8" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>',
    "Records": '<circle cx="24" cy="24" r="19" fill="#111" stroke="#fff" stroke-width="2"/><circle cx="24" cy="24" r="14" fill="none" stroke="#666" stroke-width="1"/><circle cx="24" cy="24" r="10.5" fill="none" stroke="#666" stroke-width="1"/><circle cx="24" cy="24" r="6" fill="#fff"/><circle cx="24" cy="24" r="1.5" fill="#111"/>',
    "Books": '<rect x="7" y="32" width="34" height="8" rx="1" fill="#fff"/><rect x="11" y="23" width="29" height="8" rx="1" fill="#fff" opacity=".85"/><rect x="8" y="14" width="27" height="8" rx="1" fill="#fff" opacity=".7"/><path d="M11 36h26M15 27h21M12 18h19" stroke="#000" stroke-opacity=".25" stroke-width="1.5"/>',
    "Food": '<circle cx="24" cy="25" r="10" fill="none" stroke="#fff" stroke-width="3"/><path d="M7 8v10a3 3 0 0 0 3 3v19M10 8v8M13 8v10a3 3 0 0 1-3 3" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><path d="M41 8c-4 2-5 7-5 13h5v19" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
    "Drinks & Music": '<path d="M7 17h20v19a4 4 0 0 1-4 4H11a4 4 0 0 1-4-4z" fill="#fff"/><path d="M27 21h3a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4h-3" fill="none" stroke="#fff" stroke-width="3"/><path d="M6 17c0-4 3-6 6-5 1-3 6-4 8-1 2-2 7-1 7 3v3z" fill="#fff" opacity=".75"/><path d="M41 5v13" stroke="#fff" stroke-width="2"/><circle cx="38.3" cy="18.5" r="3" fill="#fff"/><path d="M41 5l4 2" stroke="#fff" stroke-width="2" stroke-linecap="round"/>',
    "Vintage & Goods": '<path d="M17 20v-5a7 7 0 0 1 14 0v5" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M9 18h30l-2 23H11z" fill="#fff"/><path d="M24 25l1.6 3.4 3.7.5-2.7 2.6.7 3.7L24 33.4l-3.3 1.8.7-3.7-2.7-2.6 3.7-.5z" fill="#FF6600"/>',
    "Art & Makers": '<path d="M24 7C13 7 6 14 6 23s7 17 16 17c3 0 4-2 3-4s0-4 3-4h5c6 0 9-4 9-9C42 14 34 7 24 7z" fill="#fff"/><circle cx="15" cy="21" r="3" fill="#FF6600"/><circle cx="21" cy="14" r="3" fill="#003399"/><circle cx="30" cy="14" r="3" fill="#CC0066"/><circle cx="35" cy="22" r="3" fill="#339933"/>',
    "Fun & Activities": '<path d="M5 15h38v6a3 3 0 0 0 0 6v6H5v-6a3 3 0 0 0 0-6z" fill="#fff"/><path d="M32 15v18" stroke="#000" stroke-opacity=".3" stroke-dasharray="2 2" stroke-width="1.5"/><path d="M18 18l2 4 4.4.6-3.2 3.1.8 4.4L18 28l-4 2.1.8-4.4-3.2-3.1 4.4-.6z" fill="#FFCC00" stroke="#996600" stroke-width=".6"/>',
    "Sweets": '<path d="M12 26h24l-3 14H15z" fill="#fff" opacity=".85"/><path d="M18 26l1 14M24 26v14M30 26l-1 14" stroke="#000" stroke-opacity=".2" stroke-width="1.5"/><path d="M10 26c0-6 4-10 8-10 1-4 4-6 6-6s5 2 6 6c4 0 8 4 8 10z" fill="#fff"/><circle cx="24" cy="8" r="3" fill="#CC0000"/>',
    "_": '<path d="M6 18l4-9h28l4 9z" fill="#fff"/><rect x="8" y="18" width="32" height="22" fill="#fff" opacity=".85"/><rect x="21" y="27" width="7" height="13" fill="#000" opacity=".3"/>'
  };
  function artSVG(category) {
    return '<svg class="pic-art" viewBox="0 0 48 48" aria-hidden="true" focusable="false">' + (ART[category] || ART._) + '</svg>';
  }
  var IMAGES = window.BUSINESS_IMAGES || {};
  function imageFor(id) { var im = IMAGES[id]; return im && im.src ? im : null; }
  function photoCreditHTML(b) {
    var im = b && imageFor(b.id);
    if (!im) return "";
    return '<div class="pic-credit">Photo: ' + (im.page ? '<a href="' + esc(im.page) + '" target="_blank" rel="noopener">' : "") +
      esc(im.artist || "Wikimedia Commons") + (im.page ? "</a>" : "") + (im.license ? " (" + esc(im.license) + ")" : "") + ", via Wikimedia Commons</div>";
  }

  /* Profile "pic": colored square with category illustration + initials + category; a verified photo covers it when available. size: 'sm' | 'md' | 'lg' */
  function picHTML(b, size) {
    if (!b) return "";
    var im = imageFor(b.id);
    return '<div class="pic pic-' + (size || "md") + (im ? " has-photo" : "") + '" style="background:' + colorFor(b.id) + '" aria-hidden="true">' +
      artSVG(b.category) +
      '<span class="pic-initials">' + esc(initials(b.name)) + '</span>' +
      '<span class="pic-cat">' + esc(b.category) + '</span>' +
      (im ? '<img class="pic-photo" src="' + esc(im.src) + '" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentNode.classList.remove(\'has-photo\');this.remove()">' : "") +
      '</div>';
  }
  /* Linked tile: name above pic, both link to profile. */
  function tileHTML(b, size) {
    if (!b) return "";
    return '<a class="tile tile-' + (size || "md") + '" href="' + profileHref(b.id) + '">' +
      '<span class="tile-name">' + esc(b.name) + '</span>' + picHTML(b, size) + '</a>';
  }

  /* Effective Top 8 for a business: owner override (if saved) else AI top8.
     Returns { source: 'owner'|'ai', list: [{id, why}] } — only ids that exist in the data. */
  function dedupe(ids) { var seen = {}; return (ids || []).filter(function (x) { if (!x || seen[x]) return false; seen[x] = 1; return true; }); }

  function top8For(id) {
    var b = BY_ID[id];
    if (!b) return { source: "ai", list: [] };
    var aiWhy = {};
    (b.top8 || []).forEach(function (f) { if (f && f.id) aiWhy[f.id] = f.why; });
    var owner = window.Store ? Store.getOwnerTop8(id) : null;
    if (owner && owner.length) {
      return {
        source: "owner",
        list: dedupe(owner).filter(function (fid) { return BY_ID[fid] && fid !== id; }).map(function (fid) {
          return { id: fid, why: aiWhy[fid] || ("Hand-picked by the owner of " + b.name + " as a Top 8 friend.") };
        })
      };
    }
    var seen = {};
    return { source: "ai", list: (b.top8 || []).filter(function (f) {
      if (!f || !BY_ID[f.id] || f.id === id || seen[f.id]) return false;
      seen[f.id] = 1; return true;
    }) };
  }
  function aiTop8Ids(id) {
    var b = BY_ID[id];
    return b ? dedupe((b.top8 || []).map(function (f) { return f && f.id; })).filter(function (fid) { return BY_ID[fid] && fid !== id; }) : [];
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
    profileHref: profileHref, editHref: editHref, picHTML: picHTML, tileHTML: tileHTML, imageFor: imageFor, photoCreditHTML: photoCreditHTML,
    top8For: top8For, aiTop8Ids: aiTop8Ids, top8Size: top8Size, appearances: appearances, friendedBy: friendedBy,
    categories: categories, neighborhoods: neighborhoods, topTags: topTags, priceLevel: priceLevel,
    search: search, todayStr: todayStr, meta: window.DIRECTORY_META || (typeof DIRECTORY_META !== "undefined" ? DIRECTORY_META : {}) || {}
  };
})();
