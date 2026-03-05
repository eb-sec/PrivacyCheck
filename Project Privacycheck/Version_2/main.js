/*
PrivacyCheck von Elias Bach
Masterschool Cybersecurity Portfolio – Feb 2026 Berlin
Version 2.0 – Ultimate Edition (Auto-Save, DSFA Logic, Framework Mappings, CSV Export)
*/

var QUESTIONS = [
  {id:"https", text:"Wird die gesamte Kommunikation der Web-App ausschließlich über HTTPS abgewickelt?", category:"Sicherheit", weight:3, goodAnswer:"yes", mapping:"ISO 27001: A.8.24 | BSI: NET.3.2"},
  {id:"pwdHash", text:"Werden Passwörter ausschließlich gehasht (bcrypt/argon2) und nie im Klartext gespeichert?", category:"Sicherheit", weight:3, goodAnswer:"yes", mapping:"ISO 27001: A.8.5 | BSI: ORP.4"},
  {id:"dpNotice", text:"Gibt es eine leicht auffindbare Datenschutzerklärung nach Art. 13 DSGVO?", category:"Transparenz", weight:3, goodAnswer:"yes", mapping:"DSGVO: Art. 12-14"},
  {id:"impressum", text:"Ist ein vollständiges Impressum leicht erreichbar?", category:"Transparenz", weight:1, goodAnswer:"yes", mapping:"TMG: § 5"},
  {id:"minimization", text:"Werden nur unbedingt notwendige Daten als Pflichtfelder erhoben (Datenminimierung)?", category:"Datenminimierung", weight:2, goodAnswer:"yes", mapping:"DSGVO: Art. 5 (1) c"},
  {id:"cookies", text:"Werden Tracking-Cookies nur nach expliziter Einwilligung gesetzt (Cookie-Banner)?", category:"Einwilligung / Cookies", weight:3, goodAnswer:"yes", mapping:"ePrivacy-RL | TTDSG: § 25"},
  {id:"legalBasis", text:"Sind für alle Verarbeitungszwecke klare Rechtsgrundlagen definiert (Art. 6 DSGVO)?", category:"Rechtsgrundlagen", weight:2, goodAnswer:"yes", mapping:"DSGVO: Art. 6"},
  {id:"processors", text:"Bestehen mit allen Auftragsverarbeitern DSGVO-konforme Verträge?", category:"Auftragsverarbeitung", weight:2, goodAnswer:"yes", mapping:"DSGVO: Art. 28 | ISO 27001: A.5.15"},
  {id:"access", text:"Gibt es ein Rollen- und Berechtigungskonzept für Zugriffe auf personenbezogene Daten?", category:"Sicherheit / Governance", weight:2, goodAnswer:"yes", mapping:"ISO 27001: A.5.15 | BSI: ORP.4"},
  {id:"logging", text:"Werden sicherheitsrelevante Zugriffe protokolliert und regelmäßig ausgewertet?", category:"Sicherheit / Monitoring", weight:1, goodAnswer:"yes", mapping:"ISO 27001: A.8.15 | BSI: OPS.1.1.5"}
];

var FARBEN = ["#3b82f6","#10b981","#f59e0b","#8b5cf6","#ef4444","#06b6d4","#84cc16","#f97316","#ec4899"];

var currentStep = 1;
var maxStep = 4;

var prevBtn = document.getElementById("prevBtn");
var nextBtn = document.getElementById("nextBtn");
var printBtn = document.getElementById("printReportBtn");
var exportCsvBtn = document.getElementById("exportCsvBtn"); // CSV Button

// ---- STARTUP LOGIC ----
renderQuestions();
loadDraft(); // Entwurf laden BEVOR die View aktualisiert wird
updateStepView();

// ---- EVENT LISTENERS: BUTTONS ----
prevBtn.addEventListener("click", function() {
  if (currentStep > 1) { 
    currentStep--; 
    updateStepView(); 
    saveDraft(); 
  }
});

nextBtn.addEventListener("click", function() {
  if (currentStep === 1 && !validateStep1()) return;
  if (currentStep === 2 && !validateStep2()) return;
  
  // Dynamische Risiko-Logik (Schritt 2 -> 3)
  if (currentStep === 2) {
    var specialCheckbox = document.querySelector("input[value='special']");
    var isSpecial = specialCheckbox ? specialCheckbox.checked : false;
    var hasDsfa = QUESTIONS.some(function(q) { return q.id === "dsfa"; });
    
    if (isSpecial && !hasDsfa) {
      QUESTIONS.push({
        id: "dsfa",
        text: "🚨 [HOHES RISIKO ERKANNT] Wurde aufgrund der Verarbeitung besonderer Datenkategorien eine Datenschutz-Folgenabschätzung (DSFA) gem. Art. 35 DSGVO durchgeführt?",
        category: "Risikomanagement",
        weight: 4,
        goodAnswer: "yes",
        mapping: "DSGVO: Art. 35 | ISO 27001: A.5.34"
      });
      renderQuestions(); 
    } else if (!isSpecial && hasDsfa) {
      QUESTIONS = QUESTIONS.filter(function(q) { return q.id !== "dsfa"; });
      renderQuestions();
    }
  }

  if (currentStep < maxStep) {
    currentStep++;
    if (currentStep === maxStep) computeAndRenderResult();
    updateStepView();
    saveDraft();
  }
});

printBtn.addEventListener("click", function() { window.print(); });

// ---- EVENT LISTENER: FORM CHANGES (für Auto-Save) ----
var container = document.querySelector(".app-container");
if(container) {
  container.addEventListener("change", function() { saveDraft(); });
}

// ---- EVENT LISTENER: CSV EXPORT ----
if(exportCsvBtn) {
  exportCsvBtn.addEventListener("click", function() {
    var appName = document.getElementById("appName").value.trim() || "Web-App";
    var csvContent = "data:text/csv;charset=utf-8,Issue Type,Priority,Summary,Description,Component/Kategorie\n";
    var hasIssues = false;

    QUESTIONS.forEach(function(q) {
      var answer = getRadioValue("q-" + q.id);
      if (answer === "no" || answer === "partial") {
        hasIssues = true;
        var priority = "Medium";
        if (answer === "no") priority = "High";
        if (answer === "no" && q.weight >= 3) priority = "Highest";
        if (answer === "partial" && q.weight >= 3) priority = "High";

        var prefix = answer === "no" ? "[DSGVO-Kritisch] " : "[DSGVO-To-Do] ";
        var summary = prefix + "Maßnahme erforderlich: " + q.category;
        var desc = "Die Anforderung wurde mit '" + (answer === "no" ? "Nein" : "Teilweise") + "' bewertet. Prüfung / Umsetzung erforderlich für: " + q.text.replace(/,/g, "");

        var row = ["Task", priority, '"' + summary + '"', '"' + desc + '"', '"' + q.category + '"'].join(",");
        csvContent += row + "\n";
      }
    });

    if (!hasIssues) {
      alert("Es gibt keine offenen Maßnahmen. Deine App ist konform!");
      return;
    }

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "DSGVO_Massnahmen_" + appName.replace(/\s+/g, '_') + ".csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

// ---- AUTO-SAVE FUNKTIONEN ----
function saveDraft() {
  var draft = {
    step: currentStep,
    appName: document.getElementById("appName").value,
    appType: document.getElementById("appType").value,
    targetAudience: document.getElementById("targetAudience").value,
    dataCategories: getCheckedValues("#dataCategories"),
    purposes: getCheckedValues("#processingPurposes"),
    answers: {}
  };

  QUESTIONS.forEach(function(q) {
    var answer = getRadioValue("q-" + q.id);
    if (answer) draft.answers[q.id] = answer;
  });

  try {
    localStorage.setItem("privacyCheckDraft", JSON.stringify(draft));
    showSaveIndicator();
  } catch(e) { console.error("Speichern fehlgeschlagen", e); }
}

function loadDraft() {
  var draftJson = localStorage.getItem("privacyCheckDraft");
  if (!draftJson) return;

  try {
    var draft = JSON.parse(draftJson);
    if (draft.appName) document.getElementById("appName").value = draft.appName;
    if (draft.appType) document.getElementById("appType").value = draft.appType;
    if (draft.targetAudience) document.getElementById("targetAudience").value = draft.targetAudience;

    if (draft.dataCategories) {
      draft.dataCategories.forEach(function(val) {
        var cb = document.querySelector("#dataCategories input[value='" + val + "']");
        if (cb) cb.checked = true;
      });
    }
    if (draft.purposes) {
      draft.purposes.forEach(function(val) {
        var cb = document.querySelector("#processingPurposes input[value='" + val + "']");
        if (cb) cb.checked = true;
      });
    }

    // Wenn Risiko angekreuzt war, Frage vorab reinladen, damit Answers gemappt werden können
    if (draft.dataCategories && draft.dataCategories.indexOf("special") > -1) {
      if(!QUESTIONS.some(function(q) { return q.id === "dsfa"; })) {
        QUESTIONS.push({
          id: "dsfa", text: "🚨 [HOHES RISIKO ERKANNT] Wurde eine DSFA gem. Art. 35 DSGVO durchgeführt?", category: "Risikomanagement", weight: 4, goodAnswer: "yes", mapping: "DSGVO: Art. 35 | ISO 27001: A.5.34"
        });
        renderQuestions();
      }
    }

    if (draft.answers) {
      Object.keys(draft.answers).forEach(function(id) {
        var rb = document.querySelector("input[name='q-" + id + "'][value='" + draft.answers[id] + "']");
        if (rb) rb.checked = true;
      });
    }

    if (draft.step && draft.step > 1 && draft.step < 4) {
      currentStep = draft.step;
    }
  } catch (e) { console.error("Laden fehlgeschlagen", e); }
}

function showSaveIndicator() {
  var indicator = document.getElementById("saveIndicator");
  if (!indicator) {
    indicator = document.createElement("div");
    indicator.id = "saveIndicator";
    indicator.className = "save-indicator";
    indicator.innerHTML = "💾 Entwurf gespeichert";
    document.body.appendChild(indicator);
  }
  indicator.classList.add("show");
  setTimeout(function() { indicator.classList.remove("show"); }, 2000);
}

// ---- UI FUNKTIONEN ----
function updateStepView() {
  document.querySelectorAll(".step").forEach(function(s, i) {
    s.classList.toggle("active", i + 1 === currentStep);
  });
  document.querySelectorAll(".step-indicator").forEach(function(ind) {
    ind.classList.toggle("active", parseInt(ind.dataset.step) === currentStep);
  });
  prevBtn.disabled = currentStep === 1;
  if (currentStep === maxStep) {
    nextBtn.style.display = "none";
  } else {
    nextBtn.style.display = "";
    nextBtn.textContent = currentStep === maxStep - 1 ? "Auswertung" : "Weiter";
  }
}

function renderQuestions() {
  var container = document.getElementById("questionsContainer");
  container.innerHTML = "";
  QUESTIONS.forEach(function(q) {
    var card = document.createElement("div");
    card.className = "question-card";
    card.innerHTML =
      "<p class='question-title'>" + q.text + "</p>" +
      "<p class='question-meta'>" + q.category + " • Gewichtung: " + q.weight + "</p>" +
      "<div class='question-options'>" +
        "<label><input type='radio' name='q-" + q.id + "' value='yes'> Ja</label>" +
        "<label><input type='radio' name='q-" + q.id + "' value='partial'> Teilweise / In Planung</label>" +
        "<label><input type='radio' name='q-" + q.id + "' value='no'> Nein</label>" +
        "<label><input type='radio' name='q-" + q.id + "' value='na'> Nicht anwendbar</label>" +
      "</div>";
    container.appendChild(card);
  });
}

function validateStep1() {
  var name = document.getElementById("appName").value.trim();
  var type = document.getElementById("appType").value;
  if (!name || !type) { alert("Bitte App-Namen und Art der Anwendung angeben."); return false; }
  return true;
}

function validateStep2() {
  var d = document.querySelectorAll("#dataCategories input:checked").length;
  var p = document.querySelectorAll("#processingPurposes input:checked").length;
  if (d === 0 && p === 0) return confirm("Keine Datenkategorien oder Zwecke gewählt. Trotzdem fortfahren?");
  return true;
}

// ---- RESULT GENERATOR ----
function computeAndRenderResult() {
  var appName = document.getElementById("appName").value.trim();
  var appType = document.getElementById("appType").value;
  var zielgruppe = document.getElementById("targetAudience").value.trim();
  var dataCategories = getCheckedValues("#dataCategories");
  var purposes = getCheckedValues("#processingPurposes");

  var totalWeight = 0, achievedScore = 0;
  var categoryIssues = {};

  QUESTIONS.forEach(function(q) {
    var answer = getRadioValue("q-" + q.id);
    var cat = q.category;
    if (!categoryIssues[cat]) categoryIssues[cat] = {good:[], partial:[], bad:[]};
    totalWeight += q.weight;
    if (!answer || answer === "na") { categoryIssues[cat].partial.push({text: q.text, type: "na"}); return; }
    if (answer === q.goodAnswer)    { achievedScore += q.weight;       categoryIssues[cat].good.push({text: q.text}); }
    else if (answer === "partial")  { achievedScore += q.weight * 0.5; categoryIssues[cat].partial.push({text: q.text, type: "partial"}); }
    else                            {                                   categoryIssues[cat].bad.push({text: q.text}); }
  });

  var percentage = totalWeight > 0 ? Math.round((achievedScore / totalWeight) * 100) : 0;
  var scoreClass = percentage >= 80 ? "good" : percentage >= 50 ? "medium" : "bad";

  document.getElementById("resultSummary").innerHTML =
    "<p><strong>App:</strong> " + escapeHtml(appName) +
    (appType ? " • Typ: " + appTypeLabel(appType) : "") +
    (zielgruppe ? " • Zielgruppe: " + escapeHtml(zielgruppe) : "") + "</p>" +
    "<p class='score-badge " + scoreClass + "'><span>" + percentage + "</span><span class='unit'>/ 100 Punkte</span></p>" +
    "<div class='tag-row'>" + renderScoreTags(percentage, dataCategories, purposes) + "</div>";

  var resultDetails = document.getElementById("resultDetails");
  resultDetails.innerHTML = "";
  
  function getMapping(fragetext) {
    var q = QUESTIONS.find(function(x) { return fragetext.indexOf(x.text) > -1; });
    return q && q.mapping ? q.mapping : "";
  }

  Object.keys(categoryIssues).forEach(function(cat) {
    var sec = document.createElement("div");
    sec.className = "result-section";
    sec.innerHTML = "<h3>" + cat + "</h3>";
    var ul = document.createElement("ul");

    categoryIssues[cat].bad.forEach(function(item) {
      var mapText = getMapping(item.text);
      ul.innerHTML += "<li class='detail-item detail-bad'>" +
        "<div class='detail-header'><span class='detail-icon'>❌</span><span class='detail-status bad'>Offen / Kritisch</span><span class='detail-answer'>Deine Antwort: <strong>NEIN</strong></span></div>" +
        "<div class='detail-frage'>" + escapeHtml(item.text) + "</div>" +
        (mapText ? "<div class='detail-mapping'>🔖 " + mapText + "</div>" : "") + "</li>";
    });

    categoryIssues[cat].partial.forEach(function(item) {
      var mapText = getMapping(item.text);
      var isNa = item.type === "na";
      var antwortText = isNa ? "NICHT BEANTWORTET / N.A." : "TEILWEISE / IN PLANUNG";
      ul.innerHTML += "<li class='detail-item detail-partial'>" +
        "<div class='detail-header'><span class='detail-icon'>⚠️</span><span class='detail-status partial'>" + (isNa ? "Nicht bewertet" : "Teilweise") + "</span><span class='detail-answer'>Deine Antwort: <strong>" + antwortText + "</strong></span></div>" +
        "<div class='detail-frage'>" + escapeHtml(item.text) + "</div>" +
        (mapText ? "<div class='detail-mapping'>🔖 " + mapText + "</div>" : "") + "</li>";
    });

    categoryIssues[cat].good.forEach(function(item) {
      var mapText = getMapping(item.text);
      ul.innerHTML += "<li class='detail-item detail-good'>" +
        "<div class='detail-header'><span class='detail-icon'>✅</span><span class='detail-status good'>Umgesetzt</span><span class='detail-answer'>Deine Antwort: <strong>JA</strong></span></div>" +
        "<div class='detail-frage'>" + escapeHtml(item.text) + "</div>" +
        (mapText ? "<div class='detail-mapping'>🔖 " + mapText + "</div>" : "") + "</li>";
    });

    sec.appendChild(ul);
    resultDetails.appendChild(sec);
  });

  var advice = document.createElement("div");
  advice.className = "result-section";
  advice.innerHTML = "<h3>Nächste Schritte</h3>" + renderAdviceText(percentage, dataCategories, purposes);
  resultDetails.appendChild(advice);

  var kategorienScores = {};
  Object.keys(categoryIssues).forEach(function(cat) {
    var g = categoryIssues[cat].good.length;
    var p = categoryIssues[cat].partial.length;
    var b = categoryIssues[cat].bad.length;
    var total = g + p + b;
    kategorienScores[cat] = total > 0 ? Math.round(((g + p * 0.5) / total) * 100) : 0;
  });

  svgDonutChart(kategorienScores);
  localStorage.removeItem("privacyCheckDraft"); // Nach erfolgreicher Auswertung Entwurf löschen
}

// ---- SVG DONUT CHART ----
function svgDonutChart(daten) {
  var labels = Object.keys(daten);
  var werte = Object.values(daten);
  var total = werte.reduce(function(a, b) { return a + b; }, 0) || 1;

  var cx = 210, cy = 170, r = 110, innerR = 65;
  var startWinkel = -Math.PI / 2;
  var pfade = "", linien = "", texte = "";

  labels.forEach(function(label, i) {
    var anteil = werte[i] / total;
    var endWinkel = startWinkel + anteil * 2 * Math.PI;
    var midWinkel = startWinkel + anteil * Math.PI;

    var x1 = cx + r * Math.cos(startWinkel), y1 = cy + r * Math.sin(startWinkel);
    var x2 = cx + r * Math.cos(endWinkel), y2 = cy + r * Math.sin(endWinkel);
    var ix1 = cx + innerR * Math.cos(startWinkel), iy1 = cy + innerR * Math.sin(startWinkel);
    var ix2 = cx + innerR * Math.cos(endWinkel), iy2 = cy + innerR * Math.sin(endWinkel);
    var gb = anteil > 0.5 ? 1 : 0;

    var d = "M " + x1.toFixed(1) + " " + y1.toFixed(1) +
            " A " + r + " " + r + " 0 " + gb + " 1 " + x2.toFixed(1) + " " + y2.toFixed(1) +
            " L " + ix2.toFixed(1) + " " + iy2.toFixed(1) +
            " A " + innerR + " " + innerR + " 0 " + gb + " 0 " + ix1.toFixed(1) + " " + iy1.toFixed(1) + " Z";

    pfade += "<path d='" + d + "' fill='" + FARBEN[i % FARBEN.length] + "' stroke='#0f172a' stroke-width='3'><title>" + label + ": " + werte[i] + "%</title></path>";

    var lineStart = r + 6, lineEnd = r + 24;
    var lx1 = cx + lineStart * Math.cos(midWinkel), ly1 = cy + lineStart * Math.sin(midWinkel);
    var lx2 = cx + lineEnd * Math.cos(midWinkel), ly2 = cy + lineEnd * Math.sin(midWinkel);

    linien += "<line x1='" + lx1.toFixed(1) + "' y1='" + ly1.toFixed(1) + "' x2='" + lx2.toFixed(1) + "' y2='" + ly2.toFixed(1) + "' stroke='" + FARBEN[i % FARBEN.length] + "' stroke-width='2'/>";

    var kurzLabel = label.replace("Einwilligung / Cookies", "Cookies").replace("Datenminimierung", "Dat.-min.").replace("Auftragsverarbeitung", "AV").replace("Rechtsgrundlagen", "Rechtsgr.").replace("Sicherheit / Governance", "Sec/Gov").replace("Sicherheit / Monitoring", "Sec/Mon");

    var textR = r + 38;
    var tx = cx + textR * Math.cos(midWinkel), ty = cy + textR * Math.sin(midWinkel);
    var anchor = Math.cos(midWinkel) >= 0 ? "start" : "end";

    texte += "<text x='" + tx.toFixed(1) + "' y='" + (ty - 5).toFixed(1) + "' text-anchor='" + anchor + "' fill='" + FARBEN[i % FARBEN.length] + "' font-size='11' font-weight='700'>" + werte[i] + "%</text>";
    texte += "<text x='" + tx.toFixed(1) + "' y='" + (ty + 9).toFixed(1) + "' text-anchor='" + anchor + "' fill='#94a3b8' font-size='10'>" + kurzLabel + "</text>";

    startWinkel = endWinkel;
  });

  var durchschnitt = Math.round(werte.reduce(function(a, b) { return a + b; }, 0) / (werte.length || 1));
  var svg = "<svg viewBox='0 0 420 340' width='100%' style='max-width:480px;'>" + pfade + linien + texte +
    "<circle cx='" + cx + "' cy='" + cy + "' r='" + (innerR - 4) + "' fill='#0f172a'/>" +
    "<text x='" + cx + "' y='" + (cy - 8) + "' text-anchor='middle' fill='#e5e7eb' font-size='26' font-weight='bold'>" + durchschnitt + "%</text>" +
    "<text x='" + cx + "' y='" + (cy + 16) + "' text-anchor='middle' fill='#94a3b8' font-size='12'>Ø Konformität</text></svg>";

  document.getElementById("svgChartContainer").innerHTML = svg;

  var legende = "";
  labels.forEach(function(label, i) {
    legende += "<div class='legende-item'><span class='legende-farbe' style='background:" + FARBEN[i % FARBEN.length] + "'></span><span>" + label + ": <strong>" + werte[i] + "%</strong></span></div>";
  });
  document.getElementById("chartLegende").innerHTML = legende;
}

// ---- HILFSFUNKTIONEN ----
function getCheckedValues(sel) { return Array.from(document.querySelectorAll(sel + " input:checked")).map(function(el) { return el.value; }); }
function getRadioValue(name) { var el = document.querySelector("input[name='" + name + "']:checked"); return el ? el.value : null; }
function appTypeLabel(val) { return {saas:"SaaS / Online-Service", shop:"Online-Shop", content:"Content-Website / Blog", internal:"Interne Unternehmensanwendung", other:"Sonstiges"}[val] || val; }
function escapeHtml(str) { return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }

function renderScoreTags(pct, data, purposes) {
  var t = [];
  if (pct >= 80) t.push("<span class='tag'>Gute Datenschutz-Basis</span>");
  else if (pct >= 50) t.push("<span class='tag warning'>Mehrere Verbesserungsmöglichkeiten</span>");
  else t.push("<span class='tag critical'>Hoher Verbesserungsbedarf</span>");
  if (data.indexOf("special") > -1) t.push("<span class='tag critical'>Besondere Kategorien: strenge Anforderungen</span>");
  if (purposes.indexOf("analytics") > -1 || data.indexOf("tracking") > -1) t.push("<span class='tag warning'>Tracking/Analytics im Einsatz</span>");
  if (purposes.indexOf("newsletter") > -1) t.push("<span class='tag warning'>Newsletter: Einwilligungen dokumentieren</span>");
  return t.join("");
}

function renderAdviceText(pct, data, purposes) {
  var t = "";
  if (pct >= 80) t += "<p>Gute Basis. Prüfe Dokumentationspflichten (Datenschutzhinweise, Auftragsverarbeitungsverträge).</p>";
  else if (pct >= 50) t += "<p>Solide Grundlage mit Verbesserungspotenzial. Priorisiere HTTPS, Passwortschutz und Transparenz.</p>";
  else t += "<p>Erheblicher Handlungsbedarf. Fokus auf HTTPS, Passwort-Hashing, Datenschutzhinweise und Rechtsgrundlagen.</p>";
  if (data.indexOf("special") > -1) t += "<p>Besondere Datenkategorien erfordern erhöhte Anforderungen. Prüfe ob eine DSFA (Art. 35) notwendig ist.</p>";
  if (purposes.indexOf("analytics") > -1 || data.indexOf("tracking") > -1) t += "<p>Für Tracking: Cookie-Banner implementieren und alle Tools in der Datenschutzerklärung benennen.</p>";
  return t;
}
