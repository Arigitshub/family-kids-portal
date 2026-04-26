# Offline Maps Guide

The Travel section is an offline-first world atlas. The current app includes a pan-and-zoom map, real-world regions, place pins, passport stamps, facts, missions, trip notes, and packing lists.

## Current app behavior

- Map rendering is fully local and does not call any map service.
- Kids can zoom with the slider, wheel, plus button, and minus button.
- Kids can drag the map on desktop or touch devices.
- Real-world place cards and map pins are stored in `app.js`.
- Travel progress is stored in browser `localStorage` per kid profile.

## What "offline map packs" mean

A full offline map pack should be a folder that can be reviewed, copied, and shipped with the portal. The starter structure is:

```text
maps/
  world-atlas/
    README.md
    tiles/
      z0/
      z1/
      z2/
    places.json
    license.txt
```

For public distribution, map data must use a license that allows redistribution. OpenStreetMap-derived tiles usually require attribution and careful license handling. Do not copy commercial map tiles into this repo.

## Recommended pack fields

```json
{
  "packId": "world-atlas",
  "title": "Curated World Atlas",
  "license": "Family-reviewed source and attribution",
  "maxZoom": 3,
  "places": [
    {
      "id": "andes",
      "name": "Andes Mountains",
      "region": "nature",
      "x": 28,
      "y": 68,
      "facts": ["The Andes run along western South America."],
      "mission": "Draw a mountain range and label high and low land."
    }
  ]
}
```

## Contributor rules

- Add attribution for every map source.
- Keep place missions constructive and kid-safe.
- Prefer geography, culture, science, art, engineering, and nature.
- Avoid exact home addresses, private locations, and kid-identifying travel data.
- Keep the default app useful without downloading huge tile files.

## Implementation path

1. Keep the current SVG/CSS atlas as the always-available fallback.
2. Add a local tile-pack loader for projects served from a local web server.
3. Add an attribution panel in Travel.
4. Add pack validation so broken map packs do not break the portal.
