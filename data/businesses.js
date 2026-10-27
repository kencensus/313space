// PLACEHOLDER DATA. Replace this whole file with the verified Detroit business list.
// Schema matches the build prompt; the app reads only from window.BUSINESSES.
window.BUSINESSES = [
  {
    id: "example-business-a",
    name: "Example Business A",
    neighborhood: "Corktown",
    category: "Coffee",
    price: "$",
    tags: ["cozy", "late night", "wifi"],
    description: "Placeholder entry. Real, verified business data will replace this file.",
    source: "https://example.com/",
    headline: "Placeholder headline A",
    mood: "caffeinated",
    aboutMe: "I'm a placeholder profile. When the real data file lands, a real Detroit business will live here.",
    whoIdLikeToMeet: "Anyone who wants to test this demo.",
    top8: [
      { id: "example-business-b", why: "Placeholder: B is a friend of A." },
      { id: "example-business-c", why: "Placeholder: C is a friend of A." }
    ],
    top8Source: "ai"
  },
  {
    id: "example-business-b",
    name: "Example Business B",
    neighborhood: "Midtown",
    category: "Records",
    price: "$$",
    tags: ["cozy", "live music", "vinyl"],
    description: "Placeholder entry. Real, verified business data will replace this file.",
    source: "https://example.com/",
    headline: "Placeholder headline B",
    mood: "groovy",
    aboutMe: "I'm a placeholder profile. When the real data file lands, a real Detroit business will live here.",
    whoIdLikeToMeet: "Anyone who wants to test this demo.",
    top8: [
      { id: "example-business-c", why: "Placeholder: C is a friend of B." },
      { id: "example-business-a", why: "Placeholder: A is a friend of B." }
    ],
    top8Source: "ai"
  },
  {
    id: "example-business-c",
    name: "Example Business C",
    neighborhood: "Eastern Market",
    category: "Food",
    price: "$$$",
    tags: ["date night", "late night", "patio"],
    description: "Placeholder entry. Real, verified business data will replace this file.",
    source: "https://example.com/",
    headline: "Placeholder headline C",
    mood: "hungry",
    aboutMe: "I'm a placeholder profile. When the real data file lands, a real Detroit business will live here.",
    whoIdLikeToMeet: "Anyone who wants to test this demo.",
    top8: [
      { id: "example-business-a", why: "Placeholder: A is a friend of C." },
      { id: "example-business-b", why: "Placeholder: B is a friend of C." }
    ],
    top8Source: "ai"
  }
];
window.DIRECTORY_META = { generatedBy: "Claude (Anthropic)", generatedAt: "2026-10-27", minAppearances: 3 };
