function readStoredJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

const defaultLinks = [
    { name: "NASA Space Place", url: "https://spaceplace.nasa.gov/", note: "Space stories, crafts, and science." },
    { name: "National Geographic Kids", url: "https://kids.nationalgeographic.com/", note: "Animals, nature, and world facts." },
    { name: "Scratch", url: "https://scratch.mit.edu/", note: "Make stories, games, and animations." },
];

const state = {
  name: localStorage.getItem("portal-name") || "Ari",
  sparks: Math.max(0, Number(localStorage.getItem("portal-sparks") || 0) || 0),
  links: readStoredJson("portal-links", defaultLinks),
  projects: readStoredJson("portal-projects", []),
  completed: readStoredJson("portal-completed", {}),
  learning: readStoredJson("portal-learning", { quests: {}, reading: [], words: [], questions: [] }),
  travel: readStoredJson("portal-travel", { visited: {}, notes: [], packed: {} }),
  games: readStoredJson("portal-games", { wins: 0 }),
  insights: readStoredJson("portal-insights", { events: [], areas: {}, skills: {} }),
  calm: readStoredJson("portal-calm", { feelings: [], gratitude: [], breaths: 0, breaks: [] }),
  space: readStoredJson("portal-space", {
    notes: [],
    constellations: [],
    missions: {},
    quiz: 0,
    rockets: [],
    checklist: {},
    moon: [],
    scaleMode: false,
    asteroids: false,
  }),
  settings: readStoredJson("portal-settings", { motto: "We create, learn, help, and rest." }),
  parentPin: localStorage.getItem("portal-parent-pin") || "1234",
  parentUnlocked: false,
  avatar: readStoredJson("portal-avatar", {
    avatarBgColor: "#dbe9e1",
    skinColor: "#c87954",
    hairColor: "#2f241f",
    eyeColor: "#1d2424",
    shirtColor: "#147c78",
    hairStyle: "short",
    expression: "smile",
    outfit: "tee",
    accessory: "none",
    avatarBadge: "none",
  }),
  wardrobe: readStoredJson("portal-wardrobe", []),
  map: { zoom: 1, x: 0, y: 0 },
};

const profileFields = ["name", "sparks", "projects", "completed", "learning", "travel", "games", "insights", "calm", "space", "avatar", "wardrobe"];
let profiles = readStoredJson("portal-profiles", null);
let activeProfileId = localStorage.getItem("portal-active-profile") || "profile-1";

function snapshotProfile() {
  return {
    name: state.name,
    sparks: state.sparks,
    projects: state.projects,
    completed: state.completed,
    learning: state.learning,
    travel: state.travel,
    games: state.games,
    insights: state.insights,
    calm: state.calm,
    space: state.space,
    avatar: state.avatar,
    wardrobe: state.wardrobe,
  };
}

function ensureProfiles() {
  if (profiles && profiles[activeProfileId]) return;
  profiles = {
    [activeProfileId]: snapshotProfile(),
  };
  localStorage.setItem("portal-profiles", JSON.stringify(profiles));
  localStorage.setItem("portal-active-profile", activeProfileId);
}

function applyProfile(profile) {
  profileFields.forEach((field) => {
    if (profile[field] !== undefined) state[field] = profile[field];
  });
  state.insights ||= { events: [], areas: {}, skills: {} };
  state.wardrobe ||= [];
  state.avatar = {
    avatarBgColor: "#dbe9e1",
    eyeColor: "#1d2424",
    hairStyle: "short",
    outfit: "tee",
    avatarBadge: "none",
    ...state.avatar,
  };
}

ensureProfiles();
applyProfile(profiles[activeProfileId]);

const titles = {
  home: "Home Base",
  avatar: "Avatar Builder",
  create: "Create Studio",
  learn: "Learning Garden",
  wiki: "Offline Wiki",
  play: "Healthy Play",
  calm: "Calm Corner",
  space: "Space Lab",
  travel: "Travel Map",
  projects: "Project Gallery",
  parent: "Parent Controls",
};

const healthyTasks = [
  ["Read 10 pages", "Feed your imagination before more screen time."],
  ["Move for 5 minutes", "Stretch, dance, hop, or balance."],
  ["Build one thing", "Draw, code, write, craft, or make music."],
  ["Kindness check", "Help someone or say something thoughtful."],
];

const dailyPathItems = [
  { key: "daily-create", label: "Create", action: "Make or save one project.", view: "create" },
  { key: "daily-learn", label: "Learn", action: "Save one learning discovery.", view: "learn" },
  { key: "daily-play", label: "Play", action: "Finish one short game or movement timer.", view: "play" },
  { key: "daily-rest", label: "Rest", action: "Take five slow breaths away from the screen.", view: "calm" },
  { key: "daily-kind", label: "Kind", action: "Help someone or say something thoughtful.", view: "home" },
];

const learnQuests = [
  {
    id: "story-lab",
    subject: "writing",
    icon: "ABC",
    title: "Story Lab",
    body: "Write a tiny story with one character, one problem, and one kind ending.",
    prompt: "Who is your character and what do they need?",
  },
  {
    id: "math-market",
    subject: "math",
    icon: "123",
    title: "Math Market",
    body: "Pick three objects, add their pretend prices, then make change from 20.",
    prompt: "What did you buy and how much was left?",
  },
  {
    id: "science-observer",
    subject: "science",
    icon: "SCI",
    title: "Science Observer",
    body: "Observe water, shadows, magnets, plants, or weather. Notice what changes.",
    prompt: "What changed? What stayed the same?",
  },
  {
    id: "quiet-reading",
    subject: "reading",
    icon: "BOOK",
    title: "Quiet Reading",
    body: "Read for 10 minutes and find one sentence worth remembering.",
    prompt: "What sentence or part did you like?",
  },
  {
    id: "question-builder",
    subject: "science",
    icon: "ASK",
    title: "Question Builder",
    body: "Ask a question that starts with why, how, what if, or what happens when.",
    prompt: "What question do you want to investigate?",
  },
  {
    id: "word-travel",
    subject: "reading",
    icon: "LANG",
    title: "Word Travel",
    body: "Learn a new word from a book, a grown-up, or another language.",
    prompt: "What word did you collect?",
  },
  {
    id: "pattern-hunt",
    subject: "math",
    icon: "GRID",
    title: "Pattern Hunt",
    body: "Find a pattern in clothes, tiles, music, blocks, or nature.",
    prompt: "What repeats in your pattern?",
  },
  {
    id: "explain-it",
    subject: "writing",
    icon: "TALK",
    title: "Explain It",
    body: "Teach someone how to do something in three clear steps.",
    prompt: "What are the three steps?",
  },
];

const wikiArticles = [
  {
    id: "moon",
    topic: "space",
    title: "The Moon",
    body: "The Moon is Earth's natural satellite. It reflects sunlight, changes shape in the sky through phases, and helps create ocean tides.",
  },
  {
    id: "rainforest",
    topic: "earth",
    title: "Rainforests",
    body: "Rainforests are warm, wet forests with many layers. They are home to many plants, insects, birds, and animals.",
  },
  {
    id: "brain",
    topic: "body",
    title: "Your Brain",
    body: "Your brain helps you think, remember, move, feel, and learn. Sleep, water, movement, and kindness help it work well.",
  },
  {
    id: "bridges",
    topic: "making",
    title: "Bridges",
    body: "Bridges help people cross water, roads, and valleys. Strong bridges use shapes like triangles, arches, and beams.",
  },
  {
    id: "maps",
    topic: "earth",
    title: "Maps",
    body: "Maps are drawings of places. They can show land, water, roads, borders, directions, and important landmarks.",
  },
  {
    id: "stars",
    topic: "space",
    title: "Stars",
    body: "Stars are huge balls of hot gas that make light. Our Sun is the closest star to Earth.",
  },
];

const planetFacts = {
  Mercury: {
    color: "#b9a38a",
    orbit: 100,
    size: 13,
    fact: "The smallest planet moves around the Sun very quickly.",
    day: "59 Earth days",
    year: "88 Earth days",
    moons: "0",
    mission: "Compare Mercury to a small pebble near a lamp and imagine why it gets so hot and cold.",
    quiz: { question: "Which planet is closest to the Sun?", answer: "Mercury", choices: ["Mercury", "Earth", "Saturn"] },
  },
  Venus: {
    color: "#d9b45f",
    orbit: 145,
    size: 20,
    fact: "Venus is wrapped in thick clouds and is hotter than an oven.",
    day: "243 Earth days",
    year: "225 Earth days",
    moons: "0",
    mission: "Draw thick clouds around a planet and label what the clouds hide.",
    quiz: { question: "Which planet is known for thick clouds and extreme heat?", answer: "Venus", choices: ["Mars", "Venus", "Jupiter"] },
  },
  Earth: {
    color: "#3b8abf",
    orbit: 195,
    size: 22,
    fact: "Earth has liquid water, air, living things, and one Moon.",
    day: "24 hours",
    year: "365 days",
    moons: "1",
    mission: "List three things Earth has that help living things survive.",
    quiz: { question: "How many moons does Earth have?", answer: "1", choices: ["0", "1", "4"] },
  },
  Mars: {
    color: "#c65b43",
    orbit: 245,
    size: 18,
    fact: "Mars has rusty red soil and giant volcanoes.",
    day: "24.6 hours",
    year: "687 Earth days",
    moons: "2",
    mission: "Design a tiny Mars base with air, water, food, and a safe place to sleep.",
    quiz: { question: "Which planet is famous for rusty red soil?", answer: "Mars", choices: ["Mars", "Venus", "Mercury"] },
  },
  Jupiter: {
    color: "#d6a36c",
    orbit: 315,
    size: 42,
    fact: "Jupiter is the biggest planet and has a huge storm.",
    day: "10 hours",
    year: "12 Earth years",
    moons: "Many",
    mission: "Swirl paint or colored pencil to invent a giant storm pattern.",
    quiz: { question: "Which is the biggest planet in this Space Lab?", answer: "Jupiter", choices: ["Earth", "Jupiter", "Mercury"] },
  },
  Saturn: {
    color: "#d8c27b",
    orbit: 390,
    size: 36,
    fact: "Saturn has bright rings made of ice and rock.",
    day: "10.7 hours",
    year: "29 Earth years",
    moons: "Many",
    mission: "Make paper rings and test how wide a ring system can be.",
    quiz: { question: "Which planet has the most famous bright rings?", answer: "Saturn", choices: ["Saturn", "Mars", "Earth"] },
  },
};

const spaceCards = [
  ["Moon watch", "Look for the Moon tonight or draw what shape you think it has."],
  ["Rocket build", "Build a paper rocket and test how far it glides."],
  ["Shadow science", "Put a toy by a lamp and see how the shadow changes when it moves."],
  ["Planet story", "Make up a friendly planet and draw who lives there."],
];

const moonPhaseNames = [
  "New Moon",
  "Waxing Crescent",
  "First Quarter",
  "Waxing Gibbous",
  "Full Moon",
  "Waning Gibbous",
  "Last Quarter",
  "Waning Crescent",
];

const spaceChecklistItems = [
  "Pick a mission",
  "Check your instruments",
  "Draw what you observe",
  "Ask one science question",
  "Rest your eyes",
];

const resetIdeas = [
  ["Name it", "Say: I feel ___ because ___."],
  ["Drink water", "Take a small water break."],
  ["Look far", "Look across the room or out a window for 20 seconds."],
  ["Stretch", "Reach up, fold down, and roll shoulders slowly."],
  ["Ask", "Ask a grown-up for help if a feeling feels too big."],
];

const travelPlaces = [
  {
    id: "amazon-rainforest",
    name: "Amazon Rainforest",
    region: "nature",
    x: 31,
    y: 60,
    mission: "Draw three rainforest layers: forest floor, understory, and canopy.",
    facts: ["The Amazon is in South America.", "Rainforests hold many kinds of plants and animals.", "The Amazon River is one of the world's largest rivers."],
  },
  {
    id: "nile-river",
    name: "Nile River",
    region: "science",
    x: 52,
    y: 54,
    mission: "Make a river map showing source, flow direction, and delta.",
    facts: ["The Nile flows through northeastern Africa.", "River deltas form where rivers meet seas.", "Ancient communities grew near rivers."],
  },
  {
    id: "himalayas",
    name: "Himalayas",
    region: "science",
    x: 69,
    y: 43,
    mission: "Build a paper mountain and mark base, slope, peak, and snow line.",
    facts: ["The Himalayas are in Asia.", "Mount Everest is in the Himalayas.", "Tall mountains affect weather and rivers."],
  },
  {
    id: "great-barrier-reef",
    name: "Great Barrier Reef",
    region: "nature",
    x: 82,
    y: 69,
    mission: "Design a reef creature and explain how it hides or protects itself.",
    facts: ["The Great Barrier Reef is near Australia.", "Coral reefs are living ecosystems.", "Clear warm water helps many reefs grow."],
  },
  {
    id: "sahara-desert",
    name: "Sahara Desert",
    region: "science",
    x: 50,
    y: 47,
    mission: "Pack for a desert trip. Choose what protects from sun, heat, and thirst.",
    facts: ["The Sahara is in northern Africa.", "Deserts get very little rain.", "Some desert nights can be cold."],
  },
  {
    id: "grand-canyon",
    name: "Grand Canyon",
    region: "nature",
    x: 18,
    y: 45,
    mission: "Layer colored paper to show rock layers and erosion.",
    facts: ["The Grand Canyon is in the United States.", "The Colorado River helped carve it.", "Rock layers can tell stories about the past."],
  },
  {
    id: "paris",
    name: "Paris",
    region: "arts",
    x: 47,
    y: 38,
    mission: "Sketch a bridge, tower, museum, or cafe sign.",
    facts: ["Paris is the capital of France.", "Cities grow around rivers, roads, and culture.", "Architecture can show history."],
  },
  {
    id: "tokyo",
    name: "Tokyo",
    region: "maker",
    x: 78,
    y: 43,
    mission: "Design a helpful robot or transit map for a busy city.",
    facts: ["Tokyo is the capital of Japan.", "Large cities need trains, maps, and planning.", "Design helps people move safely."],
  },
];

const packingItems = ["Water", "Snack", "Notebook", "Pencil", "Hat", "Map manners"];
const worldBackdrop = `
  <svg class="world-svg" viewBox="0 0 1200 760" aria-hidden="true">
    <rect width="1200" height="760" fill="#b7d6df"></rect>
    <path d="M95 165 L190 118 L295 145 L350 220 L315 302 L235 318 L165 282 L100 232 Z" fill="#7fb16b"></path>
    <path d="M245 345 L330 390 L350 500 L318 642 L255 695 L205 610 L218 505 L180 420 Z" fill="#67a862"></path>
    <path d="M485 175 L560 158 L635 205 L610 275 L525 282 L462 236 Z" fill="#8aba70"></path>
    <path d="M548 302 L655 320 L705 430 L660 575 L560 535 L505 425 Z" fill="#d0b05d"></path>
    <path d="M650 160 L812 132 L1002 205 L1085 310 L1008 410 L840 360 L720 315 L620 238 Z" fill="#8fbc66"></path>
    <path d="M850 525 L982 548 L1035 635 L958 700 L842 650 Z" fill="#c8a45c"></path>
    <path d="M110 700 L1080 710 L1135 746 L70 748 Z" fill="#d9e4e6"></path>
    <path d="M0 380 H1200 M600 0 V760" stroke="rgba(255,255,255,0.32)" stroke-width="2"></path>
  </svg>
`;

const gameLibrary = {
  memory: { title: "Memory Match", type: "Memory", status: "Match all pairs.", skill: "memory" },
  math: { title: "Math Sprint", type: "Math", status: "Solve five quick problems.", skill: "math" },
  word: { title: "Word Builder", type: "Words", status: "Build the hidden word.", skill: "language" },
  move: { title: "Move Timer", type: "Movement", status: "Complete a short movement challenge.", skill: "movement" },
  pattern: { title: "Pattern Pop", type: "Brain Training", status: "Choose what comes next.", skill: "patterns", prompt: "Red, blue, red, blue, ?", answer: "red", choices: ["red", "green", "yellow"] },
  reaction: { title: "Reaction Star", type: "Focus", status: "Tap the star button.", skill: "focus", prompt: "Wait for the star, then tap it.", answer: "star", choices: ["cloud", "star", "stone"] },
  color: { title: "Color Match", type: "Visual", status: "Pick the matching color.", skill: "visual", prompt: "Which word matches grass?", answer: "green", choices: ["blue", "green", "red"] },
  sound: { title: "Rhythm Tap", type: "Music", status: "Copy the rhythm count.", skill: "rhythm", prompt: "Tap 3 beats.", answer: "3", choices: ["2", "3", "5"] },
  maze: { title: "Mini Maze", type: "Logic", status: "Choose the safe path.", skill: "logic", prompt: "Start -> key -> door. What comes next?", answer: "door", choices: ["tree", "door", "moon"] },
  map: { title: "Map Finder", type: "Geography", status: "Find the map clue.", skill: "spatial", prompt: "Which direction is usually at the top of a map?", answer: "north", choices: ["south", "north", "under"] },
  planet: { title: "Planet Pick", type: "Space", status: "Answer the planet clue.", skill: "science", prompt: "Which planet has rings?", answer: "Saturn", choices: ["Saturn", "Mars", "Earth"] },
  kindness: { title: "Kindness Cards", type: "Social", status: "Pick the kind choice.", skill: "kindness", prompt: "A toy falls. What helps?", answer: "pick it up", choices: ["laugh", "pick it up", "hide"] },
  breath: { title: "Breath Count", type: "Calm", status: "Choose a calm breathing count.", skill: "calm", prompt: "A calm breath can be in for...", answer: "4", choices: ["4", "40", "400"] },
  story: { title: "Story Spinner", type: "Creative", status: "Choose a story part.", skill: "creativity", prompt: "A story needs a...", answer: "character", choices: ["character", "password", "battery"] },
  shape: { title: "Shape Sort", type: "Visual", status: "Pick the shape clue.", skill: "visual", prompt: "Which shape has three sides?", answer: "triangle", choices: ["circle", "triangle", "square"] },
  count: { title: "Count Quest", type: "Math", status: "Count carefully.", skill: "math", prompt: "How many legs do two chairs with 4 legs each have?", answer: "8", choices: ["6", "8", "10"] },
  rhyme: { title: "Rhyme Time", type: "Words", status: "Find the rhyme.", skill: "language", prompt: "What rhymes with star?", answer: "car", choices: ["book", "car", "tree"] },
  opposite: { title: "Opposites", type: "Words", status: "Pick the opposite.", skill: "language", prompt: "Opposite of hot?", answer: "cold", choices: ["warm", "cold", "sun"] },
  memory2: { title: "Big Memory", type: "Memory", status: "Match a bigger board.", skill: "memory" },
  sequence: { title: "Sequence", type: "Memory", status: "Remember the order.", skill: "memory", prompt: "First: sun, second: moon, third?", answer: "star", choices: ["star", "river", "hat"] },
  balance: { title: "Balance Break", type: "Movement", status: "Balance and finish.", skill: "movement", prompt: "Balance safely for 10 seconds, then choose done.", answer: "done", choices: ["done", "skip", "run"] },
  weather: { title: "Weather Wise", type: "Science", status: "Read the weather clue.", skill: "science", prompt: "Dark clouds often mean...", answer: "rain", choices: ["rain", "sand", "sleep"] },
  animal: { title: "Animal Clues", type: "Nature", status: "Guess the animal.", skill: "science", prompt: "I hop and have long ears.", answer: "rabbit", choices: ["fish", "rabbit", "bee"] },
  spacequiz: { title: "Space Quiz", type: "Space", status: "Answer a space clue.", skill: "science", prompt: "Earth has one...", answer: "Moon", choices: ["Moon", "ring", "tail"] },
  art: { title: "Art Choice", type: "Creative", status: "Choose the art tool.", skill: "creativity", prompt: "Which tool makes color on paper?", answer: "crayon", choices: ["spoon", "crayon", "shoe"] },
  logic: { title: "Logic Doors", type: "Logic", status: "Choose the rule.", skill: "logic", prompt: "Only blue keys open blue doors. You have blue. Choose...", answer: "blue door", choices: ["red door", "blue door", "no door"] },
  focus: { title: "Focus Five", type: "Focus", status: "Find the exact number.", skill: "focus", prompt: "Pick the number five.", answer: "5", choices: ["3", "5", "8"] },
};

let activeGame = "memory";
let memoryOpen = [];
let memoryMatched = 0;
let mathRound = 0;
let mathAnswer = 0;
let wordTarget = "";
let moveTimer = null;
let breathTimer = null;
let breakTimer = null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const todayKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};
let planetHitBoxes = {};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return entities[char];
  });
}

function normalizeLink(url) {
  try {
    const parsed = new URL(url);
    if (!["https:", "http:"].includes(parsed.protocol)) return "";
    return parsed.href;
  } catch {
    return "";
  }
}

function save() {
  try {
    profiles[activeProfileId] = snapshotProfile();
    localStorage.setItem("portal-name", state.name);
    localStorage.setItem("portal-sparks", String(state.sparks));
    localStorage.setItem("portal-links", JSON.stringify(state.links));
    localStorage.setItem("portal-avatar", JSON.stringify(state.avatar));
    localStorage.setItem("portal-wardrobe", JSON.stringify(state.wardrobe));
    localStorage.setItem("portal-projects", JSON.stringify(state.projects));
    localStorage.setItem("portal-completed", JSON.stringify(state.completed));
    localStorage.setItem("portal-learning", JSON.stringify(state.learning));
    localStorage.setItem("portal-travel", JSON.stringify(state.travel));
    localStorage.setItem("portal-games", JSON.stringify(state.games));
    localStorage.setItem("portal-insights", JSON.stringify(state.insights));
    localStorage.setItem("portal-calm", JSON.stringify(state.calm));
    localStorage.setItem("portal-space", JSON.stringify(state.space));
    localStorage.setItem("portal-settings", JSON.stringify(state.settings));
    localStorage.setItem("portal-profiles", JSON.stringify(profiles));
    localStorage.setItem("portal-active-profile", activeProfileId);
    localStorage.setItem("portal-parent-pin", state.parentPin);
    return true;
  } catch {
    showToast("Storage is full. Export a backup or clear old projects.");
    return false;
  }
}

function makeProject(name, image) {
  state.projects.unshift({
    id: window.crypto?.randomUUID ? window.crypto.randomUUID() : String(Date.now()),
    name,
    image,
    date: new Date().toLocaleString(),
  });
  state.projects = state.projects.slice(0, 24);
  if (!save()) {
    state.projects.shift();
    save();
    return false;
  }
  renderProjects();
  return true;
}

function canvasToProjectImage(canvas) {
  const maxWidth = 720;
  const scale = Math.min(1, maxWidth / canvas.width);
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = Math.round(canvas.width * scale);
  exportCanvas.height = Math.round(canvas.height * scale);
  const exportCtx = exportCanvas.getContext("2d");
  exportCtx.fillStyle = "#fff";
  exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
  exportCtx.drawImage(canvas, 0, 0, exportCanvas.width, exportCanvas.height);
  return exportCanvas.toDataURL("image/jpeg", 0.86);
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function celebrate(label = "spark") {
  const layer = $("#celebrationLayer");
  const colors = ["#147c78", "#d7664f", "#d79a2b", "#6e9fc9", "#5b8f3c"];
  for (let i = 0; i < 16; i += 1) {
    const piece = document.createElement("span");
    piece.className = "celebration-piece";
    piece.style.setProperty("--x", `${Math.random() * 220 - 110}px`);
    piece.style.setProperty("--y", `${Math.random() * -170 - 40}px`);
    piece.style.setProperty("--r", `${Math.random() * 220 - 110}deg`);
    piece.style.setProperty("--c", colors[i % colors.length]);
    piece.style.left = `${50 + Math.random() * 10 - 5}%`;
    piece.style.top = "72%";
    layer.appendChild(piece);
    window.setTimeout(() => piece.remove(), 900);
  }
  layer.setAttribute("data-label", label);
}

function awardSpark(key = "") {
  if (key) {
    const dailyKey = `${todayKey()}:${key}`;
    if (state.completed[dailyKey]) {
      showToast("Already counted today.");
      return false;
    }
    state.completed[dailyKey] = true;
  }
  state.sparks += 1;
  save();
  renderSparks();
  updateSparkButtons();
  renderHomeDashboard();
  celebrate("spark");
  showToast("+1 healthy spark");
  return true;
}

function isCompletedToday(key) {
  return Boolean(state.completed[`${todayKey()}:${key}`]);
}

function updateSparkButtons() {
  $$(".spark-task").forEach((button) => {
    const key = button.dataset.spark || button.textContent.trim();
    const done = isCompletedToday(key);
    button.disabled = done;
    button.classList.toggle("completed", done);
    if (done) button.textContent = "Done today";
  });
}

function renderSparks() {
  $("#sparkCount").textContent = state.sparks;
}

function renderHomeDashboard() {
  $("#familyMotto").textContent = state.settings.motto || "";
  $("#dailyPath").innerHTML = dailyPathItems
    .map((item) => {
      const done = isCompletedToday(item.key);
      return `
        <article class="path-item ${done ? "complete" : ""}">
          <div>
            <strong>${escapeHtml(item.label)}</strong>
            <p>${escapeHtml(item.action)}</p>
          </div>
          <button class="secondary-action daily-action" data-key="${escapeHtml(item.key)}" data-view="${escapeHtml(item.view)}" type="button">
            ${done ? "Done" : "Go"}
          </button>
        </article>
      `;
    })
    .join("");

  const stats = [
    ["Projects", state.projects.length],
    ["Learning", learningTotal()],
    ["Games", state.games.wins || 0],
    ["Calm", calmTotal()],
    ["Travel", Object.keys(state.travel.visited || {}).length],
    ["Space", (state.space.notes || []).length + (state.space.constellations || []).length],
  ];
  $("#portalStats").innerHTML = stats
    .map(([label, value]) => `<article class="stat-tile"><strong>${value}</strong><span>${label}</span></article>`)
    .join("");

  const badges = [
    { label: "Maker", earned: state.projects.length > 0 },
    { label: "Reader", earned: (state.learning.reading || []).length > 0 },
    { label: "Explorer", earned: Object.keys(state.travel.visited || {}).length > 0 },
    { label: "Stargazer", earned: (state.space.constellations || []).length > 0 },
    { label: "Player", earned: (state.games.wins || 0) > 0 },
    { label: "Calm", earned: calmTotal() > 0 },
    { label: "Helper", earned: isCompletedToday("daily-kind") },
  ];
  $("#badgeShelf").innerHTML = badges
    .map((badge) => `<span class="badge ${badge.earned ? "earned" : ""}">${escapeHtml(badge.label)}</span>`)
    .join("");

  $$(".daily-action").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.view !== "home") {
        setView(button.dataset.view);
        return;
      }
      awardSpark(button.dataset.key);
      renderHomeDashboard();
    });
  });
}

function renderProfiles() {
  $("#profileSelect").innerHTML = Object.entries(profiles)
    .map(([id, profile]) => `<option value="${escapeHtml(id)}" ${id === activeProfileId ? "selected" : ""}>${escapeHtml(profile.name || "Explorer")}</option>`)
    .join("");
}

function switchProfile(id) {
  if (!profiles[id]) return;
  profiles[activeProfileId] = snapshotProfile();
  activeProfileId = id;
  localStorage.setItem("portal-active-profile", activeProfileId);
  applyProfile(profiles[activeProfileId]);
  refreshAll();
  showToast(`Switched to ${state.name}.`);
}

function renderLinks() {
  const linkMarkup = state.links
    .map(
      (link) => `
        <article class="safe-link">
          <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.name)}</a>
          <p>${escapeHtml(link.note || link.url)}</p>
          ${
            state.parentUnlocked
              ? `<button class="secondary-action remove-link" data-url="${escapeHtml(link.url)}" type="button">Remove</button>`
              : ""
          }
        </article>
      `,
    )
    .join("");
  $("#safeLinks").innerHTML = linkMarkup;
  $("#parentLinks").innerHTML = linkMarkup;
  $$(".remove-link").forEach((button) => {
    button.addEventListener("click", () => {
      state.links = state.links.filter((link) => link.url !== button.dataset.url);
      save();
      renderLinks();
      showToast("Safe link removed.");
    });
  });
}

function renderTasks() {
  $("#healthyTasks").innerHTML = healthyTasks
    .map(
      ([title, body]) => `
        <article class="task-item">
          <div>
            <strong>${title}</strong>
            <p>${body}</p>
          </div>
          <button class="secondary-action spark-task" data-spark="task-${escapeHtml(title)}" type="button">Done</button>
        </article>
      `,
    )
    .join("");
}

function renderCards(target, cards) {
  $(target).innerHTML = cards
    .map(
      ([icon, title, body]) => `
        <article class="activity-card">
          <div class="activity-icon">${icon}</div>
          <h3>${title}</h3>
          <p>${body}</p>
          <button class="secondary-action spark-task" data-spark="${escapeHtml(title)}" type="button">Finished</button>
        </article>
      `,
    )
    .join("");
}

function calmTotal() {
  return (state.calm.feelings || []).length + (state.calm.gratitude || []).length + (Number(state.calm.breaths) || 0);
}

function renderCalm() {
  $("#calmCount").textContent = calmTotal();
  const feelings = (state.calm.feelings || []).map((item) => ({ title: item.feeling, body: item.date }));
  const gratitude = (state.calm.gratitude || []).map((item) => ({ title: "Thankful", body: item.text }));
  $("#calmLog").innerHTML = [...feelings, ...gratitude]
    .slice(0, 10)
    .map((entry) => `<article class="journal-item"><strong>${escapeHtml(entry.title)}</strong><p>${escapeHtml(entry.body)}</p></article>`)
    .join("") || `<article class="journal-item"><p>No calm moments saved yet.</p></article>`;
  $("#resetIdeas").innerHTML = resetIdeas
    .map(
      ([title, body]) => `
        <article class="task-item">
          <div>
            <strong>${escapeHtml(title)}</strong>
            <p>${escapeHtml(body)}</p>
          </div>
          <button class="secondary-action spark-task" data-spark="calm-${escapeHtml(title)}" type="button">Tried it</button>
        </article>
      `,
    )
    .join("");
  updateSparkButtons();
}

function completeGame(key) {
  state.games.wins = Math.max(0, Number(state.games.wins) || 0) + 1;
  trackActivity("play", gameLibrary[key]?.skill || "mixed", key);
  $("#gameScore").textContent = state.games.wins;
  save();
  awardSpark(`game-${key}`);
}

function trackActivity(area, skill = "mixed", detail = "") {
  state.insights.areas[area] = (state.insights.areas[area] || 0) + 1;
  state.insights.skills[skill] = (state.insights.skills[skill] || 0) + 1;
  state.insights.events.unshift({ area, skill, detail, date: new Date().toLocaleString() });
  state.insights.events = state.insights.events.slice(0, 80);
}

function renderParentInsights() {
  if (!$("#parentInsights")) return;
  const topArea = Object.entries(state.insights.areas || {}).sort((a, b) => b[1] - a[1])[0];
  const topSkill = Object.entries(state.insights.skills || {}).sort((a, b) => b[1] - a[1])[0];
  const recent = (state.insights.events || []).slice(0, 5);
  const suggestion = topSkill?.[0] === "memory" ? "Try Big Memory or Sequence next." :
    topSkill?.[0] === "math" ? "Try Math Sprint or Count Quest next." :
    topSkill?.[0] === "calm" ? "Try breathing before a harder game." :
    "Try a mix of Create, Calm, and Play today.";
  $("#parentInsights").innerHTML = `
    <article class="insight-card"><strong>Favorite area</strong><p>${escapeHtml(topArea ? topArea[0] : "Not enough activity yet")}</p></article>
    <article class="insight-card"><strong>Most practiced skill</strong><p>${escapeHtml(topSkill ? topSkill[0] : "Not enough activity yet")}</p></article>
    <article class="insight-card"><strong>Suggested next</strong><p>${escapeHtml(suggestion)}</p></article>
    <article class="insight-card wide"><strong>Recent activity</strong><p>${recent.map((event) => escapeHtml(`${event.area}: ${event.detail || event.skill}`)).join("<br>") || "No recent activity."}</p></article>
  `;
}

function renderGame(game = activeGame) {
  activeGame = game;
  const meta = gameLibrary[game];
  $("#gameTitle").textContent = meta.title;
  $("#gameType").textContent = meta.type;
  $("#gameStatus").textContent = meta.status;
  $("#gameScore").textContent = state.games.wins || 0;
  $$(".game-choice").forEach((button) => button.classList.toggle("active", button.dataset.game === game));
  if (game === "memory") renderMemoryGame();
  if (game === "math") renderMathGame();
  if (game === "word") renderWordGame();
  if (game === "move") renderMoveGame();
  if (!["memory", "math", "word", "move", "memory2"].includes(game)) renderChoiceGame(game);
  if (game === "memory2") renderMemoryGame(6);
}

function renderMemoryGame(pairCount = 4) {
  memoryOpen = [];
  memoryMatched = 0;
  const base = ["Sun", "Map", "Book", "Star", "Moon", "Leaf"].slice(0, pairCount);
  const icons = [...base, ...base].sort(() => Math.random() - 0.5);
  $("#gameBoard").className = "game-board memory-board";
  $("#gameBoard").innerHTML = icons
    .map((icon, index) => `<button class="memory-tile" data-icon="${icon}" data-index="${index}" type="button">?</button>`)
    .join("");
  $$(".memory-tile").forEach((tile) => {
    tile.addEventListener("click", () => {
      if (tile.classList.contains("matched") || memoryOpen.includes(tile) || memoryOpen.length === 2) return;
      tile.textContent = tile.dataset.icon;
      memoryOpen.push(tile);
      if (memoryOpen.length === 2) {
        const [first, second] = memoryOpen;
        if (first.dataset.icon === second.dataset.icon) {
          first.classList.add("matched");
          second.classList.add("matched");
          memoryMatched += 1;
          memoryOpen = [];
          if (memoryMatched === pairCount) {
            $("#gameStatus").textContent = "All pairs matched.";
            completeGame(pairCount > 4 ? "memory2" : "memory");
          }
        } else {
          window.setTimeout(() => {
            first.textContent = "?";
            second.textContent = "?";
            memoryOpen = [];
          }, 650);
        }
      }
    });
  });
}

function renderChoiceGame(game) {
  const meta = gameLibrary[game];
  $("#gameBoard").className = "game-board choice-board";
  $("#gameBoard").innerHTML = `
    <div class="choice-prompt">${escapeHtml(meta.prompt)}</div>
    <div class="choice-options">
      ${meta.choices.map((choice) => `<button class="secondary-action choice-answer" data-answer="${escapeHtml(choice)}" type="button">${escapeHtml(choice)}</button>`).join("")}
    </div>
  `;
  $$(".choice-answer").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.answer !== meta.answer) {
        showToast("Try another answer.");
        return;
      }
      $("#gameStatus").textContent = `${meta.title} complete.`;
      completeGame(game);
    });
  });
}

function renderMathGame() {
  mathRound = 0;
  $("#gameBoard").className = "game-board math-board";
  nextMathProblem();
}

function nextMathProblem() {
  mathRound += 1;
  const a = 2 + Math.floor(Math.random() * 10);
  const b = 2 + Math.floor(Math.random() * 10);
  mathAnswer = a + b;
  $("#gameStatus").textContent = `Problem ${mathRound} of 5`;
  $("#gameBoard").innerHTML = `
    <div class="math-problem">${a} + ${b} = ?</div>
    <label>Answer <input id="mathInput" type="number" /></label>
    <button id="checkMath" class="primary-action" type="button">Check</button>
  `;
  $("#checkMath").addEventListener("click", () => {
    if (Number($("#mathInput").value) !== mathAnswer) {
      showToast("Try again.");
      return;
    }
    if (mathRound >= 5) {
      $("#gameStatus").textContent = "Math sprint complete.";
      completeGame("math");
      return;
    }
    nextMathProblem();
  });
}

function renderWordGame() {
  const words = ["planet", "forest", "river", "story", "rocket"];
  wordTarget = words[Math.floor(Math.random() * words.length)];
  const letters = wordTarget.split("").sort(() => Math.random() - 0.5).join(" ");
  $("#gameBoard").className = "game-board word-board";
  $("#gameBoard").innerHTML = `
    <div class="letter-bank">${letters}</div>
    <label>Build the word <input id="wordInput" type="text" maxlength="12" /></label>
    <button id="checkWord" class="primary-action" type="button">Check word</button>
  `;
  $("#checkWord").addEventListener("click", () => {
    if ($("#wordInput").value.trim().toLowerCase() !== wordTarget) {
      showToast("Keep building.");
      return;
    }
    $("#gameStatus").textContent = `You built ${wordTarget}.`;
    completeGame("word");
  });
}

function renderMoveGame() {
  window.clearInterval(moveTimer);
  let seconds = 20;
  $("#gameBoard").className = "game-board move-board";
  $("#gameBoard").innerHTML = `
    <div class="move-count" id="moveCount">${seconds}</div>
    <p>March, stretch, or balance until the timer ends.</p>
    <button id="startMove" class="primary-action" type="button">Start</button>
  `;
  $("#startMove").addEventListener("click", () => {
    $("#startMove").disabled = true;
    moveTimer = window.setInterval(() => {
      seconds -= 1;
      $("#moveCount").textContent = seconds;
      if (seconds <= 0) {
        window.clearInterval(moveTimer);
        $("#gameStatus").textContent = "Movement complete.";
        completeGame("move");
      }
    }, 1000);
  });
}

function learningTotal() {
  return (
    Object.keys(state.learning.quests || {}).length +
    (state.learning.reading || []).length +
    (state.learning.words || []).length +
    (state.learning.questions || []).length
  );
}

function renderLearning(subject = "all") {
  const quests = subject === "all" ? learnQuests : learnQuests.filter((quest) => quest.subject === subject);
  $("#learnCount").textContent = learningTotal();
  $("#learnCards").innerHTML = quests
    .map((quest) => {
      const saved = state.learning.quests?.[quest.id] || "";
      return `
        <article class="learn-card ${saved ? "learn-card-complete" : ""}">
          <div class="activity-icon">${escapeHtml(quest.icon)}</div>
          <div>
            <p class="eyebrow">${escapeHtml(quest.subject)}</p>
            <h3>${escapeHtml(quest.title)}</h3>
            <p>${escapeHtml(quest.body)}</p>
          </div>
          <label>${escapeHtml(quest.prompt)}
            <textarea class="quest-note" data-quest="${escapeHtml(quest.id)}" maxlength="240">${escapeHtml(saved)}</textarea>
          </label>
          <button class="secondary-action save-quest" data-quest="${escapeHtml(quest.id)}" type="button">
            ${saved ? "Update quest" : "Save quest"}
          </button>
        </article>
      `;
    })
    .join("");

  $$(".save-quest").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.quest;
      const note = $(`.quest-note[data-quest="${id}"]`).value.trim();
      if (!note) {
        showToast("Write a discovery first.");
        return;
      }
      state.learning.quests[id] = note;
      trackActivity("learn", "curiosity", id);
      save();
      renderLearning(currentLearnSubject());
      awardSpark(`learn-${id}`);
    });
  });

  renderLearningLists();
}

function currentLearnSubject() {
  return $(".subject-filter.active")?.dataset.subject || "all";
}

function renderLearningLists() {
  const reading = state.learning.reading || [];
  const words = state.learning.words || [];
  const questions = state.learning.questions || [];
  const questEntries = Object.entries(state.learning.quests || {})
    .slice(-4)
    .reverse()
    .map(([id, note]) => {
      const quest = learnQuests.find((item) => item.id === id);
      return { title: quest?.title || "Quest", body: note };
    });

  $("#learningJournal").innerHTML = [...reading.slice(0, 4), ...questEntries]
    .slice(0, 7)
    .map(
      (item) => `
        <article class="journal-item">
          <strong>${escapeHtml(item.title || item.book)}</strong>
          <p>${escapeHtml(item.body || `${item.pages} pages read`)}</p>
        </article>
      `,
    )
    .join("") || `<article class="journal-item"><p>No discoveries saved yet.</p></article>`;

  $("#learningShelf").innerHTML = [
    ...words.map((word) => ({ title: word.word, body: word.meaning })),
    ...questions.map((question) => ({ title: "Question", body: question.text })),
  ]
    .slice(0, 8)
    .map(
      (item) => `
        <article class="journal-item">
          <strong>${escapeHtml(item.title)}</strong>
          <p>${escapeHtml(item.body)}</p>
        </article>
      `,
    )
    .join("") || `<article class="journal-item"><p>No words or questions yet.</p></article>`;
}

function renderWiki(topic = "all") {
  const articles = topic === "all" ? wikiArticles : wikiArticles.filter((article) => article.topic === topic);
  $("#wikiCount").textContent = wikiArticles.length;
  $("#wikiArticles").innerHTML = articles
    .map(
      (article) => `
        <article class="learn-card">
          <div class="activity-icon">${escapeHtml(article.topic.toUpperCase().slice(0, 3))}</div>
          <div>
            <p class="eyebrow">${escapeHtml(article.topic)}</p>
            <h3>${escapeHtml(article.title)}</h3>
            <p>${escapeHtml(article.body.slice(0, 95))}...</p>
          </div>
          <button class="secondary-action read-wiki" data-id="${escapeHtml(article.id)}" type="button">Read</button>
        </article>
      `,
    )
    .join("");
  $$(".read-wiki").forEach((button) => button.addEventListener("click", () => selectWiki(button.dataset.id)));
}

function selectWiki(id) {
  const article = wikiArticles.find((item) => item.id === id) || wikiArticles[0];
  state.wikiSelected = article.id;
  $("#wikiTitle").textContent = article.title;
  $("#wikiBody").textContent = article.body;
  trackActivity("wiki", "reading", article.title);
  save();
}

function currentRegion() {
  return $(".region-filter.active")?.dataset.region || "all";
}

function getPlace(id) {
  return travelPlaces.find((place) => place.id === id) || travelPlaces[0];
}

function renderTravel(region = "all") {
  const places = region === "all" ? travelPlaces : travelPlaces.filter((place) => place.region === region);
  $("#stampCount").textContent = Object.keys(state.travel.visited || {}).length;
  $("#mapWorld").innerHTML = travelPlaces
    .map(
      (place) => `
        <button class="map-pin ${state.travel.visited?.[place.id] ? "visited" : ""}" style="left: ${place.x}%; top: ${place.y}%" data-place="${place.id}" type="button">
          ${escapeHtml(place.name)}
        </button>
      `,
    )
    .join("");
  $("#mapWorld").insertAdjacentHTML("afterbegin", worldBackdrop);
  $("#placeCards").innerHTML = places
    .map(
      (place) => `
        <article class="place-card ${state.travel.visited?.[place.id] ? "visited" : ""}">
          <div>
            <p class="eyebrow">${escapeHtml(place.region)}</p>
            <h3>${escapeHtml(place.name)}</h3>
            <p>${escapeHtml(place.mission)}</p>
          </div>
          <button class="secondary-action choose-place" data-place="${place.id}" type="button">Visit</button>
        </article>
      `,
    )
    .join("");
  renderPassport();
  renderPacking();
  bindTravelChoices();
}

function selectPlace(id) {
  const place = getPlace(id);
  state.travel.selected = id;
  $("#placeTitle").textContent = place.name;
  $("#placeRegion").textContent = `${place.region} stop`;
  $("#placeInfo").textContent = place.mission;
  $("#placeFacts").innerHTML = place.facts.map((fact) => `<p>${escapeHtml(fact)}</p>`).join("");
  $("#stampPlace").disabled = Boolean(state.travel.visited?.[id]);
  $$(".map-pin").forEach((pin) => pin.classList.toggle("active", pin.dataset.place === id));
  $$(".place-card").forEach((card) => card.classList.toggle("active", card.querySelector(".choose-place")?.dataset.place === id));
}

function renderPassport() {
  const visited = Object.keys(state.travel.visited || {}).map(getPlace);
  $("#passportStamps").innerHTML = visited.length
    ? visited
        .map(
          (place) => `
            <article class="passport-stamp">
              <strong>${escapeHtml(place.name)}</strong>
              <p>${escapeHtml(state.travel.visited[place.id])}</p>
            </article>
          `,
        )
        .join("")
    : `<article class="journal-item"><p>No passport stamps yet.</p></article>`;
  $("#tripNotes").innerHTML = (state.travel.notes || []).length
    ? state.travel.notes
        .slice(0, 6)
        .map((note) => `<article class="journal-item"><strong>${escapeHtml(note.place)}</strong><p>${escapeHtml(note.text)}</p></article>`)
        .join("")
    : `<article class="journal-item"><p>No trip notes yet.</p></article>`;
}

function renderPacking() {
  $("#packingList").innerHTML = packingItems
    .map(
      (item) => `
        <label class="pack-item">
          <input class="pack-check" type="checkbox" data-item="${escapeHtml(item)}" ${state.travel.packed?.[item] ? "checked" : ""} />
          ${escapeHtml(item)}
        </label>
      `,
    )
    .join("");
  $$(".pack-check").forEach((input) => {
    input.addEventListener("change", () => {
      state.travel.packed[input.dataset.item] = input.checked;
      save();
    });
  });
}

function bindTravelChoices() {
  $$(".map-pin, .choose-place").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      selectPlace(button.dataset.place);
    });
  });
}

function renderSpaceCards() {
  $("#spaceCards").innerHTML = spaceCards
    .map(
      ([title, body]) => `
        <article class="task-item">
          <div>
            <strong>${title}</strong>
            <p>${body}</p>
          </div>
          <button class="secondary-action spark-task" data-spark="space-${escapeHtml(title)}" type="button">Done</button>
        </article>
      `,
    )
    .join("");
}

function renderSpacePanel(selected = "Mercury") {
  const planet = planetFacts[selected];
  if (!planet) return;
  $("#planetTitle").textContent = selected;
  $("#planetFact").textContent = planet.fact;
  $("#planetStats").innerHTML = `
    <p><strong>Day:</strong> ${escapeHtml(planet.day)}</p>
    <p><strong>Year:</strong> ${escapeHtml(planet.year)}</p>
    <p><strong>Moons:</strong> ${escapeHtml(planet.moons)}</p>
    <p><strong>Mission:</strong> ${escapeHtml(planet.mission)}</p>
  `;
  renderSpaceQuiz(selected);
  renderSpaceLog();
  renderSpaceSummary();
}

function renderSpaceQuiz(selected = "Mercury") {
  const quiz = planetFacts[selected].quiz;
  $("#spaceQuizQuestion").textContent = quiz.question;
  $("#spaceQuizAnswers").innerHTML = quiz.choices
    .map((choice) => `<button class="secondary-action quiz-answer" data-answer="${escapeHtml(choice)}" type="button">${escapeHtml(choice)}</button>`)
    .join("");
  $$(".quiz-answer").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.answer !== quiz.answer) {
        showToast("Try again.");
        return;
      }
      state.space.quiz = Math.max(0, Number(state.space.quiz) || 0) + 1;
      save();
      renderSpaceLog();
      awardSpark(`space-quiz-${selected}`);
      showToast("Correct.");
    });
  });
}

function renderSpaceLog() {
  const notes = state.space.notes || [];
  const constellations = state.space.constellations || [];
  const moon = state.space.moon || [];
  const missions = Object.entries(state.space.missions || {}).map(([planet, date]) => ({
    title: `${planet} mission`,
    body: date,
  }));
  const entries = [
    ...notes.map((note) => ({ title: note.planet, body: note.text })),
    ...constellations.map((item) => ({ title: item.name, body: `${item.stars} stars` })),
    ...moon.map((item) => ({ title: item.phase, body: item.date })),
    ...missions,
  ].slice(0, 10);
  $("#spaceLog").innerHTML = entries.length
    ? entries
        .map((entry) => `<article class="journal-item"><strong>${escapeHtml(entry.title)}</strong><p>${escapeHtml(entry.body)}</p></article>`)
        .join("")
    : `<article class="journal-item"><p>No space discoveries saved yet.</p></article>`;
}

function spaceDiscoveryCount() {
  return (
    (state.space.notes || []).length +
    (state.space.constellations || []).length +
    Object.keys(state.space.missions || {}).length +
    (state.space.rockets || []).length +
    (state.space.moon || []).length +
    (Number(state.space.quiz) || 0)
  );
}

function renderSpaceSummary() {
  $("#spaceScore").textContent = spaceDiscoveryCount();
}

function renderMoonPhase() {
  const canvas = $("#moonCanvas");
  const ctx = canvas.getContext("2d");
  const day = Number($("#moonPhase").value);
  const phaseIndex = Math.min(7, Math.floor((day / 29) * 8));
  const phase = moonPhaseNames[phaseIndex];
  $("#moonLabel").textContent = `${phase} - day ${day}`;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#101828";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f4f1e8";
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 72, 0, Math.PI * 2);
  ctx.fill();
  const shadowOffset = Math.cos((day / 28) * Math.PI * 2) * 72;
  ctx.fillStyle = "rgba(16, 24, 40, 0.9)";
  ctx.beginPath();
  ctx.ellipse(canvas.width / 2 + shadowOffset, canvas.height / 2, 72, 72, 0, 0, Math.PI * 2);
  ctx.fill();
}

function renderRocketPreview() {
  const body = $("#rocketBody").value;
  const windowColor = $("#rocketWindow").value;
  $("#rocketPreview").innerHTML = `
    <div class="rocket-shape" style="--rocket-body: ${escapeHtml(body)}; --rocket-window: ${escapeHtml(windowColor)}">
      <span class="rocket-nose"></span>
      <span class="rocket-window"></span>
      <span class="rocket-fin left"></span>
      <span class="rocket-fin right"></span>
      <span class="rocket-flame"></span>
    </div>
  `;
}

function renderRocketHangar() {
  $("#rocketHangar").innerHTML = (state.space.rockets || []).length
    ? state.space.rockets
        .slice(0, 8)
        .map((rocket) => `<article class="journal-item"><strong>${escapeHtml(rocket.name)}</strong><p>${escapeHtml(rocket.date)}</p></article>`)
        .join("")
    : `<article class="journal-item"><p>No saved rockets yet.</p></article>`;
}

function renderSpaceChecklist() {
  $("#spaceChecklist").innerHTML = spaceChecklistItems
    .map(
      (item) => `
        <label class="pack-item">
          <input class="space-check" type="checkbox" data-item="${escapeHtml(item)}" ${state.space.checklist?.[item] ? "checked" : ""} />
          ${escapeHtml(item)}
        </label>
      `,
    )
    .join("");
  $$(".space-check").forEach((input) => {
    input.addEventListener("change", () => {
      state.space.checklist[input.dataset.item] = input.checked;
      save();
      renderSpaceSummary();
    });
  });
}

function renderProjects() {
  const gallery = $("#projectGallery");
  if (!state.projects.length) {
    gallery.innerHTML = `
      <article class="empty-state">
        <h3>No saved projects yet</h3>
        <p>Make a drawing in Create Studio, then save it here.</p>
      </article>
    `;
    return;
  }

  gallery.innerHTML = state.projects
    .map(
      (project) => `
        <article class="project-card">
          <img src="${project.image}" alt="${escapeHtml(project.name)}" />
          <div>
            <h3>${escapeHtml(project.name)}</h3>
            <p>${escapeHtml(project.date)}</p>
            <a class="secondary-action download-project" href="${project.image}" download="${escapeHtml(project.name)}.png">Download</a>
            ${
              state.parentUnlocked
                ? `<button class="secondary-action remove-project" data-id="${escapeHtml(project.id)}" type="button">Remove</button>`
                : ""
            }
          </div>
        </article>
      `,
    )
    .join("");
  $$(".remove-project").forEach((button) => {
    button.addEventListener("click", () => {
      state.projects = state.projects.filter((project) => project.id !== button.dataset.id);
      save();
      renderProjects();
      showToast("Project removed.");
    });
  });
}

function setView(view) {
  $$(".view").forEach((panel) => panel.classList.toggle("active", panel.id === view));
  $$(".tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.view === view));
  $("#viewTitle").textContent = titles[view];
  document.body.dataset.section = view;
  if (view === "projects") renderProjects();
}

function drawAvatar(canvas) {
  const ctx = canvas.getContext("2d");
  const {
    avatarBgColor = "#dbe9e1",
    skinColor,
    hairColor,
    eyeColor = "#1d2424",
    shirtColor,
    hairStyle = "short",
    expression,
    outfit = "tee",
    accessory,
    avatarBadge = "none",
  } = state.avatar;
  const unit = Math.min(canvas.width, canvas.height);
  const scale = unit / 420;
  const eyeRadius = 8 * scale;
  const mouthWidth = 6 * scale;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = avatarBgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = shirtColor;
  ctx.beginPath();
  ctx.roundRect(canvas.width * 0.24, canvas.height * 0.68, canvas.width * 0.52, canvas.height * 0.28, 26 * scale);
  ctx.fill();
  if (outfit === "hoodie") {
    ctx.strokeStyle = "#fffdf7";
    ctx.lineWidth = 4 * scale;
    ctx.beginPath();
    ctx.arc(canvas.width * 0.5, canvas.height * 0.69, canvas.width * 0.16, 0, Math.PI);
    ctx.stroke();
  }
  if (outfit === "overalls") {
    ctx.fillStyle = "#31524f";
    ctx.fillRect(canvas.width * 0.36, canvas.height * 0.68, canvas.width * 0.08, canvas.height * 0.28);
    ctx.fillRect(canvas.width * 0.56, canvas.height * 0.68, canvas.width * 0.08, canvas.height * 0.28);
  }
  if (outfit === "space") {
    ctx.strokeStyle = "#fffdf7";
    ctx.lineWidth = 7 * scale;
    ctx.strokeRect(canvas.width * 0.33, canvas.height * 0.73, canvas.width * 0.34, canvas.height * 0.12);
  }

  ctx.fillStyle = skinColor;
  ctx.beginPath();
  ctx.arc(canvas.width * 0.5, canvas.height * 0.44, canvas.width * 0.23, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = hairColor;
  ctx.beginPath();
  if (hairStyle === "curly") {
    for (let i = 0; i < 7; i += 1) {
      ctx.beginPath();
      ctx.arc(canvas.width * (0.32 + i * 0.06), canvas.height * 0.34, canvas.width * 0.055, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (hairStyle === "side") {
    ctx.arc(canvas.width * 0.5, canvas.height * 0.34, canvas.width * 0.24, Math.PI, Math.PI * 1.9);
    ctx.fill();
    ctx.fillRect(canvas.width * 0.27, canvas.height * 0.31, canvas.width * 0.36, canvas.height * 0.08);
  } else if (hairStyle === "puffs") {
    ctx.arc(canvas.width * 0.31, canvas.height * 0.35, canvas.width * 0.09, 0, Math.PI * 2);
    ctx.arc(canvas.width * 0.69, canvas.height * 0.35, canvas.width * 0.09, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.arc(canvas.width * 0.5, canvas.height * 0.33, canvas.width * 0.24, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(canvas.width * 0.27, canvas.height * 0.32, canvas.width * 0.46, canvas.height * 0.08);
  }

  ctx.fillStyle = eyeColor;
  ctx.beginPath();
  ctx.arc(canvas.width * 0.42, canvas.height * 0.44, eyeRadius, 0, Math.PI * 2);
  ctx.arc(canvas.width * 0.58, canvas.height * 0.44, eyeRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#1d2424";
  ctx.lineWidth = mouthWidth;
  ctx.lineCap = "round";
  ctx.beginPath();
  if (expression === "focus") ctx.moveTo(canvas.width * 0.42, canvas.height * 0.55), ctx.lineTo(canvas.width * 0.58, canvas.height * 0.55);
  if (expression === "calm") ctx.arc(canvas.width * 0.5, canvas.height * 0.54, 26 * scale, 0.15, Math.PI - 0.15);
  if (expression === "smile") ctx.arc(canvas.width * 0.5, canvas.height * 0.52, 35 * scale, 0.2, Math.PI - 0.2);
  if (expression === "laugh") ctx.arc(canvas.width * 0.5, canvas.height * 0.51, 38 * scale, 0.05, Math.PI - 0.05);
  if (expression === "wow") ctx.arc(canvas.width * 0.5, canvas.height * 0.55, 13 * scale, 0, Math.PI * 2);
  ctx.stroke();

  if (accessory === "glasses") {
    ctx.strokeStyle = "#173f3d";
    ctx.lineWidth = 5 * scale;
    ctx.strokeRect(canvas.width * 0.35, canvas.height * 0.4, 44 * scale, 30 * scale);
    ctx.strokeRect(canvas.width * 0.54, canvas.height * 0.4, 44 * scale, 30 * scale);
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.455, canvas.height * 0.435);
    ctx.lineTo(canvas.width * 0.545, canvas.height * 0.435);
    ctx.stroke();
  }

  if (accessory === "cap") {
    ctx.fillStyle = "#d79a2b";
    ctx.beginPath();
    ctx.roundRect(canvas.width * 0.31, canvas.height * 0.22, canvas.width * 0.38, canvas.height * 0.1, 18 * scale);
    ctx.fill();
    ctx.fillRect(canvas.width * 0.57, canvas.height * 0.29, canvas.width * 0.2, 16 * scale);
  }

  if (accessory === "stars") {
    ctx.fillStyle = "#d79a2b";
    [[0.27, 0.29], [0.73, 0.34], [0.66, 0.2]].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(canvas.width * x, canvas.height * y, 9 * scale, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  if (accessory === "headphones") {
    ctx.strokeStyle = "#173f3d";
    ctx.lineWidth = 7 * scale;
    ctx.beginPath();
    ctx.arc(canvas.width * 0.5, canvas.height * 0.41, canvas.width * 0.25, Math.PI, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#d79a2b";
    ctx.fillRect(canvas.width * 0.25, canvas.height * 0.41, 20 * scale, 44 * scale);
    ctx.fillRect(canvas.width * 0.7, canvas.height * 0.41, 20 * scale, 44 * scale);
  }
  if (accessory === "crown") {
    ctx.fillStyle = "#d79a2b";
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.34, canvas.height * 0.25);
    ctx.lineTo(canvas.width * 0.43, canvas.height * 0.15);
    ctx.lineTo(canvas.width * 0.5, canvas.height * 0.25);
    ctx.lineTo(canvas.width * 0.58, canvas.height * 0.15);
    ctx.lineTo(canvas.width * 0.67, canvas.height * 0.25);
    ctx.closePath();
    ctx.fill();
  }
  if (avatarBadge !== "none") {
    ctx.fillStyle = "#fffdf7";
    ctx.beginPath();
    ctx.arc(canvas.width * 0.64, canvas.height * 0.78, 24 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#173f3d";
    ctx.font = `${16 * scale}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(avatarBadge[0].toUpperCase(), canvas.width * 0.64, canvas.height * 0.795);
  }
}

function renderAvatar() {
  drawAvatar($("#avatarCanvas"));
  drawAvatar($("#miniAvatar"));
  renderWardrobe();
}

function syncAvatarControls() {
  ["avatarBgColor", "skinColor", "hairColor", "eyeColor", "shirtColor", "hairStyle", "expression", "outfit", "accessory", "avatarBadge"].forEach((id) => {
    const input = $(`#${id}`);
    if (input && state.avatar[id]) input.value = state.avatar[id];
  });
}

function renderWardrobe() {
  if (!$("#avatarWardrobe")) return;
  $("#avatarWardrobe").innerHTML = state.wardrobe.length
    ? state.wardrobe
        .map(
          (item) => `
            <article class="wardrobe-item">
              <strong>${escapeHtml(item.name)}</strong>
              <div>
                <button class="secondary-action load-avatar" data-id="${escapeHtml(item.id)}" type="button">Load</button>
                <button class="secondary-action delete-avatar" data-id="${escapeHtml(item.id)}" type="button">Delete</button>
              </div>
            </article>
          `,
        )
        .join("")
    : `<article class="wardrobe-item"><p>No saved avatars yet.</p></article>`;
  $$(".load-avatar").forEach((button) => {
    button.addEventListener("click", () => {
      const item = state.wardrobe.find((avatar) => avatar.id === button.dataset.id);
      if (!item) return;
      state.avatar = { ...item.avatar };
      syncAvatarControls();
      save();
      renderAvatar();
      showToast("Avatar loaded.");
    });
  });
  $$(".delete-avatar").forEach((button) => {
    button.addEventListener("click", () => {
      state.wardrobe = state.wardrobe.filter((avatar) => avatar.id !== button.dataset.id);
      save();
      renderWardrobe();
      showToast("Avatar deleted.");
    });
  });
}

function setupDrawing() {
  const canvas = $("#drawCanvas");
  const ctx = canvas.getContext("2d");
  const drawState = { tool: "pencil", sticker: "", background: "#ffffff" };
  let drawing = false;
  let last = null;
  let start = null;
  const history = [];

  ctx.fillStyle = drawState.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const point = (event) => {
    const rect = canvas.getBoundingClientRect();
    const touch = event.touches?.[0];
    const clientX = touch ? touch.clientX : event.clientX;
    const clientY = touch ? touch.clientY : event.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const pushHistory = () => {
    history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (history.length > 20) history.shift();
  };

  const configureStroke = () => {
    ctx.strokeStyle = drawState.tool === "eraser" ? drawState.background : $("#brushColor").value;
    ctx.fillStyle = $("#brushColor").value;
    ctx.lineWidth = Number($("#brushSize").value);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  const drawSticker = (where) => {
    const size = Number($("#brushSize").value) * 2.2;
    ctx.fillStyle = $("#brushColor").value;
    ctx.strokeStyle = $("#brushColor").value;
    ctx.lineWidth = 4;
    if (drawState.sticker === "star") {
      ctx.beginPath();
      for (let i = 0; i < 10; i += 1) {
        const radius = i % 2 === 0 ? size : size * 0.45;
        const angle = -Math.PI / 2 + (i * Math.PI) / 5;
        const x = where.x + Math.cos(angle) * radius;
        const y = where.y + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    }
    if (drawState.sticker === "heart") {
      ctx.beginPath();
      ctx.moveTo(where.x, where.y + size * 0.45);
      ctx.bezierCurveTo(where.x - size, where.y - size * 0.25, where.x - size * 0.35, where.y - size, where.x, where.y - size * 0.35);
      ctx.bezierCurveTo(where.x + size * 0.35, where.y - size, where.x + size, where.y - size * 0.25, where.x, where.y + size * 0.45);
      ctx.fill();
    }
    if (drawState.sticker === "leaf") {
      ctx.beginPath();
      ctx.ellipse(where.x, where.y, size * 0.55, size, -0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = drawState.background;
      ctx.beginPath();
      ctx.moveTo(where.x - size * 0.35, where.y + size * 0.5);
      ctx.lineTo(where.x + size * 0.35, where.y - size * 0.5);
      ctx.stroke();
    }
    if (drawState.sticker === "moon") {
      ctx.beginPath();
      ctx.arc(where.x, where.y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = drawState.background;
      ctx.beginPath();
      ctx.arc(where.x + size * 0.35, where.y - size * 0.15, size * 0.9, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawShape = (from, to) => {
    configureStroke();
    ctx.beginPath();
    if (drawState.tool === "line") {
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    }
    if (drawState.tool === "rect") {
      ctx.strokeRect(from.x, from.y, to.x - from.x, to.y - from.y);
    }
    if (drawState.tool === "circle") {
      const radius = Math.hypot(to.x - from.x, to.y - from.y);
      ctx.arc(from.x, from.y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  const move = (event) => {
    if (!drawing) return;
    event.preventDefault();
    const next = point(event);
    if (!["pencil", "eraser"].includes(drawState.tool)) return;
    configureStroke();
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(next.x, next.y);
    ctx.stroke();
    last = next;
  };

  canvas.addEventListener("pointerdown", (event) => {
    pushHistory();
    drawing = true;
    last = point(event);
    start = last;
    if (drawState.sticker) {
      drawSticker(last);
      drawing = false;
    }
  });
  canvas.addEventListener("pointermove", move);
  window.addEventListener("pointerup", (event) => {
    if (drawing && start && !["pencil", "eraser"].includes(drawState.tool)) {
      drawShape(start, point(event));
    }
    drawing = false;
  });
  $("#clearDrawing").addEventListener("click", () => {
    pushHistory();
    ctx.fillStyle = drawState.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    showToast("Canvas cleared.");
  });
  $("#undoDrawing").addEventListener("click", () => {
    const previous = history.pop();
    if (!previous) {
      showToast("Nothing to undo.");
      return;
    }
    ctx.putImageData(previous, 0, 0);
  });
  $$(".draw-tool").forEach((button) => {
    button.addEventListener("click", () => {
      drawState.tool = button.dataset.tool;
      drawState.sticker = "";
      $$(".draw-tool").forEach((tool) => tool.classList.toggle("active", tool === button));
      $$(".sticker-button").forEach((sticker) => sticker.classList.remove("active"));
    });
  });
  $$(".color-swatch").forEach((button) => {
    button.addEventListener("click", () => {
      $("#brushColor").value = button.dataset.color;
    });
  });
  $("#canvasBackground").addEventListener("change", (event) => {
    pushHistory();
    drawState.background = event.target.value;
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = drawState.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "source-over";
  });
  $$(".sticker-button").forEach((button) => {
    button.addEventListener("click", () => {
      drawState.sticker = button.dataset.sticker;
      drawState.tool = "sticker";
      $$(".draw-tool").forEach((tool) => tool.classList.remove("active"));
      $$(".sticker-button").forEach((sticker) => sticker.classList.toggle("active", sticker === button));
    });
  });
  $("#saveDrawing").addEventListener("click", () => {
    const name = $("#projectName").value.trim() || `Drawing ${state.projects.length + 1}`;
    if (makeProject(name, canvasToProjectImage(canvas))) {
      trackActivity("create", "creativity", "drawing");
      $("#projectName").value = "";
      awardSpark("save-project");
      showToast("Project saved.");
    }
  });
}

function setupMap() {
  const world = $("#mapWorld");
  const viewport = $("#mapViewport");
  let dragging = false;
  let start = { x: 0, y: 0 };

  const apply = () => {
    state.map.x = Math.min(80, Math.max(state.map.x, viewport.clientWidth - 1200 * state.map.zoom - 80));
    state.map.y = Math.min(80, Math.max(state.map.y, viewport.clientHeight - 760 * state.map.zoom - 80));
    world.style.transform = `translate(${state.map.x}px, ${state.map.y}px) scale(${state.map.zoom})`;
    $("#mapZoom").value = state.map.zoom;
  };

  $("#mapZoom").addEventListener("input", (event) => {
    state.map.zoom = Number(event.target.value);
    apply();
  });
  $("#zoomIn").addEventListener("click", () => {
    state.map.zoom = Math.min(3, state.map.zoom + 0.2);
    apply();
  });
  $("#zoomOut").addEventListener("click", () => {
    state.map.zoom = Math.max(1, state.map.zoom - 0.2);
    apply();
  });
  $("#resetMap").addEventListener("click", () => {
    state.map = { zoom: 1, x: 0, y: 0 };
    apply();
  });
  viewport.addEventListener("pointerdown", (event) => {
    dragging = true;
    start = { x: event.clientX - state.map.x, y: event.clientY - state.map.y };
    viewport.setPointerCapture(event.pointerId);
  });
  viewport.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    state.map.x = event.clientX - start.x;
    state.map.y = event.clientY - start.y;
    apply();
  });
  viewport.addEventListener("pointerup", () => {
    dragging = false;
  });
  viewport.addEventListener("pointercancel", () => {
    dragging = false;
  });
  viewport.addEventListener("wheel", (event) => {
    event.preventDefault();
    state.map.zoom = Math.min(3, Math.max(1, state.map.zoom + (event.deltaY < 0 ? 0.12 : -0.12)));
    apply();
  });
  apply();
}

function drawSpace(selected = "Mercury") {
  const canvas = $("#spaceCanvas");
  const ctx = canvas.getContext("2d");
  const center = { x: canvas.width * 0.5, y: canvas.height * 0.52 };

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#101828";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
  for (let i = 0; i < 90; i += 1) {
    const x = (i * 113) % canvas.width;
    const y = (i * 67) % canvas.height;
    ctx.fillRect(x, y, i % 4 === 0 ? 2 : 1, i % 5 === 0 ? 2 : 1);
  }

  ctx.fillStyle = "#f2c45b";
  ctx.beginPath();
  ctx.arc(center.x, center.y, 58, 0, Math.PI * 2);
  ctx.fill();
  planetHitBoxes = {};

  Object.entries(planetFacts).forEach(([name, planet], index) => {
    const orbit = state.space.scaleMode ? planet.orbit * 0.92 : 92 + index * 58;
    const size = state.space.scaleMode ? planet.size : Math.max(15, Math.min(30, planet.size * 0.72));
    ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(center.x, center.y, orbit, orbit * 0.42, 0, 0, Math.PI * 2);
    ctx.stroke();

    const angle = 0.65 + index * 0.7;
    const x = center.x + Math.cos(angle) * orbit;
    const y = center.y + Math.sin(angle) * orbit * 0.42;
    planetHitBoxes[name] = { x, y, radius: size + 18 };
    ctx.fillStyle = planet.color;
    ctx.beginPath();
    ctx.arc(x, y, size + (name === selected ? 6 : 0), 0, Math.PI * 2);
    ctx.fill();

    if (name === "Saturn") {
      ctx.strokeStyle = "rgba(255, 253, 247, 0.82)";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(x, y, size + 18, 9, -0.25, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (name === selected) {
      ctx.strokeStyle = "#fffdf7";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(x, y, size + 12, 0, Math.PI * 2);
      ctx.stroke();
    }
  });

  if (state.space.asteroids) {
    ctx.fillStyle = "rgba(216, 194, 123, 0.85)";
    for (let i = 0; i < 48; i += 1) {
      const angle = i * 0.56;
      const radius = 270 + (i % 9) * 6;
      const x = center.x + Math.cos(angle) * radius;
      const y = center.y + Math.sin(angle) * radius * 0.42;
      ctx.beginPath();
      ctx.arc(x, y, 2 + (i % 3), 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function setupSpace() {
  let selected = "Mercury";
  let starPoints = [];
  let constellationName = "";
  const spaceCanvas = $("#spaceCanvas");
  const starsCanvas = $("#starsCanvas");
  const starCtx = starsCanvas.getContext("2d");
  const choosePlanet = (planet) => {
    selected = planet;
    $$(".planet-choice").forEach((choice) => choice.classList.toggle("active", choice.dataset.planet === planet));
    renderSpacePanel(selected);
    drawSpace(selected);
  };

  const drawStars = () => {
    starCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
    starCtx.fillStyle = "#101828";
    starCtx.fillRect(0, 0, starsCanvas.width, starsCanvas.height);
    starCtx.strokeStyle = "rgba(255, 253, 247, 0.65)";
    starCtx.lineWidth = 2;
    if (starPoints.length > 1) {
      starCtx.beginPath();
      starCtx.moveTo(starPoints[0].x, starPoints[0].y);
      starPoints.slice(1).forEach((point) => starCtx.lineTo(point.x, point.y));
      starCtx.stroke();
    }
    starCtx.fillStyle = "#f2c45b";
    starPoints.forEach((point) => {
      starCtx.beginPath();
      starCtx.arc(point.x, point.y, 5, 0, Math.PI * 2);
      starCtx.fill();
    });
  };

  $$(".planet-choice").forEach((button) => {
    button.addEventListener("click", () => choosePlanet(button.dataset.planet));
  });

  spaceCanvas.addEventListener("pointerdown", (event) => {
    const rect = spaceCanvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * spaceCanvas.width;
    const y = ((event.clientY - rect.top) / rect.height) * spaceCanvas.height;
    const hit = Object.entries(planetHitBoxes).find(([, box]) => Math.hypot(box.x - x, box.y - y) <= box.radius);
    if (hit) choosePlanet(hit[0]);
  });

  starsCanvas.addEventListener("pointerdown", (event) => {
    const rect = starsCanvas.getBoundingClientRect();
    starPoints.push({
      x: ((event.clientX - rect.left) / rect.width) * starsCanvas.width,
      y: ((event.clientY - rect.top) / rect.height) * starsCanvas.height,
    });
    $("#starName").textContent = `${starPoints.length} stars placed.`;
    drawStars();
  });

  $("#clearStars").addEventListener("click", () => {
    starPoints = [];
    constellationName = "";
    $("#starName").textContent = "No constellation yet.";
    drawStars();
  });
  $("#nameStars").addEventListener("click", () => {
    const names = ["Brave Lantern", "Kind Comet", "Sleepy Rocket", "Moon Ladder", "Tiny Compass"];
    constellationName = starPoints.length ? names[Math.floor(Math.random() * names.length)] : "";
    $("#starName").textContent = starPoints.length ? `Constellation: ${constellationName}` : "Place a few stars first.";
    if (starPoints.length) awardSpark("constellation");
  });
  $("#saveConstellation").addEventListener("click", () => {
    if (!starPoints.length) {
      showToast("Place stars first.");
      return;
    }
    if (!constellationName) constellationName = `Constellation ${state.space.constellations.length + 1}`;
    state.space.constellations.unshift({ name: constellationName, stars: starPoints.length, date: new Date().toLocaleDateString() });
    state.space.constellations = state.space.constellations.slice(0, 20);
    save();
    renderSpaceLog();
    renderSpaceSummary();
    showToast("Constellation saved.");
  });
  $("#saveSpaceNote").addEventListener("click", () => {
    const text = $("#spaceNote").value.trim();
    if (!text) {
      showToast("Write an observation first.");
      return;
    }
    state.space.notes.unshift({ planet: selected, text, date: new Date().toLocaleDateString() });
    state.space.notes = state.space.notes.slice(0, 30);
    $("#spaceNote").value = "";
    save();
    renderSpaceLog();
    renderSpaceSummary();
    awardSpark(`space-note-${selected}`);
  });
  $("#spaceSpark").addEventListener("click", () => {
    state.space.missions[selected] = new Date().toLocaleDateString();
    save();
    renderSpaceLog();
    renderSpaceSummary();
    awardSpark(`planet-${selected}`);
  });
  $("#spaceScaleMode").addEventListener("click", (event) => {
    state.space.scaleMode = !state.space.scaleMode;
    event.currentTarget.setAttribute("aria-pressed", String(state.space.scaleMode));
    drawSpace(selected);
    save();
  });
  $("#asteroidToggle").addEventListener("click", (event) => {
    state.space.asteroids = !state.space.asteroids;
    event.currentTarget.setAttribute("aria-pressed", String(state.space.asteroids));
    drawSpace(selected);
    save();
  });
  $("#moonPhase").addEventListener("input", renderMoonPhase);
  $("#saveMoonNote").addEventListener("click", () => {
    const label = $("#moonLabel").textContent;
    state.space.moon.unshift({ phase: label, date: new Date().toLocaleDateString() });
    state.space.moon = state.space.moon.slice(0, 20);
    save();
    renderSpaceLog();
    renderSpaceSummary();
    awardSpark("moon-phase");
  });
  ["rocketBody", "rocketWindow"].forEach((id) => $(`#${id}`).addEventListener("input", renderRocketPreview));
  $("#saveRocket").addEventListener("click", () => {
    const name = $("#rocketName").value.trim() || `Rocket ${state.space.rockets.length + 1}`;
    state.space.rockets.unshift({
      name,
      body: $("#rocketBody").value,
      window: $("#rocketWindow").value,
      date: new Date().toLocaleDateString(),
    });
    state.space.rockets = state.space.rockets.slice(0, 20);
    $("#rocketName").value = "";
    save();
    renderRocketHangar();
    renderSpaceSummary();
    awardSpark("rocket-builder");
  });

  renderSpacePanel(selected);
  $("#spaceScaleMode").setAttribute("aria-pressed", String(state.space.scaleMode));
  $("#asteroidToggle").setAttribute("aria-pressed", String(state.space.asteroids));
  renderMoonPhase();
  renderRocketPreview();
  renderRocketHangar();
  renderSpaceChecklist();
  drawSpace(selected);
  drawStars();
}

function setupEvents() {
  $$(".tab").forEach((tab) => tab.addEventListener("click", () => setView(tab.dataset.view)));
  $$("[data-jump]").forEach((button) => button.addEventListener("click", () => setView(button.dataset.jump)));
  $$(".spark-task").forEach((button) => {
    button.addEventListener("click", () => awardSpark(button.dataset.spark || button.textContent.trim()));
  });
  $$(".subject-filter").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".subject-filter").forEach((filter) => filter.classList.toggle("active", filter === button));
      renderLearning(button.dataset.subject);
    });
  });
  $$(".wiki-filter").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".wiki-filter").forEach((filter) => filter.classList.toggle("active", filter === button));
      renderWiki(button.dataset.topic);
    });
  });
  $("#saveWikiDiscovery").addEventListener("click", () => {
    if (!state.wikiSelected) {
      showToast("Read an article first.");
      return;
    }
    const article = wikiArticles.find((item) => item.id === state.wikiSelected);
    state.learning.quests[`wiki-${article.id}`] = article.body;
    trackActivity("wiki", "curiosity", article.title);
    save();
    awardSpark(`wiki-${article.id}`);
  });
  $$(".region-filter").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".region-filter").forEach((filter) => filter.classList.toggle("active", filter === button));
      renderTravel(button.dataset.region);
      if (state.travel.selected) selectPlace(state.travel.selected);
    });
  });
  $$(".game-choice").forEach((button) => {
    button.addEventListener("click", () => renderGame(button.dataset.game));
  });
  $("#newGame").addEventListener("click", () => renderGame(activeGame));
  $$(".feeling-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.calm.feelings.unshift({ feeling: button.dataset.feeling, date: new Date().toLocaleString() });
      trackActivity("calm", "feelings", button.dataset.feeling);
      state.calm.feelings = state.calm.feelings.slice(0, 30);
      save();
      renderCalm();
      awardSpark(`feeling-${button.dataset.feeling}`);
    });
  });
  $("#saveGratitude").addEventListener("click", () => {
    const text = $("#gratitudeInput").value.trim();
    if (!text) {
      showToast("Write one thankful thing.");
      return;
    }
    state.calm.gratitude.unshift({ text, date: new Date().toLocaleString() });
    trackActivity("calm", "gratitude", "gratitude");
    state.calm.gratitude = state.calm.gratitude.slice(0, 30);
    $("#gratitudeInput").value = "";
    save();
    renderCalm();
    awardSpark("gratitude");
  });
  $("#startBreathing").addEventListener("click", () => {
    window.clearInterval(breathTimer);
    const steps = ["Breathe in", "Hold", "Breathe out", "Rest"];
    let index = 0;
    $("#breathCircle").classList.add("active");
    $("#breathInstruction").textContent = steps[index];
    breathTimer = window.setInterval(() => {
      index += 1;
      if (index >= 12) {
        window.clearInterval(breathTimer);
        $("#breathCircle").classList.remove("active");
        $("#breathInstruction").textContent = "Breathing complete";
        state.calm.breaths = (Number(state.calm.breaths) || 0) + 1;
        trackActivity("calm", "calm", "breathing");
        save();
        renderCalm();
        awardSpark("breathing");
        return;
      }
      $("#breathInstruction").textContent = steps[index % steps.length];
    }, 3000);
  });
  $("#stopBreathing").addEventListener("click", () => {
    window.clearInterval(breathTimer);
    $("#breathCircle").classList.remove("active");
    $("#breathInstruction").textContent = "Ready";
  });
  $("#startBreak").addEventListener("click", () => {
    window.clearInterval(breakTimer);
    let seconds = Math.max(1, Number($("#breakMinutes").value) || 5) * 60;
    $("#breakStatus").textContent = `${Math.ceil(seconds / 60)} minutes left.`;
    breakTimer = window.setInterval(() => {
      seconds -= 1;
      $("#breakStatus").textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")} left.`;
      if (seconds <= 0) {
        window.clearInterval(breakTimer);
        state.calm.breaks.unshift({ minutes: Number($("#breakMinutes").value), date: new Date().toLocaleString() });
        state.calm.breaks = state.calm.breaks.slice(0, 20);
        save();
        $("#breakStatus").textContent = "Break complete.";
        awardSpark("screen-break");
      }
    }, 1000);
  });
  $("#profileSelect").addEventListener("change", (event) => switchProfile(event.target.value));
  $("#kidName").value = state.name;
  $("#kidName").addEventListener("input", (event) => {
    state.name = event.target.value || "Explorer";
    $("#welcomeTitle").textContent = `${state.name}, choose one good thing to do next.`;
    save();
    renderProfiles();
  });
  $("#calmMode").addEventListener("click", (event) => {
    const active = document.body.classList.toggle("calm");
    event.currentTarget.setAttribute("aria-pressed", String(active));
  });
  ["avatarBgColor", "skinColor", "hairColor", "eyeColor", "shirtColor", "hairStyle", "expression", "outfit", "accessory", "avatarBadge"].forEach((id) => {
    const input = $(`#${id}`);
    input.value = state.avatar[id];
    input.addEventListener("input", () => {
      state.avatar[id] = input.value;
      save();
      renderAvatar();
    });
  });
  $("#randomAvatar").addEventListener("click", () => {
    const colors = ["#c87954", "#8c563b", "#e0a77f", "#6f4b3e", "#b66f54"];
    const hair = ["#2f241f", "#5a3828", "#1c1a18", "#8c5b32", "#67422c"];
    const shirts = ["#147c78", "#d7664f", "#5b8f3c", "#6e9fc9", "#d79a2b"];
    const pick = (items) => items[Math.floor(Math.random() * items.length)];
    state.avatar = {
      avatarBgColor: pick(["#dbe9e1", "#f4f1e8", "#e7d7a8", "#cfe2d0"]),
      skinColor: pick(colors),
      hairColor: pick(hair),
      eyeColor: pick(["#1d2424", "#31524f", "#5a3828", "#147c78"]),
      shirtColor: pick(shirts),
      hairStyle: pick(["short", "curly", "side", "puffs"]),
      expression: pick(["smile", "focus", "laugh", "calm", "wow"]),
      outfit: pick(["tee", "hoodie", "overalls", "space"]),
      accessory: pick(["none", "glasses", "cap", "stars", "headphones", "crown"]),
      avatarBadge: pick(["none", "maker", "reader", "helper", "explorer"]),
    };
    Object.entries(state.avatar).forEach(([key, value]) => {
      $(`#${key}`).value = value;
    });
    awardSpark("avatar-randomizer");
    save();
    renderAvatar();
  });
  $("#saveWardrobeAvatar").addEventListener("click", () => {
    const name = $("#avatarName").value.trim() || `Avatar ${state.wardrobe.length + 1}`;
    state.wardrobe.unshift({
      id: window.crypto?.randomUUID ? window.crypto.randomUUID() : String(Date.now()),
      name,
      avatar: { ...state.avatar },
      date: new Date().toLocaleString(),
    });
    state.wardrobe = state.wardrobe.slice(0, 30);
    $("#avatarName").value = "";
    trackActivity("avatar", "identity", name);
    save();
    renderWardrobe();
    awardSpark("wardrobe-avatar");
  });
  $("#saveAvatar").addEventListener("click", () => {
    if (makeProject(`${state.name || "Explorer"} avatar`, $("#avatarCanvas").toDataURL("image/png"))) {
      awardSpark("save-avatar");
      showToast("Avatar saved.");
    }
  });
  $("#saveSpark").addEventListener("click", () => awardSpark("made-something"));
  $("#addReading").addEventListener("click", () => {
    const title = $("#bookTitle").value.trim();
    const pages = Math.max(1, Number($("#bookPages").value) || 0);
    if (!title || !pages) {
      showToast("Add a book title and pages.");
      return;
    }
    state.learning.reading.unshift({ title, pages, date: new Date().toLocaleDateString() });
    trackActivity("learn", "reading", title);
    state.learning.reading = state.learning.reading.slice(0, 20);
    $("#bookTitle").value = "";
    $("#bookPages").value = "";
    save();
    renderLearning(currentLearnSubject());
    awardSpark("reading-log");
  });
  $("#addWord").addEventListener("click", () => {
    const word = $("#newWord").value.trim();
    const meaning = $("#wordMeaning").value.trim();
    if (!word || !meaning) {
      showToast("Add a word and meaning.");
      return;
    }
    state.learning.words.unshift({ word, meaning, date: new Date().toLocaleDateString() });
    trackActivity("learn", "language", word);
    state.learning.words = state.learning.words.slice(0, 30);
    $("#newWord").value = "";
    $("#wordMeaning").value = "";
    save();
    renderLearning(currentLearnSubject());
    awardSpark("word-collector");
  });
  $("#addQuestion").addEventListener("click", () => {
    const text = $("#newQuestion").value.trim();
    if (!text) {
      showToast("Write a question first.");
      return;
    }
    state.learning.questions.unshift({ text, date: new Date().toLocaleDateString() });
    trackActivity("learn", "curiosity", "question");
    state.learning.questions = state.learning.questions.slice(0, 30);
    $("#newQuestion").value = "";
    save();
    renderLearning(currentLearnSubject());
    awardSpark("question-box");
  });
  $("#stampPlace").addEventListener("click", () => {
    const id = state.travel.selected;
    if (!id) {
      showToast("Choose a place first.");
      return;
    }
    const place = getPlace(id);
    state.travel.visited[id] = new Date().toLocaleDateString();
    save();
    renderTravel(currentRegion());
    selectPlace(id);
    awardSpark(`travel-${id}`);
  });
  $("#saveTripNote").addEventListener("click", () => {
    const text = $("#tripNote").value.trim();
    if (!text) {
      showToast("Write a trip note first.");
      return;
    }
    const place = state.travel.selected ? getPlace(state.travel.selected).name : "Travel note";
    state.travel.notes.unshift({ place, text, date: new Date().toLocaleDateString() });
    state.travel.notes = state.travel.notes.slice(0, 20);
    $("#tripNote").value = "";
    save();
    renderPassport();
    awardSpark("trip-note");
  });
  $("#addLink").addEventListener("click", () => {
    const name = $("#linkName").value.trim();
    const url = normalizeLink($("#linkUrl").value.trim());
    if (!name || !url) {
      $("#linkMessage").textContent = "Add a name and a full http or https link.";
      return;
    }
    state.links.push({ name, url, note: "Family-approved link." });
    $("#linkName").value = "";
    $("#linkUrl").value = "";
    $("#linkMessage").textContent = "Safe link added.";
    save();
    renderLinks();
  });
  $("#saveMotto").addEventListener("click", () => {
    state.settings.motto = $("#mottoInput").value.trim() || "We create, learn, help, and rest.";
    save();
    renderHomeDashboard();
    showToast("Family motto saved.");
  });
  $("#addProfile").addEventListener("click", () => {
    const name = $("#newProfileName").value.trim();
    if (!name) {
      showToast("Add a profile name.");
      return;
    }
    const id = `profile-${Date.now()}`;
    profiles[activeProfileId] = snapshotProfile();
    profiles[id] = {
      name,
      sparks: 0,
      projects: [],
      completed: {},
      learning: { quests: {}, reading: [], words: [], questions: [] },
      travel: { visited: {}, notes: [], packed: {} },
      games: { wins: 0 },
      insights: { events: [], areas: {}, skills: {} },
      calm: { feelings: [], gratitude: [], breaths: 0, breaks: [] },
      space: { notes: [], constellations: [], missions: {}, quiz: 0, rockets: [], checklist: {}, moon: [], scaleMode: false, asteroids: false },
      avatar: { avatarBgColor: "#dbe9e1", skinColor: "#c87954", hairColor: "#2f241f", eyeColor: "#1d2424", shirtColor: "#147c78", hairStyle: "short", expression: "smile", outfit: "tee", accessory: "none", avatarBadge: "none" },
      wardrobe: [],
    };
    $("#newProfileName").value = "";
    activeProfileId = id;
    applyProfile(profiles[id]);
    save();
    refreshAll();
    showToast("Profile added.");
  });
  $("#removeProfile").addEventListener("click", () => {
    const ids = Object.keys(profiles);
    if (ids.length <= 1) {
      showToast("Keep at least one profile.");
      return;
    }
    if (!window.confirm(`Remove ${state.name}'s profile from this browser?`)) return;
    delete profiles[activeProfileId];
    activeProfileId = Object.keys(profiles)[0];
    applyProfile(profiles[activeProfileId]);
    save();
    refreshAll();
    showToast("Profile removed.");
  });
  $("#resetSparks").addEventListener("click", () => {
    state.sparks = 0;
    state.completed = {};
    save();
    renderSparks();
    showToast("Sparks reset.");
  });
  $("#unlockParent").addEventListener("click", () => {
    if ($("#parentPin").value !== state.parentPin) {
      $("#pinMessage").textContent = "Incorrect PIN.";
      return;
    }
    state.parentUnlocked = true;
    $("#parentLock").hidden = true;
    $("#parentTools").hidden = false;
    $("#parentPin").value = "";
    renderLinks();
    renderProjects();
    renderParentState();
    showToast("Parent controls unlocked.");
  });
  $("#lockParent").addEventListener("click", () => {
    state.parentUnlocked = false;
    $("#parentLock").hidden = false;
    $("#parentTools").hidden = true;
    $("#pinMessage").textContent = "Parent controls locked.";
    renderLinks();
    renderProjects();
    renderParentState();
  });
  $("#changePin").addEventListener("click", () => {
    const next = $("#newPin").value.trim();
    if (next.length < 4) {
      showToast("PIN needs at least 4 characters.");
      return;
    }
    state.parentPin = next;
    $("#newPin").value = "";
    save();
    showToast("Parent PIN changed.");
  });
  $("#clearProjects").addEventListener("click", () => {
    if (!state.parentUnlocked) {
      showToast("Unlock Parent Controls first.");
      setView("parent");
      return;
    }
    if (!state.projects.length) return;
    if (!window.confirm("Clear all saved projects from this browser?")) return;
    state.projects = [];
    save();
    renderProjects();
    showToast("Gallery cleared.");
  });
  $("#exportData").addEventListener("click", () => {
    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      name: state.name,
      sparks: state.sparks,
      links: state.links,
      projects: state.projects,
      completed: state.completed,
      learning: state.learning,
      travel: state.travel,
      games: state.games,
      insights: state.insights,
      calm: state.calm,
      space: state.space,
      settings: state.settings,
      profiles,
      activeProfileId,
      avatar: state.avatar,
      wardrobe: state.wardrobe,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "family-kids-portal-backup.json";
    link.click();
    URL.revokeObjectURL(url);
  });
  $("#importData").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      try {
        const backup = JSON.parse(String(reader.result));
        state.name = typeof backup.name === "string" ? backup.name : state.name;
        state.sparks = Math.max(0, Number(backup.sparks) || 0);
        state.links = Array.isArray(backup.links) ? backup.links : state.links;
        state.projects = Array.isArray(backup.projects) ? backup.projects.slice(0, 24) : state.projects;
        state.completed = backup.completed && typeof backup.completed === "object" ? backup.completed : state.completed;
        state.learning = backup.learning && typeof backup.learning === "object" ? backup.learning : state.learning;
        state.travel = backup.travel && typeof backup.travel === "object" ? backup.travel : state.travel;
        state.games = backup.games && typeof backup.games === "object" ? backup.games : state.games;
        state.insights = backup.insights && typeof backup.insights === "object" ? backup.insights : state.insights;
        state.calm = backup.calm && typeof backup.calm === "object" ? backup.calm : state.calm;
        state.space = backup.space && typeof backup.space === "object" ? backup.space : state.space;
        state.settings = backup.settings && typeof backup.settings === "object" ? backup.settings : state.settings;
        if (backup.profiles && typeof backup.profiles === "object") {
          profiles = backup.profiles;
          activeProfileId = backup.activeProfileId && profiles[backup.activeProfileId] ? backup.activeProfileId : Object.keys(profiles)[0];
          applyProfile(profiles[activeProfileId]);
        }
        state.avatar = backup.avatar && typeof backup.avatar === "object" ? backup.avatar : state.avatar;
        state.wardrobe = Array.isArray(backup.wardrobe) ? backup.wardrobe : state.wardrobe;
        save();
        refreshAll();
        showToast("Backup imported.");
      } catch {
        showToast("Backup file could not be read.");
      }
    });
    reader.readAsText(file);
    event.target.value = "";
  });
}

function renderParentState() {
  $("#clearProjects").disabled = !state.parentUnlocked || state.projects.length === 0;
  $("#mottoInput").value = state.settings.motto || "";
  renderParentInsights();
  $("#projectHelp").textContent = state.parentUnlocked
    ? "Parent controls are unlocked. Projects can be removed or cleared."
    : "Saved creations stay in this browser. Unlock Parent Controls to remove them.";
}

function refreshAll() {
  renderProfiles();
  $("#kidName").value = state.name;
  $("#welcomeTitle").textContent = `${state.name}, choose one good thing to do next.`;
  syncAvatarControls();
  renderSparks();
  renderLinks();
  renderLearning(currentLearnSubject());
  renderWiki("all");
  renderTravel(currentRegion());
  if (state.travel.selected) selectPlace(state.travel.selected);
  renderGame(activeGame);
  renderCalm();
  renderSpacePanel($("#planetTitle").textContent || "Mercury");
  renderProjects();
  renderHomeDashboard();
  renderAvatar();
  updateSparkButtons();
  renderParentState();
}

function init() {
  $("#todayLabel").textContent = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  $("#welcomeTitle").textContent = `${state.name}, choose one good thing to do next.`;
  renderProfiles();
  renderSparks();
  renderTasks();
  renderLinks();
  renderHomeDashboard();
  renderLearning("all");
  renderWiki("all");
  renderGame("memory");
  renderCalm();
  renderTravel("all");
  renderSpaceCards();
  renderProjects();
  setupEvents();
  setupDrawing();
  setupMap();
  setupSpace();
  renderAvatar();
  updateSparkButtons();
  renderParentState();
}

init();
