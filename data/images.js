// Optional photos for business profile pics: { [businessId]: { src, page, artist, license } }.
// Wikimedia Commons photos (freely licensed, title/description names that business), or the business's own logo/preview image from its official site.
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
  },
  // From each business's own official website (logo or the site's own link-preview image); credited on the profile.
  "third-man-records": { src: "https://thirdmanrecords.com/cdn/shop/files/tmr-globe-yellow-favicon-512x512.png?v=1684181258&width=512", page: "https://thirdmanrecords.com", via: "thirdmanrecords.com", kind: "logo" },
  "submerge-exhibit-3000": { src: "https://i0.wp.com/submerge.com/wp-content/uploads/2025/05/cropped-cropped-Submerge.webp?fit=663%2C161&ssl=1", page: "https://submerge.com", via: "submerge.com", kind: "logo", bg: "#000" },
  "supino-pizzeria": { src: "https://images.squarespace-cdn.com/content/v1/5a538647e45a7c0deb549819/1603031564742-3D6ZQPG6SSZD866LNVT6/supino-pizzeria-logo.png?format=500w", page: "https://supinopizzeria.com", via: "supinopizzeria.com", kind: "logo" },
  "taqueria-el-rey": { src: "https://static.spotapps.co/website_images/ab_websites/69228_website_v1/social_share.jpg", page: "https://www.taqueriaelreydetroit.com", via: "taqueriaelreydetroit.com", kind: "photo" },
  "batch-brewing": { src: "https://static.wixstatic.com/media/9ff729_9c1f4172e9b842c29fe2945a9b27aad6%7Emv2.jpg/v1/fit/w_600,h_320,al_c/9ff729_9c1f4172e9b842c29fe2945a9b27aad6%7Emv2.jpg", page: "https://batchbrewingcompany.com", via: "batchbrewingcompany.com", kind: "photo" },
  "planet-ant": { src: "https://images.squarespace-cdn.com/content/v1/626b1da9b72f1038e8b34ad8/bc1e8d10-ef8e-49dd-95e3-e5d0915e1b0a/Plant+Ant+-+Tee+Shirt+Logo+-_Grunge+-+est1993+-+BLK+shirt.png?format=500w", page: "https://planetant.com", via: "planetant.com", kind: "logo", bg: "#000" },
  "detroit-artists-market": { src: "https://detroitartistsmarket.org/wp-content/uploads/2024/01/DAM-LOGO-2023--scaled-1024x614.png", page: "https://detroitartistsmarket.org", via: "detroitartistsmarket.org", kind: "logo" },
  "signal-return": { src: "https://images.squarespace-cdn.com/content/v1/66061ad54bdcfc054f979f76/72bf4b0b-ef36-4eed-98f3-389ab7458668/Two-Color_Stacked_NoTag.png?format=500w", page: "https://signalreturnpress.org", via: "signalreturnpress.org", kind: "logo" },
  "good-cakes-and-bakes": { src: "https://images.getbento.com/accounts/fc86159ae6d1d8fb19094fbff37792e0/media/images/65694GCB_MainStacked_Original.png", page: "https://goodcakesandbakes.com", via: "goodcakesandbakes.com", kind: "logo" },
  "sweet-potato-sensations": { src: "https://images.getbento.com/accounts/bf822a1e3ecb6cc88a593ff38f34053b/media/images/96081sweet-potato-sensations.png", page: "https://sweetpotatosensations.com", via: "sweetpotatosensations.com", kind: "logo" },
  "flamingo-vintage": { src: "https://flamingovintagedetroit.com/cdn/shop/files/Logo_-_Black_only.png?v=1738690433&width=600", page: "https://flamingovintagedetroit.com/", via: "flamingovintagedetroit.com", kind: "logo" },
  "pure-detroit": { src: "https://puredetroit.com/cdn/shop/files/pure-detroit-journal-logo-gray_1_230x92.png?v=1613518726", page: "https://puredetroit.com/", via: "puredetroit.com", kind: "logo" }
};
