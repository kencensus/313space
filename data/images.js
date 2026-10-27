// Optional photos for business profile pics: { [businessId]: { src, page, artist, license } }.
// Only freely licensed Wikimedia Commons photos whose title/description names that specific business.
// Businesses without one use the illustrated pic; if a photo fails to load (e.g. offline) the illustration shows instead.
window.BUSINESS_IMAGES = {
  "source-booksellers": {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/What_an_amazing_selection_at_Source_Booksellers_in_Detroit%21_%2823807787838%29.jpg/500px-What_an_amazing_selection_at_Source_Booksellers_in_Detroit%21_%2823807787838%29.jpg",
    page: "https://commons.wikimedia.org/wiki/File:What_an_amazing_selection_at_Source_Booksellers_in_Detroit!_(23807787838).jpg",
    artist: "Senator Stabenow", license: "CC BY 2.0"
  },
  "john-k-king-books": {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/John_K._King_Books_%28exterior%29.jpg/500px-John_K._King_Books_%28exterior%29.jpg",
    page: "https://commons.wikimedia.org/wiki/File:John_K._King_Books_(exterior).jpg",
    artist: "Mx. Granger", license: "CC0"
  },
  "cliff-bells": {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Cliff_Bell%27s.jpg/500px-Cliff_Bell%27s.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Cliff_Bell%27s.jpg",
    artist: "Mx. Granger", license: "CC0"
  },
  "garden-bowl": {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Detroit_December_2018_16_%28Garden_Bowl%29.jpg/500px-Detroit_December_2018_16_%28Garden_Bowl%29.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Detroit_December_2018_16_(Garden_Bowl).jpg",
    artist: "Michael Barera", license: "CC BY-SA 4.0"
  },
  "redford-theatre": {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/RedfordTheatreMarquee.jpg/500px-RedfordTheatreMarquee.jpg",
    page: "https://commons.wikimedia.org/wiki/File:RedfordTheatreMarquee.jpg",
    artist: "Dave Parker", license: "CC BY 3.0"
  }
};
