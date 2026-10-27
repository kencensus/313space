// Optional photos/logos for business profile pics (files in images/, copied from the credited source): { [businessId]: { src, page, artist, license } }.
// Wikimedia Commons photos (freely licensed, title/description names that business), or the business's own logo/preview image from its official site.
// Businesses without one use the illustrated pic; if a photo fails to load (e.g. offline) the illustration shows instead.
window.BUSINESS_IMAGES = {
  "source-booksellers": {
    src: "images/source-booksellers.jpg",
    page: "https://commons.wikimedia.org/wiki/File:What_an_amazing_selection_at_Source_Booksellers_in_Detroit!_(23807787838).jpg",
    artist: "Senator Stabenow", license: "CC BY 2.0"
  },
  "john-k-king-books": {
    src: "images/john-k-king-books.jpg",
    page: "https://commons.wikimedia.org/wiki/File:John_K._King_Books_(exterior).jpg",
    artist: "Mx. Granger", license: "CC0"
  },
  "cliff-bells": {
    src: "images/cliff-bells.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Cliff_Bell%27s.jpg",
    artist: "Mx. Granger", license: "CC0"
  },
  "garden-bowl": {
    src: "images/garden-bowl.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Detroit_December_2018_16_(Garden_Bowl).jpg",
    artist: "Michael Barera", license: "CC BY-SA 4.0"
  },
  "redford-theatre": {
    src: "images/redford-theatre.jpg",
    page: "https://commons.wikimedia.org/wiki/File:RedfordTheatreMarquee.jpg",
    artist: "Dave Parker", license: "CC BY 3.0"
  },
  // From each business's own official website (logo or the site's own link-preview image); credited on the profile.
  "third-man-records": { src: "images/third-man-records.png", page: "https://thirdmanrecords.com", via: "thirdmanrecords.com", kind: "logo" },
  "submerge-exhibit-3000": { src: "images/submerge-exhibit-3000.png", page: "https://submerge.com", via: "submerge.com", kind: "logo", bg: "#000" },
  "supino-pizzeria": { src: "images/supino-pizzeria.webp", page: "https://supinopizzeria.com", via: "supinopizzeria.com", kind: "logo" },
  "taqueria-el-rey": { src: "images/taqueria-el-rey.jpg", page: "https://www.taqueriaelreydetroit.com", via: "taqueriaelreydetroit.com", kind: "photo" },
  "batch-brewing": { src: "images/batch-brewing.jpg", page: "https://batchbrewingcompany.com", via: "batchbrewingcompany.com", kind: "photo" },
  "planet-ant": { src: "images/planet-ant.webp", page: "https://planetant.com", via: "planetant.com", kind: "logo", bg: "#000" },
  "detroit-artists-market": { src: "images/detroit-artists-market.png", page: "https://detroitartistsmarket.org", via: "detroitartistsmarket.org", kind: "logo" },
  "signal-return": { src: "images/signal-return.webp", page: "https://signalreturnpress.org", via: "signalreturnpress.org", kind: "logo" },
  "good-cakes-and-bakes": { src: "images/good-cakes-and-bakes.png", page: "https://goodcakesandbakes.com", via: "goodcakesandbakes.com", kind: "logo" },
  "sweet-potato-sensations": { src: "images/sweet-potato-sensations.png", page: "https://sweetpotatosensations.com", via: "sweetpotatosensations.com", kind: "logo" },
  "flamingo-vintage": { src: "images/flamingo-vintage.png", page: "https://flamingovintagedetroit.com/", via: "flamingovintagedetroit.com", kind: "logo" },
  "pure-detroit": { src: "images/pure-detroit.png", page: "https://puredetroit.com/", via: "puredetroit.com", kind: "logo" }
};
