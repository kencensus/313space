/* 313Space — Profile page (#/b/<id>). Agent A.
   Renders a MySpace-circa-2006 profile from the business's data entry only. */
(function () {
  window.Pages = window.Pages || {};

  var LAST_LOGIN = "10/27/2026";

  function safeUrl(u) {
    return /^https?:\/\//i.test(String(u || "")) ? String(u) : "";
  }

  function plural(n, one, many) { return n === 1 ? one : many; }

  function rateButtonsHTML(fid, current) {
    function btn(value, label) {
      var on = current === value;
      return '<button type="button" class="btn prof-rate-btn' + (on ? " is-on prof-rate-" + value : "") + '"' +
        ' data-prof-rate="' + value + '" data-prof-fid="' + Data.esc(fid) + '"' +
        ' aria-pressed="' + (on ? "true" : "false") + '">' + label + '</button>';
    }
    return '<div class="prof-rate" role="group" aria-label="Good match?">' +
      '<span class="prof-rate-q">Good match?</span> ' + btn("yes", "Yes") + ' ' + btn("no", "No") + '</div>';
  }

  Pages.profile = function (app, params) {
    var id = params && params.id;
    var b = id ? Data.byId(id) : null;
    if (!b) {
      app.innerHTML = Router.notFoundHTML("Sorry, we couldn't find that business on 313Space. It may have moved, or the link is wrong.");
      return;
    }
    document.title = b.name + " | 313Space";

    var esc = Data.esc;
    var name = esc(b.name);
    var top8 = Data.top8For(b.id);
    var friends = top8.list.map(function (f) {
      return { b: Data.byId(f.id), why: f.why };
    }).filter(function (f) { return !!f.b; });
    var n = friends.length;
    var inOthers = Data.friendedBy(b.id).length;
    var site = safeUrl(b.source);
    var today = Data.todayStr();

    var tags = (b.tags || []).map(function (t) { return '<span class="tag-chip">' + esc(t) + '</span>'; }).join(" ");

    /* ---------- LEFT column ---------- */
    var left =
      '<h1 class="prof-name"><span class="glitter">' + name + '</span></h1>' +

      '<div class="prof-picbox">' +
        '<div class="prof-pic">' + Data.picHTML(b, "lg") + '</div>' +
        '<div class="prof-details">' +
          (b.headline ? '<div class="prof-headline">&ldquo;' + esc(b.headline) + '&rdquo;</div>' : "") +
          (b.mood ? '<div class="prof-mood"><b>Mood:</b> ' + esc(b.mood) + '</div>' : "") +
          '<div class="prof-online"><span class="online-now">Online Now!</span></div>' +
          '<div class="prof-loc">' + (b.neighborhood ? esc(b.neighborhood) + '<br>' : "") + 'Detroit, Michigan</div>' +
          '<div class="prof-login small"><b>Last Login:</b><br>' + LAST_LOGIN + '</div>' +
        '</div>' +
      '</div>' +

      (site ? '<div class="prof-viewmy"><b>View My:</b> <a href="' + esc(site) + '" target="_blank" rel="noopener">Website</a></div>' : "") +

      '<div class="prof-contact">' +
        '<div class="prof-contact-head">Contacting ' + name + '</div>' +
        '<div class="prof-contact-grid">' +
          '<button type="button" class="prof-act" data-prof-act="add"><span class="prof-ico prof-ico-add" aria-hidden="true">+</span>Add to Friends</button>' +
          '<button type="button" class="prof-act" data-prof-act="msg"><span class="prof-ico prof-ico-msg" aria-hidden="true">&#9993;&#xFE0E;</span>Send Message</button>' +
          '<button type="button" class="prof-act" data-prof-act="fav"><span class="prof-ico prof-ico-fav" aria-hidden="true">&#9733;&#xFE0E;</span>Add to Favorites</button>' +
          '<button type="button" class="prof-act" data-prof-act="fwd"><span class="prof-ico prof-ico-fwd" aria-hidden="true">&raquo;</span>Forward to Friend</button>' +
        '</div>' +
      '</div>' +

      '<div class="prof-urlbox">' +
        '<b>' + name + '&rsquo;s 313Space URL:</b><br>' +
        '<span class="prof-url">http://www.313space.com/' + esc(b.id) + '</span>' +
      '</div>' +

      '<div class="box prof-interests">' +
        '<div class="box-head">' + name + '&rsquo;s Interests</div>' +
        '<table class="mys"><tbody>' +
          '<tr><td class="lbl">Category</td><td class="val">' + esc(b.category) + '</td></tr>' +
          '<tr><td class="lbl">Price</td><td class="val">' + esc(b.price) + '</td></tr>' +
          '<tr><td class="lbl">Neighborhood</td><td class="val">' + esc(b.neighborhood) + '</td></tr>' +
          '<tr><td class="lbl">Tags</td><td class="val">' + (tags || '<span class="muted">none listed</span>') + '</td></tr>' +
          '<tr><td class="lbl">Details</td><td class="val">' + esc(b.description) + '</td></tr>' +
        '</tbody></table>' +
      '</div>' +

      '<div class="prof-owner-box">Is this your business? <a href="' + Data.editHref(b.id) + '">Edit your Top 8.</a></div>';

    /* ---------- RIGHT column ---------- */
    var badge = top8.source === "owner"
      ? '<span class="badge badge-owner">Top 8 picked by the owner</span>'
      : '<span class="badge badge-ai">Top 8 suggested by AI</span>';

    var grid = n
      ? '<div class="prof-fs-grid">' + friends.map(function (f) { return '<div class="prof-fs-cell">' + Data.tileHTML(f.b, "md") + '</div>'; }).join("") + '</div>'
      : '<p class="prof-empty">' + name + ' doesn&rsquo;t have any friends yet.</p>';

    var comments = n
      ? friends.map(function (f) {
          var fb = f.b, href = Data.profileHref(fb.id);
          return '<table class="prof-comment"><tbody><tr>' +
            '<td class="prof-c-left">' +
              '<a href="' + href + '" class="prof-c-who">' + esc(fb.name) + '</a>' +
              '<a href="' + href + '" class="prof-c-pic" tabindex="-1" aria-hidden="true">' + Data.picHTML(fb, "sm") + '</a>' +
            '</td>' +
            '<td class="prof-c-right">' +
              '<div class="prof-c-date">' + esc(today) + '</div>' +
              '<div class="prof-c-text">' + esc(f.why) + '</div>' +
              rateButtonsHTML(fb.id, Store.getRating(b.id, fb.id)) +
            '</td>' +
          '</tr></tbody></table>';
        }).join("")
      : '<p class="prof-empty">' + name + ' doesn&rsquo;t have any friends yet, so no comments either.</p>';

    var right =
      '<div class="prof-extended"><b>' + name + ' is in your extended network</b></div>' +

      '<div class="box box-orange prof-blurbs">' +
        '<div class="box-head">' + name + '&rsquo;s Blurbs</div>' +
        '<div class="box-body">' +
          '<div class="section-title">About me:</div>' +
          '<p>' + esc(b.aboutMe) + '</p>' +
          '<div class="section-title">Who I&rsquo;d like to meet:</div>' +
          '<p>' + esc(b.whoIdLikeToMeet) + '</p>' +
          '<p class="small muted prof-ai-note">About Me written by AI (Claude) from verified facts.</p>' +
        '</div>' +
      '</div>' +

      '<div class="box box-orange prof-friendspace">' +
        '<div class="box-head">' + name + '&rsquo;s Friend Space</div>' +
        '<div class="box-body">' +
          '<div class="prof-fs-badge">' + badge + '</div>' +
          '<div class="prof-fs-count"><b>' + name + ' has <span class="prof-red">' + n + '</span> ' + plural(n, "friend", "friends") + '.</b></div>' +
          grid +
          '<div class="prof-fs-others small">' + name + ' is in <b>' + inOthers + '</b> other ' + plural(inOthers, "Top 8", "Top 8s") + '.</div>' +
        '</div>' +
      '</div>' +

      '<div class="box box-orange prof-comments">' +
        '<div class="box-head">' + name + '&rsquo;s Friends Comments</div>' +
        '<div class="box-body">' +
          '<div class="prof-c-count"><b>Displaying <span class="prof-red">' + n + '</span> of <span class="prof-red">' + n + '</span> comments</b></div>' +
          comments +
        '</div>' +
      '</div>';

    app.innerHTML = '<div class="profile"><div class="cols">' +
      '<div class="col-left">' + left + '</div>' +
      '<div class="col-right">' + right + '</div>' +
      '</div></div>';

    /* ---------- Events (delegated on the page root; replaced with innerHTML on next route) ---------- */
    var root = app.querySelector(".profile");
    if (!root) return;
    var plainName = String(b.name);

    root.addEventListener("click", function (e) {
      var t = e.target && e.target.closest ? e.target.closest("[data-prof-act],[data-prof-rate]") : null;
      if (!t || !root.contains(t)) return;

      var act = t.getAttribute("data-prof-act");
      if (act) {
        if (act === "add") window.toast("Thanks for the add! " + plainName + " is now in your extended network.");
        else if (act === "msg") window.toast("Message sent! (Just kidding — go visit them in person.)");
        else if (act === "fav") window.toast("Added to Favorites!");
        else if (act === "fwd") forward();
        return;
      }

      var value = t.getAttribute("data-prof-rate");
      var fid = t.getAttribute("data-prof-fid");
      if ((value === "yes" || value === "no") && fid) {
        Store.setRating(b.id, fid, value, top8.source);
        var group = t.parentNode;
        var btns = group ? group.querySelectorAll("[data-prof-rate]") : [];
        for (var i = 0; i < btns.length; i++) {
          var v = btns[i].getAttribute("data-prof-rate");
          var on = v === value;
          btns[i].setAttribute("aria-pressed", on ? "true" : "false");
          btns[i].classList.toggle("is-on", on);
          btns[i].classList.toggle("prof-rate-yes", on && v === "yes");
          btns[i].classList.toggle("prof-rate-no", on && v === "no");
        }
        window.toast("Thanks for the feedback!");
      }
    });

    function forward() {
      var href = String(location.href);
      var done = false;
      function ok() { if (!done) { done = true; window.toast("Link copied to forward to a friend!"); } }
      function fail() { if (!done) { done = true; window.toast("Copy this link to forward: " + href); } }
      try {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
          var p = navigator.clipboard.writeText(href);
          if (p && typeof p.then === "function") p.then(ok, fail).catch(fail);
          else ok();
        } else {
          fail();
        }
      } catch (err) {
        fail();
      }
    }
  };
})();
