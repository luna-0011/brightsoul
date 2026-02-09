:root{
  --bg:#f7f7fb;
  --text:#111827;
  --muted:#4b5563;
  --border:rgba(17,24,39,.15);
  --deck-bg:#E8F1FF;
  --deck-border:#5B7DBA;
  --danger-bg: rgba(239, 68, 68, .10);
  --danger-border: rgba(239, 68, 68, .35);
  --danger-text: rgba(127, 29, 29, 1);
}
*{box-sizing:border-box}
body{
  margin:0;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  background:
    radial-gradient(1200px 600px at 10% 0%, rgba(147,197,253,.35), transparent 60%),
    radial-gradient(900px 600px at 90% 15%, rgba(167,243,208,.28), transparent 55%),
    var(--bg);
  color:var(--text);
}
.hero{padding:20px 18px; border-bottom:1px solid var(--border)}
.hero-inner{max-width:1100px; margin:0 auto;}
.topbar{display:flex; gap:18px; align-items:flex-start; justify-content:space-between; flex-wrap:wrap}
.hero-title{margin:0; font-size:32px}
.hero-subtitle{margin:6px 0 0; color:var(--muted)}
.lang-label{display:block; font-size:12px; color:var(--muted); margin-bottom:6px}
.lang-select{
  padding:10px 12px; border-radius:12px; border:1px solid var(--border);
  background:rgba(255,255,255,.75); color:var(--text)
}
.main{max-width:1100px; margin:0 auto; padding:18px; display:grid; gap:18px}
.deck{
  border:1px solid var(--border);
  border-radius:18px;
  padding:16px;
  background:rgba(255,255,255,.55);
  backdrop-filter: blur(6px);
}
.deck-head{display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap}
.controls{display:flex; gap:10px}
.btn{
  border:1px solid var(--border);
  background:rgba(255,255,255,.75);
  color:var(--text);
  border-radius:12px;
  padding:10px 12px;
  cursor:pointer;
  text-decoration:none;
  display:inline-flex;
  align-items:center;
  justify-content:center;
}
.btn:hover{background:rgba(255,255,255,.92)}
.btn:disabled{opacity:.45; cursor:not-allowed}
.btn.primary{background:rgba(17,24,39,.06); border-color:rgba(17,24,39,.18)}
.btn.primary:hover{background:rgba(17,24,39,.09)}
.deck-card{margin-top:14px; display:flex; justify-content:center}

/* Error bar */
.errorbar{
  margin-top:14px;
  border:1px solid var(--danger-border);
  background: var(--danger-bg);
  border-radius:14px;
  padding:10px 12px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
}
.errorbar-text{color:var(--danger-text); font-size:13px; line-height:1.3}
.errorbar-actions{display:flex; gap:8px}
.errorbar .btn{padding:8px 10px}

/* Flashcard */
.flashcard{width:min(680px, 100%); height:300px; perspective:1200px}
.flashcard-inner{
  position:relative; width:100%; height:100%;
  transform-style:preserve-3d;
  transition:transform .55s cubic-bezier(.2,.8,.2,1);
}
.flashcard.is-flipped .flashcard-inner{transform:rotateY(180deg)}
.flash-side{
  position:absolute; inset:0;
  border-radius:18px;
  backface-visibility:hidden; -webkit-backface-visibility:hidden;
  overflow:hidden;
  display:flex; flex-direction:column; justify-content:space-between;
  padding:16px;
}
.flash-front{
  background: var(--deck-bg);
  border:2px solid var(--deck-border);
  text-align:center;
}
.front-center{
  flex:1;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:8px 18px;
}
.front-center-block{
  max-width:520px;
}
.front-center-title{
  font-weight:800;
  font-size:26px;
  line-height:1.1;
  margin:0;
}
.front-center-subtitle{
  font-weight:700;
  font-size:15px;
  margin:8px 0 0;
}
.front-center-quote{
  margin:10px 0 0;
  font-size:12px;
  font-style:italic;
  font-weight:400;
  color:rgba(17,24,39,.75);
  line-height:1.35;
}
.front-footer{display:flex; justify-content:space-between; font-size:12px; color:rgba(17,24,39,.60)}
.flash-back{
  background:#fff;
  border:2px solid var(--deck-border);
  transform:rotateY(180deg);
}
.back-heading{margin:10px 0 10px; font-size:18px; text-align:center}
.back-body{margin:0; white-space:pre-wrap; text-align:center; overflow:auto; flex:1; line-height:1.45}
.meta{display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; font-size:12px; color:rgba(17,24,39,.55)}
.footer{border-top:1px solid var(--border); padding:18px; color:var(--muted); text-align:center}

/* Topics */
.topics{margin-top:16px; border-top:1px dashed var(--border); padding-top:14px}
.topics-title{margin:0 0 10px; font-size:14px; color:var(--muted)}
.topics-links{display:flex; gap:10px; flex-wrap:wrap}
.topic-link{
  padding:8px 10px;
  border-radius:12px;
  border:1px solid var(--border);
  background:rgba(255,255,255,.65);
  color:var(--text);
  text-decoration:none;
  font-size:13px;
}
.topic-link:hover{background:rgba(255,255,255,.9)}

/* RTL */
html[dir="rtl"] body{font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, "Noto Naskh Arabic", "Amiri", sans-serif;}
html[dir="rtl"] .controls{flex-direction:row-reverse}
html[dir="rtl"] .topbar{flex-direction:row-reverse}
html[dir="rtl"] .topics-links{flex-direction:row-reverse}
