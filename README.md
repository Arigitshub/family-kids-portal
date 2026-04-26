# Family Kids Portal

Family Kids Portal is an offline-friendly starter "internet for kids" for one family. It is meant to be a safe home base where kids can create, play, learn, explore, and gradually build a personal identity through avatars, projects, missions, maps, and healthy routines.

This is intentionally not an open web browser. The first version is a self-contained HTML/CSS/JavaScript app that can run directly from the computer with no install step and no required internet connection.

## How to open it

Open this file in a browser:

```text
D:\family-kids-portal\index.html
```

No server is required for the current version.

## What exists now

### Home Base

The home screen is the main launchpad. It includes:

- Multiple kid profiles, each with their own progress, projects, avatar, learning, games, travel, and space work.
- A welcome message using the kid's saved explorer name.
- A family motto controlled from Parent Controls.
- Kid Compass with a balanced daily path: create, learn, play, rest, and kindness.
- Progress stats across projects, learning, games, calm moments, travel, and space.
- Earned badges for making, reading, exploring, stargazing, playing, and helping.
- A "healthy sparks" reward count.
- Quick zone buttons for Avatar, Create, Learn, Play, Space, and Travel.
- A healthy loop with balanced tasks like reading, movement, building, and kindness.
- Daily reward protection so the same task cannot be counted over and over in one day.
- A parent-curated safe link list.

The goal is to make the portal feel like a real place, not a list of links.

### Avatar Builder

Kids can build and manage custom avatars with:

- Avatar background color
- Skin color
- Hair color
- Eye color
- Shirt color
- Hair style
- Expression
- Outfit
- Accessories
- Badge
- A randomizer
- Saving the avatar into the Project Gallery
- Saving avatars into a wardrobe
- Loading and deleting saved avatar looks

The avatar is drawn on canvas and saved in the browser. The small profile avatar in the sidebar updates too.

### Create Studio

Create Studio is a drawing and project-making tool with:

- Pencil, eraser, line, box, and circle tools.
- Brush color and quick color swatches.
- Brush size.
- Background colors.
- Stickers: star, heart, leaf, and moon.
- Canvas clearing
- Project naming
- Saved drawings
- Undo for the most recent strokes
- A "I made something" spark reward

This is the first creative tool. Later it can grow into saved projects, stickers, comic panels, music tools, writing tools, and printable creations.

### Learning Garden

Learning Garden is a full learning dashboard. It is designed to move between screen and real life, not trap kids in passive scrolling.

It includes:

- Subject filters for Reading, Math, Science, and Writing.
- Quest cards with kid-written discovery notes.
- A reading log with book title and pages read.
- A word collector with meanings.
- A question box for things to investigate with a grown-up.
- A learning journal that shows recent saved discoveries.
- A practice shelf for saved words and questions.
- A learning seed count saved locally in the browser.

### Offline Wiki

Offline Wiki is a family-reviewed reading area built into the portal. It includes:

- Short offline articles for space, Earth, the body, making, and maps.
- Topic filters.
- A reading panel designed for calm, focused reading.
- A "save discovery" action that sends the article into Learning Garden.
- Starter JSON pack documentation in `content/wiki/starter-pack.json`.

The current app embeds critical articles in `app.js` so it still works when opened directly from the file system. Future served versions can load reviewed JSON packs from `content/wiki/`.

### Healthy Play

Healthy Play is now a playable games area instead of a list of prompts. It includes:

- Memory Match with clickable cards.
- Math Sprint with five generated addition problems.
- Word Builder with scrambled words.
- Move Timer for a short physical movement challenge.
- 25+ short brain-training games covering memory, focus, language, math, rhythm, logic, kindness, science, creativity, and movement.
- Game win count saved locally.
- Spark rewards for completed games.

The games are intentionally short so play has a clear ending.

### Parent Growth Insights

The Parent Dashboard shows local activity patterns for the current kid profile:

- Favorite area.
- Most practiced skill.
- Recent activity.
- Suggested next activity.

These are not medical, psychological, or diagnostic labels. They are simple local practice summaries to help parents guide balanced activity. Data stays in this browser unless exported.

### Calm Corner

Calm Corner supports emotional health and healthy screen breaks. It includes:

- Guided breathing.
- Feelings check-in.
- Gratitude notes.
- Break timer.
- Calm log.
- Reset ideas for naming feelings, drinking water, looking far away, stretching, and asking for help.

Calm progress is saved per kid profile.

### Space Lab

Space Lab is an interactive space experience:

- Mission Control summary with total space discoveries.
- Canvas-based solar system scene.
- Planet buttons and clickable canvas planets for Mercury, Venus, Earth, Mars, Jupiter, and Saturn.
- Scale mode and asteroid belt toggle.
- Short planet facts.
- Planet stats for day length, year length, and moons.
- Planet-specific missions.
- Observation notes.
- A planet quiz.
- Moon phase explorer with saved Moon observations.
- Rocket builder with saved rocket designs.
- A constellation maker where kids tap to place stars and name the constellation.
- Saved constellations.
- Mission checklist.
- A mission log for notes, quiz wins, constellations, and completed planet missions.
- Space missions that connect the screen to real-world observation and building.

This is the start of a richer "worlds" system. Space can later become one world among many: ocean, jungle, city, history, engineering, art, music, and more.

### Travel Map

The Travel section is an offline real-world atlas and travel center. It includes:

- Pan and zoom controls.
- Mouse-wheel zoom on desktop.
- A simplified real-world map with continents.
- Clickable map pins.
- Region filters for Nature, Maker, Science, and Arts.
- Place cards with missions and facts.
- Passport stamps for visited places.
- A packing checklist.
- Trip notes.
- Saved travel progress in the browser.

This is not yet a live GPS-style tile map. It is a static offline world atlas. A future version can load OpenStreetMap-style tile packs or curated geography packs.

Offline map planning lives in `docs/offline-maps.md`, with starter place data in `content/maps/world-places.json` and a placeholder tile-pack folder in `maps/world-atlas/`.

### Project Gallery

The Project Gallery stores drawings saved from Create Studio. Projects are saved locally in the browser as image data. The gallery keeps the newest 24 projects so it stays lightweight.

When Parent Controls are unlocked, saved projects can be removed from the gallery.

Projects can also be downloaded as image files.

### Parent Controls

Parent Controls currently let you:

- Unlock settings with a parent PIN.
- Add and remove kid profiles.
- Add family-approved safe links.
- Reject invalid links that are not `http` or `https`.
- Remove safe links.
- Change the parent PIN.
- Reset the spark count.
- Export a JSON backup.
- Import a JSON backup.

The default PIN is `1234`. Change it from Parent Controls after the first unlock.

The app stores data in the browser's `localStorage`, so it stays on the same computer/browser profile.

## File structure

```text
family-kids-portal/
  .github/    Issue templates, PR template, and GitHub Pages workflow.
  assets/     App icons and social preview artwork.
  content/    Starter offline wiki and map data packs.
  docs/       Contributor notes for offline wiki and offline maps.
  maps/       Placeholder for future offline map packs.
  index.html   App layout and all sections.
  styles.css   Visual design, layout, responsive behavior.
  app.js       State, rendering, canvas tools, interactions.
  README.md    This guide.
```

## How the app works

The app is deliberately simple:

- `index.html` contains the shell, sidebar, section tabs, and tool surfaces.
- `styles.css` controls the whole visual system.
- `app.js` holds the state and draws the avatar, map interactions, drawing board, space scene, and constellation maker.
- `GITHUB.md` records the intended GitHub remote and push rules for future agents.

There is no build process yet. That keeps the first version easy to open, move, back up, and understand.

## Saved data

The browser saves:

- Explorer name: `portal-name`
- Spark count: `portal-sparks`
- Daily completed task keys: `portal-completed`
- Learning Garden progress: `portal-learning`
- Travel progress: `portal-travel`
- Game progress: `portal-games`
- Local activity insights: `portal-insights`
- Calm Corner progress: `portal-calm`
- Space Lab progress: `portal-space`
- Saved avatar wardrobe: `portal-wardrobe`
- Parent safe links: `portal-links`
- Family settings: `portal-settings`
- Kid profiles: `portal-profiles`
- Active profile: `portal-active-profile`
- Avatar settings: `portal-avatar`
- Saved projects: `portal-projects`
- Parent PIN: `portal-parent-pin`

These values are stored in `localStorage`. Clearing browser site data will reset them.

Saved drawings are compressed before storage, but browser storage is still limited. If storage fills up, export a backup and clear old projects.

## Design principles

This project should grow around a few rules:

- Kid-safe by default.
- Offline-first when possible.
- Parent-curated access to the outside web.
- Creativity over passive consumption.
- Healthy loops that include movement, rest, reading, building, and kindness.
- Simple enough for kids, understandable enough for parents.
- Built in small pieces that can become a real platform.
- Gentle visual feedback: small animations, hover states, reward celebrations, and reduced-motion support.

## Good next build steps

1. Add multiple kid profiles.
2. Add project rename controls behind the parent PIN.
3. Split activity content into editable JSON packs.
4. Add multiple kid profiles with separate projects and sparks.
5. Add more "worlds" like Ocean, Music, Animals, Engineering, and History.
6. Add real offline map packs.
7. Add local-only games with healthy time limits.
8. Add a family dashboard for goals, chores, reading, and creative projects.
9. Add content packs stored as JSON files so new activities can be added without editing the app code.
10. Eventually move to a full app with accounts, local network access, backups, and stronger parental controls.

## Important safety note

This portal is a safe starting place, not a complete parental-control system. It does not block the rest of the internet, control the browser, filter the operating system, or monitor other apps. For a full kid-safe environment, combine this portal with device-level parental controls, browser restrictions, DNS filtering, and family rules.
