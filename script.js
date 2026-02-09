function qs(sel, root=document){ return root.querySelector(sel); }

let currentLang = "en";
let cards = [];   // 365 cards
let bag = [];     // shuffled indices (no-repeat)
let seen = [];    // history of indices drawn
let cursor = -1;  // pointer in history

const STORAGE_KEY = (lang)=>`dw_profeta_state_v2_${lang}`;

const I18N = {
  en:{ dir:"ltr",
    app_title:"Daily Wisdom",
    app_subtitle:"Sayings of The Prophet Muhammad ﷺ",
    deck_title:"Prophet Muhammad ﷺ",
    language_label:"Language",
    btn_prev:"Back",
    btn_today:"Today",
    btn_next:"Next",
    flip:"Tap to flip",
    footer_body:"Content in /data/*.json",
    topics_title:"Other topics",
    topic_parables:"Parables",
    topic_science:"Science",
    topic_gratitude:"Gratitude",
    report_btn:"Report",
    error_loading:"Could not load content.",
    error_console:"Open the browser console for details.",
    front_title:"Daily Wisdom",
    front_subtitle:"Sayings of The Prophet Muhammad ﷺ",
    front_quote:"There is an excellent example (of conduct) for you in Prophet Muhammad, the Messenger of God. [ Qur’an 33:21 ]"
  },
  it:{ dir:"ltr",
    app_title:"Saggezza del giorno",
    app_subtitle:"Detti del Profeta Muhammad ﷺ",
    deck_title:"Profeta Muhammad ﷺ",
    language_label:"Lingua",
    btn_prev:"Indietro",
    btn_today:"Oggi",
    btn_next:"Avanti",
    flip:"Tocca per girare",
    footer_body:"Contenuti in /data/*.json",
    topics_title:"Altri temi",
    topic_parables:"Parabole",
    topic_science:"Scienza",
    topic_gratitude:"Gratitudine",
    report_btn:"Segnala",
    error_loading:"Impossibile caricare i contenuti.",
    error_console:"Apri la console del browser per i dettagli.",
    front_title:"Saggezza del giorno",
    front_subtitle:"Detti del Profeta Muhammad ﷺ",
    front_quote:"C’è per voi un eccellente esempio nel Profeta Muhammad, il Messaggero di Dio. [ Corano 33:21 ]"
  },
  fr:{ dir:"ltr",
    app_title:"Sagesse du jour",
    app_subtitle:"Paroles du Prophète Muhammad ﷺ",
    deck_title:"Prophète Muhammad ﷺ",
    language_label:"Langue",
    btn_prev:"Retour",
    btn_today:"Aujourd’hui",
    btn_next:"Suivant",
    flip:"Touchez pour retourner",
    footer_body:"Contenu dans /data/*.json",
    topics_title:"Autres thèmes",
    topic_parables:"Paraboles",
    topic_science:"Science",
    topic_gratitude:"Gratitude",
    report_btn:"Signaler",
    error_loading:"Impossible de charger le contenu.",
    error_console:"Ouvrez la console du navigateur pour les détails.",
    front_title:"Sagesse du jour",
    front_subtitle:"Paroles du Prophète Muhammad ﷺ",
    front_quote:"Il y a pour vous un excellent exemple dans Muhammad, le Messager de Dieu. [ Coran 33:21 ]"
  },
  ar:{ dir:"rtl",
    app_title:"حِكمة اليوم",
    app_subtitle:"أقوال النبي محمد ﷺ",
    deck_title:"النبي محمد ﷺ",
    language_label:"اللغة",
    btn_prev:"السابق",
    btn_today:"اليوم",
    btn_next:"التالي",
    flip:"اضغط لقلب البطاقة",
    footer_body:"المحتوى داخل /data/*.json",
    topics_title:"مواضيع أخرى",
    topic_parables:"أمثال",
    topic_science:"علم",
    topic_gratitude:"امتنان",
    report_btn:"إبلاغ",
    error_loading:"تعذّر تحميل المحتوى.",
    error_console:"افتح وحدة التحكم في المتصفح للتفاصيل.",
    front_title:"حِكمة اليوم",
    front_subtitle:"أقوال النبي محمد ﷺ",
    front_quote:"لَقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ. [ الأحزاب 33:21 ]"
  }
};

function t(key){
  const d = I18N[currentLang] || I18N.en;
  return d[key] ?? key;
}

function applyTranslations(){
  const d = I18N[currentLang] || I18N.en;
  document.documentElement.lang = currentLang;
  document.documentElement.dir  = d.dir || "ltr";

  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const k = el.getAttribute("data-i18n");
    el.textContent = t(k);
  });
  document.querySelectorAll("[data-i18n-btn]").forEach(el=>{
    const k = el.getAttribute("data-i18n-btn");
    el.textContent = t(k);
  });

  const report = qs("#reportLink");
  if(report) report.textContent = t("report_btn");
}

function shuffle(arr){
  const a = [...arr];
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

function refillBag(){
  bag = shuffle(cards.map((_, i)=>i));
}

function saveState(){
  try{
    const payload = { bag, seen, cursor };
    localStorage.setItem(STORAGE_KEY(currentLang), JSON.stringify(payload));
  }catch(_){}
}

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY(currentLang));
    if(!raw) return false;
    const s = JSON.parse(raw);
    if(!Array.isArray(s.bag) || !Array.isArray(s.seen) || typeof s.cursor !== "number") return false;
    bag = s.bag;
    seen = s.seen;
    cursor = s.cursor;
    return true;
  }catch(_){
    return false;
  }
}

function escapeHtml(str){
  return String(str??"")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");
}

function showError(message, detail){
  const bar = qs("#errorBar");
  const text = qs("#errorText");
  const report = qs("#reportLink");
  if(!bar || !text || !report) return;

  const info = [
    `lang=${currentLang}`,
    `url=${location.href}`,
    `ua=${navigator.userAgent}`,
    detail ? `detail=${detail}` : ""
  ].filter(Boolean).join("\n");

  text.textContent = `${message} ${t("error_console")}`;
  const subject = encodeURIComponent("Daily Wisdom — error report");
  const body = encodeURIComponent(`${message}\n\n${info}`);
  report.href = `mailto:?subject=${subject}&body=${body}`;

  bar.hidden = false;
}

function hideError(){
  const bar = qs("#errorBar");
  if(bar) bar.hidden = true;
}

function render(cardIndex){
  const mount = qs("#deck-profeta");
  if(!mount) return;

  const card = cards[cardIndex] || { backHeading:"", backBody:"", ref:"" };
  const total = cards.length || 365;
  const progress = (cursor >= 0) ? `${cursor+1}/${total}` : `0/${total}`;

  mount.innerHTML = `
    <div class="flashcard" role="button" tabindex="0" aria-label="${escapeHtml(t("flip"))}">
      <div class="flashcard-inner">
        <div class="flash-side flash-front">
          <div class="front-center">
            <div class="front-center-block">
              <h3 class="front-center-title">${escapeHtml(t("front_title"))}</h3>
              <div class="front-center-subtitle">${escapeHtml(t("front_subtitle"))}</div>
              <div class="front-center-quote">${escapeHtml(t("front_quote"))}</div>
            </div>
          </div>
          <div class="front-footer">
            <span>${escapeHtml(t("flip"))}</span>
            <span>${escapeHtml(progress)}</span>
          </div>
        </div>

        <div class="flash-side flash-back">
          <div>
            <div class="back-heading">${escapeHtml(card.backHeading || "")}</div>
            <p class="back-body">${escapeHtml(card.backBody || "")}</p>
          </div>
          <div class="meta">
            <span>${escapeHtml(card.ref || "")}</span>
            <span>${escapeHtml(progress)}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  const fc = mount.querySelector(".flashcard");
  const flip = ()=>fc.classList.toggle("is-flipped");
  fc.addEventListener("click", flip);
  fc.addEventListener("keydown", (e)=>{
    if(e.key==="Enter"||e.key===" "){ e.preventDefault(); flip(); }
  });
}

function updateControls(){
  const prevBtn = qs('button[data-action="prev"]');
  const nextBtn = qs('button[data-action="next"]');
  if(prevBtn) prevBtn.disabled = (cursor <= 0);
  if(nextBtn) nextBtn.disabled = (cursor >= seen.length - 1);
}

function drawRandom(){
  if(!cards.length) return;

  if(!bag.length){
    refillBag();
    seen = [];
    cursor = -1;
  }

  const idx = bag.pop();

  if(cursor < seen.length - 1){
    seen = seen.slice(0, cursor + 1);
  }

  seen.push(idx);
  cursor = seen.length - 1;

  render(idx);
  updateControls();
  saveState();
}

function showPrev(){
  if(cursor <= 0) return;
  cursor--;
  render(seen[cursor]);
  updateControls();
  saveState();
}

function showNext(){
  if(cursor >= seen.length - 1) return;
  cursor++;
  render(seen[cursor]);
  updateControls();
  saveState();
}

async function loadLanguage(lang){
  hideError();
  const res = await fetch(`./data/${lang}.json`, { cache:"no-cache" });
  if(!res.ok) throw new Error(`Missing data file: ${lang}.json`);
  const data = await res.json();
  cards = Array.isArray(data.profeta) ? data.profeta : [];

  bag = [];
  seen = [];
  cursor = -1;

  const restored = loadState();
  const total = cards.length || 0;
  const ok = restored && total > 0 && (bag.length + seen.length === total);

  if(!ok){
    refillBag();
    drawRandom();
  }else{
    if(cursor >= 0 && seen[cursor] != null){
      render(seen[cursor]);
      updateControls();
    }else{
      drawRandom();
    }
  }
}

function bindControls(){
  document.addEventListener("click", (e)=>{
    const btn = e.target.closest("button[data-action]");
    if(!btn) return;
    const action = btn.getAttribute("data-action");
    if(action === "prev") showPrev();
    if(action === "next") showNext();
    if(action === "today") drawRandom();
  });

  const dismiss = qs("#dismissError");
  if(dismiss) dismiss.addEventListener("click", hideError);
}

window.addEventListener("error", (e)=>{
  showError(t("error_loading"), e?.message || "runtime error");
});
window.addEventListener("unhandledrejection", (e)=>{
  showError(t("error_loading"), e?.reason?.message || String(e?.reason || "promise rejection"));
});

document.addEventListener("DOMContentLoaded", async ()=>{
  const sel = qs("#langSelect");
  currentLang = sel?.value || "en";
  applyTranslations();
  bindControls();

  try{
    await loadLanguage(currentLang);
  }catch(err){
    console.error(err);
    showError(t("error_loading"), err?.message || String(err));
  }

  sel?.addEventListener("change", async ()=>{
    currentLang = sel.value;
    applyTranslations();
    try{
      await loadLanguage(currentLang);
    }catch(err){
      console.error(err);
      showError(t("error_loading"), err?.message || String(err));
    }
  });
});
