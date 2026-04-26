# Offline Map Packs

This folder is reserved for optional offline map packs.

The app already includes a lightweight built-in atlas, so this folder can stay small. Do not commit huge generated tile sets unless the repository is intentionally moving to Git LFS or release assets.

Recommended pack structure:

```text
maps/
  world-atlas/
    README.md
    places.json
    license.txt
    tiles/
```

Every map pack must include attribution and license notes.
