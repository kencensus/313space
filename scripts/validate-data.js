// Validates data/businesses.js against the 313Space schema.  Usage: node scripts/validate-data.js
const fs = require("fs"), path = require("path"), vm = require("vm");
const file = path.join(__dirname, "..", "data", "businesses.js");
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(file, "utf8"), ctx, { filename: file });
const list = ctx.window.BUSINESSES || [];
const meta = ctx.window.DIRECTORY_META || {};
const CATS = ["Coffee", "Records", "Books", "Food", "Drinks & Music", "Vintage & Goods", "Art & Makers", "Fun & Activities", "Sweets"];
const REQ = ["id", "name", "neighborhood", "category", "price", "tags", "description", "source", "headline", "mood", "aboutMe", "whoIdLikeToMeet", "top8"];
const errors = [], warnings = [];
const ids = new Set();
list.forEach((b, i) => {
  const who = b && b.id ? b.id : "#" + i;
  REQ.forEach(k => { if (b[k] == null || b[k] === "") errors.push(`${who}: missing ${k}`); });
  if (ids.has(b.id)) errors.push(`${who}: duplicate id`);
  ids.add(b.id);
  if (b.id && !/^[a-z0-9-]+$/.test(b.id)) warnings.push(`${who}: id has characters other than a-z 0-9 -`);
  if (!CATS.includes(b.category)) warnings.push(`${who}: category "${b.category}" not in the standard list`);
  if (!["$", "$$", "$$$"].includes(b.price)) errors.push(`${who}: price "${b.price}" must be $, $$ or $$$`);
  if (!Array.isArray(b.tags)) errors.push(`${who}: tags must be an array`);
  if (b.source && !/^https?:\/\//.test(b.source)) errors.push(`${who}: source is not an http(s) URL`);
});
const want = Math.min(8, list.length - 1);
const appear = Object.fromEntries(list.map(b => [b.id, 0]));
list.forEach(b => {
  const t = Array.isArray(b.top8) ? b.top8 : [];
  if (t.length !== want) errors.push(`${b.id}: top8 has ${t.length} entries (expected ${want})`);
  const seen = new Set();
  t.forEach(f => {
    if (!f || !ids.has(f.id)) errors.push(`${b.id}: top8 references unknown id "${f && f.id}"`);
    else if (f.id === b.id) errors.push(`${b.id}: lists itself in top8`);
    else { if (seen.has(f.id)) errors.push(`${b.id}: duplicate friend ${f.id}`); seen.add(f.id); appear[f.id]++; }
    if (!f || !f.why) warnings.push(`${b.id}: top8 entry ${f && f.id} has no "why"`);
  });
});
const counts = Object.values(appear);
const min = counts.length ? Math.min(...counts) : 0;
const minWant = meta.minAppearances || 3;
if (list.length > minWant && min < minWant) errors.push(`min appearances is ${min} (target ${minWant}): ` + Object.entries(appear).filter(([, c]) => c < minWant).map(([id, c]) => `${id}=${c}`).join(", "));
console.log(`${list.length} businesses, ${new Set(list.map(b => b.neighborhood)).size} neighborhoods, ${counts.reduce((a, c) => a + c, 0)} Top 8 links, min appearances ${min}, avg ${(counts.reduce((a, c) => a + c, 0) / (counts.length || 1)).toFixed(1)}`);
warnings.forEach(w => console.log("WARN  " + w));
errors.forEach(e => console.log("ERROR " + e));
console.log(errors.length ? `\n${errors.length} error(s).` : "\nOK: data file is valid.");
process.exit(errors.length ? 1 : 0);
