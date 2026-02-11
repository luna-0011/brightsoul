// app.js (ESM)

// ---- Pastel palette (unique per button) ----
const COLORS = {
  // Topics (7)
  "Prophet Muhammad ﷺ Wisdom": "#FAD2E1",
  "Quran": "#D6F6DD",
  "Dhikr & Dua": "#D6E9FF",
  "Salah": "#FFF1C9",
  "Ramadan": "#E6D6FF",
  "Poison of the Heart": "#FFD9C7",
  "Tricks of Shaytan": "#D7F5F1",

  // Categories (20)
  "Anger": "#F8C7C9",
  "Anxiety": "#CFE7FF",
  "Envy/Hasad": "#D9F8D7",
  "Jealousy": "#E7D7FF",
  "Tongue": "#FFE6B8",
  "Pride/Kibr": "#FFD2B8",
  "Greed": "#FFF0B8",
  "Fear": "#D6E3FF",
  "Sadness & Grief": "#D9D9FF",
  "Loneliness": "#D7F0FF",
  "Sabr": "#D7FFE8",
  "Tawakkul": "#CFF7F1",
  "Aqeedah": "#E2E8FF",
  "Adab": "#FFE1EF",
  "Dawah": "#D8FFF6",
  "Akhira": "#F7E8FF",
  "Family & Spouse": "#FFE5D6",
  "Children": "#E6FFF0",
  "Women in Islam": "#FFE3F5",
  "Sahaba & Parables": "#E8F7FF",
};

// “Emotion & Shaytan categories” => show practical method on back
const METHOD_CATEGORIES = new Set([
  "Anger",
  "Anxiety",
  "Envy/Hasad",
  "Jealousy",
  "Tongue",
  "Pride/Kibr",
  "Greed",
  "Fear",
  "Sadness & Grief",
  "Loneliness",
  "Poison of the Heart",
  "Tricks of Shaytan",
]);

// ---- UI refs ----
const topicsRow = document.getElementById("topicsRow");
const categoriesRow = document.getElementById("categoriesRow");
const langSelect = document.getElementById("langSelect");

const flashcard = document.getElementById("flashcard");
const cardFront = document.getElementById("cardFront");
const frontTitle = document.getElementById("frontTitle");
const frontHint = document.getElementById("frontHint");

const backBadge = document.getElementById("backBadge");
const backCount = document.getElementById("backCount");
const quoteText = document.getElementById("quoteText");
const quoteRef = document.getElementById("quoteRef");

const methodBox = document.getElementById("methodBox");
const methodTitle = document.getElementById("methodTitle");
const methodText = document.getElementById("methodText");

const cTL = document.getElementById("cTL");
const cTR = document.getElementById("cTR");
const cBL = document.getElementById("cBL");
const cBR = document.getElementById("cBR");

const appTitle = document.getElementById("appTitle");
const appSubtitle = document.getElementById("appSubtitle");
const footerTip = document.getElementById("footerTip");

// ---- App state ----
let i18n = null; // loaded language module data
let lang = "en";
let selectedKey = null; // label in current language
let selectedId = null; // stable id key (English key)
let selectedColor = "#EAEAFF";

// Map stable IDs (English keys) for button sets
const TOPICS = [
  "Prophet Muhammad ﷺ Wisdom",
  "Quran",
  "Dhikr & Dua",
  "Salah",
  "Ramadan",
  "Poison of the Heart",
  "Tricks of Shaytan",
];

const CATEGORIES = [
  "Anger",
  "Anxiety",
  "Envy/Hasad",
  "Jealousy",
  "Tongue",
  "Pride/Kibr",
  "Greed",
  "Fear",
  "Sadness & Grief",
  "Loneliness",
  "Sabr",
  "Tawakkul",
  "Aqeedah",
  "Adab",
  "Dawah",
  "Akhira",
  "Family & Spouse",
  "Children",
  "Women in Islam",
  "Sahaba & Parables",
];

// ---- LocalStorage helpers (no repeats until deck is complete) ----
function lsKey(deckId, langCode) {
  return `iwisdom_seen_${langCode}__${deckId}`;
}

function getSeen(deckId, langCode) {
  try {
    const raw = localStorage.getItem(lsKey(deckId, langCode));
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function setSeen(deckId, langCode, arr) {
  localStorage.setItem(lsKey(deckId, langCode), JSON.stringify(arr));
}

function nextIndexNoRepeat(deckSize, deckId, langCode) {
  if (deckSize <= 0) return { index: -1, seenCount: 0 };

  let seen = getSeen(deckId, langCode);
  seen = seen.filter((n) => Number.isInteger(n) && n >= 0 && n < deckSize);

  if (seen.length >= deckSize) {
    // deck completed: reset
    seen = [];
  }

  const remaining = [];
  for (let i = 0; i < deckSize; i++) {
    if (!seen.includes(i)) remaining.push(i);
  }

  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  seen.push(pick);
  setSeen(deckId, langCode, seen);

  return { index: pick, seenCount: seen.length };
}

// ---- Rendering ----
function setCardTheme(color) {
  selectedColor = color || "#EAEAFF";
  cardFront.style.background = `linear-gradient(135deg, ${selectedColor} 0%, rgba(255,255,255,.55) 130%)`;
  cTL.style.background = selectedColor;
  cTR.style.background = selectedColor;
  cBL.style.background = selectedColor;
  cBR.style.background = selectedColor;
}

function clearActiveButtons() {
  document.querySelectorAll(".pill").forEach((b) => b.classList.remove("active"));
}

function makeButton(label, stableId, kind) {
  const btn = document.createElement("button");
  btn.className = "pill";
  btn.type = "button";
  btn.textContent = label;

  const color = COLORS[stableId] || "#EAEAFF";
  btn.style.background = `linear-gradient(135deg, ${color} 0%, rgba(255,255,255,.65) 120%)`;

  btn.addEventListener("click", () => {
    clearActiveButtons();
    btn.classList.add("active");
    onSelectDeck(label, stableId, kind);

    // subtle pop animation on new draw
    flashcard.animate(
      [
        {
          transform: flashcard.classList.contains("flipped")
            ? "rotateY(180deg) scale(1)"
            : "rotateY(0deg) scale(1)",
        },
        {
          transform: flashcard.classList.contains("flipped")
            ? "rotateY(180deg) scale(1.012)"
            : "rotateY(0deg) scale(1.012)",
        },
        {
          transform: flashcard.classList.contains("flipped")
            ? "rotateY(180deg) scale(1)"
            : "rotateY(0deg) scale(1)",
        },
      ],
      { duration: 220, easing: "cubic-bezier(.2,.8,.2,1)" }
    );
  });

  return btn;
}

function renderButtons() {
  topicsRow.innerHTML = "";
  categoriesRow.innerHTML = "";

  TOPICS.forEach((id) => {
    const label = i18n.labels.topics[id];
    topicsRow.appendChild(makeButton(label, id, "topic"));
  });

  CATEGORIES.forEach((id) => {
    const label = i18n.labels.categories[id];
    categoriesRow.appendChild(makeButton(label, id, "category"));
  });
}

// ---- Core selection / card update ----
function onSelectDeck(label, stableId, kind) {
  selectedKey = label;
  selectedId = stableId;

  const color = COLORS[stableId] || "#EAEAFF";

  // ✅ FIX: qui prima mancava il ; e rompeva tutto il file JS
  setCardTheme(color);

  // badge polish
  backBadge.style.borderColor = "rgba(15,18,32,.12)";
  backBadge.style.boxShadow = "0 10px 22px rgba(12,16,26,.06)";
  backBadge.style.background = "rgba(255,255,255,.90)";
  backBadge.style.position = "relative";
  backBadge.style.overflow = "hidden";
  backBadge.style.setProperty("--accent", color);
  backBadge.style.backgroundImage = `linear-gradient(90deg, rgba(255,255,255,.9), rgba(255,255,255,.9))`;
  backBadge.style.outline = "none";

  // front always shows the clicked button name centered
  frontTitle.textContent = label;

  const deck =
    kind === "topic" ? i18n.decks.topics[stableId] : i18n.decks.categories[stableId];

  if (!deck || deck.length === 0) {
    flashcard.classList.remove("flipped");
    backBadge.textContent = label;
    quoteText.textContent = i18n.ui.noContent;
    quoteRef.textContent = "";
    backCount.textContent = "0/0";
    methodBox.hidden = true;
    return;
  }

  const { index, seenCount } = nextIndexNoRepeat(deck.length, stableId, lang);
  const item = deck[index];

  backBadge.textContent = label;
  quoteText.textContent = item.text;
  quoteRef.textContent = item.source ? item.source : "";
  backCount.textContent = `${seenCount}/${deck.length}`;

  const showMethod = METHOD_CATEGORIES.has(stableId) && item.method;
  methodBox.hidden = !showMethod;
  if (showMethod) {
    methodTitle.textContent = i18n.ui.methodTitle;
    methodText.textContent = item.method;
  }

  // Optional: auto-show front when switching decks
  flashcard.classList.remove("flipped");
}

// ---- Flip interactions ----
function toggleFlip() {
  flashcard.classList.toggle("flipped");
}

flashcard.addEventListener("click", () => {
  toggleFlip();

  const rect = flashcard.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  createStars(x, y);
});

flashcard.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    toggleFlip();
  }
});

function createStars(x, y) {
  const starsCount = 12;

  for (let i = 0; i < starsCount; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.innerHTML = "✦";

    const angle = Math.random() * 2 * Math.PI;
    const distance = 60 + Math.random() * 40;

    const moveX = Math.cos(angle) * distance + "px";
    const moveY = Math.sin(angle) * distance + "px";

    star.style.setProperty("--x", moveX);
    star.style.setProperty("--y", moveY);

    star.style.left = x + "px";
    star.style.top = y + "px";

    document.body.appendChild(star);

    setTimeout(() => {
      star.remove();
    }, 800);
  }
}

// ---- Language lazy-loading ----
async function loadLanguage(newLang) {
  lang = newLang;

  // dynamic import: loads only the selected language module
  // expected: ./lang/en.js, it.js, fr.js, ar.js
  const mod = await import(`./lang/${lang}.js`);
  i18n = mod.default;

  // RTL for Arabic
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  // UI strings
  appTitle.textContent = i18n.ui.appTitle;
  appSubtitle.textContent = i18n.ui.appSubtitle;
  frontHint.textContent = i18n.ui.frontHint;
  footerTip.textContent = i18n.ui.footerTip;

  // rebuild buttons
  renderButtons();

  // reset card display text
  frontTitle.textContent = i18n.ui.selectPrompt;
  backBadge.textContent = "—";
  quoteText.textContent = "—";
  quoteRef.textContent = "—";
  backCount.textContent = "0/0";
  methodBox.hidden = true;

  setCardTheme("#EAEAFF");
  flashcard.classList.remove("flipped");
}

// language change
langSelect.addEventListener("change", (e) => loadLanguage(e.target.value));

// boot
loadLanguage(langSelect.value);
