/* 313Space — localStorage helpers. Every read/write is wrapped in try/catch;
   if storage is unavailable we fall back to an in-memory object. */
(function () {
  var PREFIX = "313space:";
  var mem = {};

  function get(key, fallback) {
    var raw = null;
    try { raw = window.localStorage.getItem(PREFIX + key); } catch (e) { raw = null; }
    if (raw == null && Object.prototype.hasOwnProperty.call(mem, key)) raw = mem[key];
    if (raw == null) return fallback;
    try { return JSON.parse(raw); } catch (e) { return fallback; }
  }

  function set(key, value) {
    var raw;
    try { raw = JSON.stringify(value); } catch (e) { return false; }
    mem[key] = raw;
    try { window.localStorage.setItem(PREFIX + key, raw); return true; } catch (e) { return false; }
  }

  function remove(key) {
    delete mem[key];
    try { window.localStorage.removeItem(PREFIX + key); } catch (e) { /* ignore */ }
  }

  /* ---- Owner Top 8 overrides: { [businessId]: [friendId, ...] } ---- */
  function getOwnerTop8(id) {
    var all = get("ownerTop8", {}) || {};
    var list = all[id];
    return Array.isArray(list) && list.length ? list.slice() : null;
  }
  function setOwnerTop8(id, friendIds) {
    var all = get("ownerTop8", {}) || {};
    all[id] = (friendIds || []).slice();
    set("ownerTop8", all);
  }
  function clearOwnerTop8(id) {
    var all = get("ownerTop8", {}) || {};
    delete all[id];
    set("ownerTop8", all);
  }
  function getAllOwnerTop8() { return get("ownerTop8", {}) || {}; }

  /* ---- "Good match?" ratings: { "<visit>|bizId>friendId>source": {biz, friend, value:'yes'|'no', source:'ai'|'owner', at} } ---- */
  /* Keyed per page-load "visit" so several KPI testers sharing one device don't overwrite each other;
     a tester changing their mind within a visit replaces their own vote. */
  var VISIT = Date.now().toString(36) + "-" + Math.floor(Math.random() * 1e9).toString(36);
  function ratingKey(bizId, friendId, source) { return VISIT + "|" + bizId + ">" + friendId + ">" + (source || "ai"); }
  function getRatings() { return get("ratings", {}) || {}; }
  function getRating(bizId, friendId, source) {
    var r = getRatings()[ratingKey(bizId, friendId, source)];
    return r ? r.value : null;
  }
  function setRating(bizId, friendId, value, source) {
    var all = getRatings();
    all[ratingKey(bizId, friendId, source)] = { biz: bizId, friend: friendId, value: value, source: source || "ai", at: Date.now() };
    set("ratings", all);
  }

  /* ---- Owner edit timings: [{businessId, mode:'scratch'|'review', seconds, at}] ---- */
  function getEditTimings() { var t = get("editTimings", []); return Array.isArray(t) ? t : []; }
  function addEditTiming(entry) {
    var t = getEditTimings();
    t.push({ businessId: entry.businessId, mode: entry.mode, seconds: Number(entry.seconds) || 0, at: Date.now() });
    set("editTimings", t);
  }

  /* ---- Quiz timings: [{seconds, matchId, at}] ---- */
  function getQuizTimings() { var t = get("quizTimings", []); return Array.isArray(t) ? t : []; }
  function addQuizTiming(entry) {
    var t = getQuizTimings();
    t.push({ seconds: Number(entry.seconds) || 0, matchId: entry.matchId || null, at: Date.now() });
    set("quizTimings", t);
  }

  /* Clears ratings, timings, quiz results AND owner Top 8 overrides. */
  function resetTestData() {
    ["ownerTop8", "ratings", "editTimings", "quizTimings"].forEach(remove);
  }

  window.Store = {
    get: get, set: set, remove: remove,
    getOwnerTop8: getOwnerTop8, setOwnerTop8: setOwnerTop8, clearOwnerTop8: clearOwnerTop8, getAllOwnerTop8: getAllOwnerTop8,
    getRatings: getRatings, getRating: getRating, setRating: setRating,
    getEditTimings: getEditTimings, addEditTiming: addEditTiming,
    getQuizTimings: getQuizTimings, addQuizTiming: addQuizTiming,
    resetTestData: resetTestData
  };
})();
