# Offline Wiki Guide

The Offline Wiki is a family-approved knowledge shelf that ships inside the portal. It is meant for short, calm articles that kids can read without opening the web.

## Current app behavior

- The app includes a built-in wiki section with starter articles about space, Earth, the body, making, and maps.
- Articles are embedded in `app.js` so the portal works by opening `index.html` directly.
- Kids can save a wiki discovery into Learning Garden, which adds a local learning seed and spark.
- Reading activity is summarized in Parent Growth Insights as local practice data only.

## Content pack format

Future wiki packs should live in `content/wiki/` as JSON files. Keep each pack small enough to review by hand.

```json
{
  "packId": "starter-pack",
  "title": "Starter Offline Wiki",
  "ageRange": "5-12",
  "reviewedBy": "Family",
  "articles": [
    {
      "id": "moon",
      "topic": "space",
      "title": "Why the Moon Changes Shape",
      "summary": "The Moon looks different as sunlight hits it from different angles.",
      "body": "The Moon does not make its own light. We see sunlight bouncing from its surface.",
      "tryThis": "Draw the Moon three nights in a row."
    }
  ]
}
```

## Writing rules

- Use plain language and short paragraphs.
- Prefer curiosity, making, observation, and real-world follow-up.
- Avoid medical, legal, scary, political, or mature content unless a parent intentionally reviews it.
- Do not include links unless they are parent-approved and also added to Parent Controls.
- Keep facts specific enough to be useful, but avoid pretending the portal is a full encyclopedia.

## Future importer

A later version can load JSON packs from `content/wiki/` when the app is served from a local web server. Direct file opening blocks many browser file reads, so the current version keeps critical articles embedded in `app.js`.
