# GitHub Publishing Notes

This project is intended to be linked to:

```text
https://github.com/Arigitshub/family-kids-portal
```

Expected Pages URL:

```text
https://arigitshub.github.io/family-kids-portal/
```

## Push rules for future agents

- Work from `D:\family-kids-portal`.
- Check status first with `git status --short --branch`.
- Do not rewrite history.
- Commit intentional changes with a clear message.
- Push to `origin main`.
- Keep `README.md`, `GITHUB.md`, and `package.json` repository links in sync if the repo name changes.
- Keep topic tags aligned with the project purpose: kids, education, offline-first, family, homeschool, kids-games, avatars, offline-wiki, offline-maps, parental-controls, javascript, html, css.
- Before pushing, run `node --check app.js`. If a package manager is installed, `npm run check` runs the same syntax check.

## GitHub Pages

The workflow in `.github/workflows/pages.yml` deploys the static app from the repository root.

After the first push, check the Actions tab. If Pages is not active, enable GitHub Pages with GitHub Actions as the source.

## Offline content docs

- Wiki packs: `docs/offline-wiki.md` and `content/wiki/starter-pack.json`.
- Map packs: `docs/offline-maps.md`, `content/maps/world-places.json`, and `maps/world-atlas/`.
