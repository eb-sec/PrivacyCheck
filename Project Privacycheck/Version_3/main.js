/*
PrivacyCheck von Elias Bach
Masterschool Cybersecurity Portfolio – Feb 2026 Berlin
Version 2.4 – Info-Fächer, interaktive Mapping-Badges und dynamischer Aktionsplan
*/

// ---- 1. ERWEITERTE FRAGEN (inkl. infoKey für jede Frage) ----
var QUESTIONS = [
  {
    id: "https",
    text: "Wird die gesamte Kommunikation der Web-App (inkl. API-Schnittstellen und Backends) nachweislich ausschließlich über HTTPS mit TLS 1.2 oder TLS 1.3 abgewickelt (gemäß BSI TR-02102-2)?",
    category: "Sicherheit / Kryptographie",
    weight: 3,
    goodAnswer: "yes",
    mapping: "ISO 27001: A.8.24 | BSI: NET.3.2",
    infoKey: "https_tls"
  },
  {
    id: "pwdHash",
    text: "Werden Authentifizierungsinformationen (Passwörter) ausschließlich mit starken, iterativen Hash-Verfahren (z.B. bcrypt, Argon2id oder PBKDF2) verarbeitet und niemals im Klartext oder als schwacher Hash (MD5, SHA1) gespeichert?",
    category: "Sicherheit / Kryptographie",
    weight: 3,
    goodAnswer: "yes",
    mapping: "ISO 27001: A.8.5 | BSI: ORP.4",
    infoKey: "hashing"
  },
  {
    id: "dpNotice",
    text: "Ist eine vollständige, transparente und leicht verständliche Datenschutzerklärung verfügbar, die präzise über Verarbeitungszwecke, Speicherdauer und Betroffenenrechte gem. Art. 13 und 14 DSGVO informiert?",
    category: "Transparenz / DSGVO",
    weight: 3,
    goodAnswer: "yes",
    mapping: "DSGVO: Art. 12-14",
    infoKey: "datenschutzerklaerung"
  },
  {
    id: "minimization",
    text: "Wird das Prinzip der Datenminimierung („Privacy by Default“) technisch erzwungen, sodass Pflichtfelder in Formularen streng auf den jeweiligen Verarbeitungszweck begrenzt sind?",
    category: "Datenminimierung",
    weight: 2,
    goodAnswer: "yes",
    mapping: "DSGVO: Art. 5 (1) c & Art. 25",
    infoKey: "datenminimierung"
  },
  {
    id: "cookies",
    text: "Verhindert die Applikation das Setzen von nicht-essenziellen Cookies (z.B. Analytics, Marketing), bis der Nutzer über einen Cookie-Banner eine aktive, informierte und widerrufbare Einwilligung erteilt hat?",
    category: "Einwilligung / Cookies",
    weight: 3,
    goodAnswer: "yes",
    mapping: "ePrivacy-RL | TTDSG: § 25",
    infoKey: "cookies_consent"
  },
  {
    id: "legalBasis",
    text: "Sind für alle Verarbeitungszwecke (z.B. Newsletter, Vertragserfüllung, Tracking) die jeweiligen Rechtsgrundlagen nach Art. 6 Abs. 1 DSGVO im Verzeichnis von Verarbeitungstätigkeiten (VVT) sauber dokumentiert?",
    category: "Rechtsgrundlagen",
    weight: 2,
    goodAnswer: "yes",
    mapping: "DSGVO: Art. 6 & Art. 30",
    infoKey: "rechtsgrundlagen"
  },
  {
    id: "processors",
    text: "Wurde mit allen externen Dienstleistern (Cloud-Hosting, SaaS-Tools, Analytics-Anbietern), die Zugriff auf personenbezogene Daten haben, ein Auftragsverarbeitungsvertrag (AVV) gem. Art. 28 DSGVO geschlossen?",
    category: "Auftragsverarbeitung",
    weight: 2,
    goodAnswer: "yes",
    mapping: "DSGVO: Art. 28 | ISO 27001: A.5.15",
    infoKey: "auftragsverarbeitung"
  },
  {
    id: "access",
    text: "Existiert ein dokumentiertes Identitäts- und Berechtigungsmanagement (Rollenkonzept), das Zugriffe nach dem Prinzip der geringsten Berechtigung („Least Privilege“) einschränkt und beim Wechsel von Rollen automatisiert entzieht?",
    category: "Sicherheit / Governance",
    weight: 2,
    goodAnswer: "yes",
    mapping: "ISO 27001: A.5.15 | BSI: ORP.4 | NIST: PR.AC-1",
    infoKey: "berechtigungskonzept"
  },
  {
    id: "logging",
    text: "Werden sicherheitsrelevante Ereignisse (z.B. fehlgeschlagene Logins, Rechteänderungen) in unveränderlichen Logs revisionssicher protokolliert und regelmäßig auf Anomalien geprüft (Monitoring)?",
    category: "Sicherheit / Monitoring",
    weight: 1,
    goodAnswer: "yes",
    mapping: "ISO 27001: A.8.15 | BSI: OPS.1.1.5",
    infoKey: "logging"
  },
  {
    id: "vulnManagement",
    text: "Werden technische Schwachstellen in der genutzten Software (z.B. Frameworks, Bibliotheken, OS) systematisch erfasst, bewertet und durch ein Patch-Management zeitnah behoben?",
    category: "Sicherheit / Lifecycle",
    weight: 3,
    goodAnswer: "yes",
    mapping: "ISO 27001: A.12.6.1",
    infoKey: "vuln_management"
  }
];

// ---- 2. DETAILLIERTE ERKLÄRUNGSTEXTE FÜR DIE INFO-BUTTONS ----
const INFO_TEXTE = {
  https_tls: {
    title: "Verschlüsselung der Datenübertragung (TLS 1.2 / TLS 1.3)",
    body: "Um Daten auf dem Weg zwischen Browser und Server vor Abhören zu schützen, fordert ISO 27001 A.8.24 den Einsatz starker Kryptographie. Das BSI (TR-02102-2) schreibt zudem vor, dass ältere, unsichere Protokolle wie TLS 1.0 oder 1.1 nicht mehr genutzt werden dürfen. SSL-Zertifikate müssen korrekt konfiguriert sein und ausschließlich TLS 1.2 oder das modernere TLS 1.3 zulassen."
  },
  hashing: {
    title: "Sicheres Passwort-Hashing (ISO 27001 A.8.5)",
    body: "Passwörter dürfen unter keinen Umständen im Klartext in einer Datenbank gespeichert werden. ISO 27001 Annex A 8.5 verlangt die sichere Authentifizierung von Benutzern. Dies bedeutet konkret, dass beim Speichern von Passwörtern ein sicheres, 'langsames' Hash-Verfahren mit einem Salt (Salz) verwendet werden muss. Aktuelle BSI-Empfehlungen nennen hierfür Algorithmen wie bcrypt, Argon2 oder PBKDF2."
  },
  datenschutzerklaerung: {
    title: "Informationspflichten (Art. 13 & 14 DSGVO)",
    body: "Die DSGVO verpflichtet Verantwortliche zu maximaler Transparenz. Betroffene Personen müssen zum Zeitpunkt der Datenerhebung genau erfahren, wer die Daten verarbeitet, zu welchem Zweck, auf Basis welcher Rechtsgrundlage und wie lange die Daten gespeichert bleiben. Ebenso muss auf die Betroffenenrechte (Auskunft, Löschung, etc.) hingewiesen werden."
  },
  datenminimierung: {
    title: "Datenminimierung & Privacy by Design (Art. 5 & 25 DSGVO)",
    body: "Das Prinzip der Datenminimierung fordert, dass personenbezogene Daten dem Zweck angemessen und auf das für die Zwecke der Verarbeitung notwendige Maß beschränkt sein müssen. Privacy by Design (Datenschutz durch Technikgestaltung) bedeutet zudem, dass eine Applikation standardmäßig so konfiguriert sein muss, dass nur die nötigsten Daten erfasst werden."
  },
  cookies_consent: {
    title: "Cookie-Einwilligung (ePrivacy-Richtlinie & TTDSG)",
    body: "Nach der ePrivacy-Richtlinie und dem deutschen TTDSG (Telekommunikation-Telemedien-Datenschutz-Gesetz) dürfen Informationen nur dann auf dem Endgerät eines Nutzers gespeichert (z.B. Cookies) oder ausgelesen werden, wenn der Nutzer zuvor ausdrücklich eingewilligt hat. Ausgenommen sind nur solche Cookies, die für den vom Nutzer ausdrücklich gewünschten Dienst (z.B. Warenkorb) technisch absolut notwendig sind."
  },
  rechtsgrundlagen: {
    title: "Rechtmäßigkeit der Verarbeitung (Art. 6 DSGVO)",
    body: "Jede Verarbeitung personenbezogener Daten benötigt eine gültige Rechtsgrundlage gem. Art. 6 DSGVO. Das kann z.B. eine ausdrückliche Einwilligung (Newsletter), die Erfüllung eines Vertrags (Kauf im Shop) oder ein berechtigtes Interesse (IT-Sicherheits-Logs) sein. Ohne Rechtsgrundlage ist die Verarbeitung illegal."
  },
  auftragsverarbeitung: {
    title: "Auftragsverarbeitungsverträge (AVV gem. Art. 28 DSGVO)",
    body: "Sobald ein externer Dienstleister weisungsgebunden personenbezogene Daten für dein Unternehmen verarbeitet (z.B. Cloud-Provider wie AWS, Newsletter-Tools oder Web-Hoster), musst du einen schriftlichen Vertrag zur Auftragsverarbeitung (AVV) abschließen. Dies fordert auch ISO 27001 (Lieferantenbeziehungen), um sicherzustellen, dass Dienstleister das gleiche Schutzniveau einhalten."
  },
  berechtigungskonzept: {
    title: "Identity & Access Management (Least Privilege)",
    body: "NIST CSF (PR.AC-1) und BSI-Grundschutz (ORP.4) fordern, dass jeder Nutzer nur exakt die Berechtigungen erhält, die er für seine aktuellen Aufgaben benötigt (Least Privilege). Ein dokumentiertes Rollenkonzept stellt sicher, dass Administratorenrechte restriktiv vergeben werden und Zugriffe beim Verlassen des Unternehmens sofort gesperrt werden."
  },
  logging: {
    title: "Protokollierung & Monitoring (ISO 27001 A.8.15)",
    body: "Um Angriffe oder Datenschutzverletzungen erkennen und nachvollziehen zu können, müssen sicherheitsrelevante Ereignisse protokolliert werden. Dazu gehören An- und Abmeldungen, Änderungen an Berechtigungen oder massenhafte Datenabrufe. BSI OPS.1.1.5 fordert zudem, dass diese Logs vor nachträglicher Manipulation (Löschung durch Angreifer) geschützt sein müssen."
  },
  vuln_management: {
    title: "Technisches Schwachstellenmanagement (ISO 27001 A.12.6.1)",
    body: "Das technische Schwachstellenmanagement verlangt, dass Unternehmen Informationen über Schwachstellen der von ihnen genutzten Informationssysteme erhalten, das Risiko dieser Schwachstellen bewerten und rechtzeitig geeignete Maßnahmen (z.B. das Einspielen von Sicherheits-Updates / Patches) ergreifen, um eine Ausnutzung durch Angreifer zu verhindern."
  },
  dsfa_info: {
    title: "Datenschutz-Folgenabschätzung (Art. 35 DSGVO)",
    body: "Verarbeitet eine Applikation besondere Kategorien personenbezogener Daten (z.B. Gesundheitsdaten, Biometrie, politische Meinungen) oder führt sie ein systematisches Profiling durch, besteht ein voraussichtlich hohes Risiko für die Rechte und Freiheiten der Nutzer. Art. 35 DSGVO schreibt dann zwingend eine dokumentierte Risikoanalyse (DSFA) vor, bevor die Verarbeitung gestartet wird."
  }
};

var FARBEN = ["#3b82f6","#10b981","#f59e0b","#8b5cf6","#ef4444","#06b6d4","#84cc16","#f97316","#ec4899","#64748b"];

var currentStep = 1;
var maxStep = 4;

var prevBtn = document.getElementById("prevBtn");
var nextBtn = document.getElementById("nextBtn");
var printBtn = document.getElementById("printReportBtn");
var exportCsvBtn = document.getElementById("exportCsvBtn");

// ---- 3. STARTUP & EVENT LISTENERS ----
renderQuestions();
loadDraft();
updateStepView();

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

  // Dynamische Risiko-Logik (DSFA)
  if (currentStep === 2) {
    var specialCheckbox = document.querySelector("input[value='special']");
    var isSpecial = specialCheckbox ? specialCheckbox.checked : false;
    var hasDsfa = QUESTIONS.some(function(q) { return q.id === "dsfa"; });

    if (isSpecial && !hasDsfa) {
      QUESTIONS.push({
        id: "dsfa",
        text: "🚨 [HOHES RISIKO ERKANNT] Wurde aufgrund der Verarbeitung sensibler Daten eine formalisierte Datenschutz-Folgenabschätzung (DSFA) gem. Art. 35 DSGVO durchgeführt und dokumentiert?",
        category: "Risikomanagement",
        weight: 4,
        goodAnswer: "yes",
        mapping: "DSGVO: Art. 35 | ISO 27001: A.5.34",
        infoKey: "dsfa_info"
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

if(printBtn) printBtn.addEventListener("click", function() { window.print(); });

// Auto-Save bei Änderungen im Formular
var container = document.querySelector(".app-container");
if (container) {
  container.addEventListener("change", function() { saveDraft(); });
}

// CSV-Export Logik
if (exportCsvBtn) {
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
        var desc = "Die Anforderung wurde mit '" + (answer === "no" ? "Nein" : "Teilweise") + "' bewertet. Prüfung erforderlich für: " + q.text.replace(/,/g, "");

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

// ---- 4. UI RENDER FUNKTIONEN ----
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
  if(!container) return;
  container.innerHTML = "";
  
  QUESTIONS.forEach(function(q) {
    var card = document.createElement("div");
    card.className = "question-card";

    var infoButtonHtml = "";
    if (q.infoKey && INFO_TEXTE[q.infoKey]) {
      infoButtonHtml = "<button type='button' class='info-btn' data-info-key='" + q.infoKey + "'>ℹ Mehr erfahren</button>";
    }

    card.innerHTML =
      "<div class='question-header-line'>" +
        "<p class='question-title'>" + q.text + "</p>" +
        infoButtonHtml +
      "</div>" +
      "<p class='question-meta'>" + q.category + " • Gewichtung: " + q.weight + "</p>" +
      "<div class='question-info-panel' data-info-panel='" + (q.infoKey || "") + "'></div>" +
      "<div class='question-options'>" +
        "<label><input type='radio' name='q-" + q.id + "' value='yes'> Ja</label>" +
        "<label><input type='radio' name='q-" + q.id + "' value='partial'> Teilweise / In Planung</label>" +
        "<label><input type='radio' name='q-" + q.id + "' value='no'> Nein</label>" +
        "<label><input type='radio' name='q-" + q.id + "' value='na'> Nicht anwendbar</label>" +
      "</div>";

    container.appendChild(card);
  });
  
  attachInfoButtonHandlers();
}

function attachInfoButtonHandlers() {
  document.querySelectorAll(".info-btn").forEach(function(btn) {
    btn.addEventListener("click", function() {
      var key = btn.getAttribute("data-info-key");
      var info = INFO_TEXTE[key];
      if (!info) return;

      var panel = btn.closest(".question-card").querySelector(".question-info-panel");
      if (!panel) return;

      if (panel.classList.contains("open")) {
        panel.classList.remove("open");
        panel.innerHTML = "";
      } else {
        panel.classList.add("open");
        panel.innerHTML = "<h4>" + info.title + "</h4><p>" + info.body + "</p>";
      }
    });
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

// ---- 5. AUSWERTUNG GENERIEREN ----
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
    return QUESTIONS.find(function(x) { return fragetext.indexOf(x.text) > -1; });
  }

  Object.keys(categoryIssues).forEach(function(cat) {
    var sec = document.createElement("div");
    sec.className = "result-section";
    sec.innerHTML = "<h3>" + cat + "</h3>";
    var ul = document.createElement("ul");

    categoryIssues[cat].bad.forEach(function(item) {
      var q = getMapping(item.text);
      var mapHtml = "";
      if (q && q.mapping) {
        if (q.infoKey && INFO_TEXTE[q.infoKey]) {
          mapHtml = "<button type='button' class='detail-mapping clickable' data-info-key='" + q.infoKey + "'>🔖 " + q.mapping + " <span>(Erklärung)</span></button>" +
                    "<div class='question-info-panel result-info-panel' data-info-panel='" + q.infoKey + "'></div>";
        } else {
          mapHtml = "<div class='detail-mapping'>🔖 " + q.mapping + "</div>";
        }
      }

      ul.innerHTML += "<li class='detail-item detail-bad'>" +
        "<div class='detail-header'><span class='detail-icon'>❌</span><span class='detail-status bad'>Offen / Kritisch</span><span class='detail-answer'>Deine Antwort: <strong>NEIN</strong></span></div>" +
        "<div class='detail-frage'>" + escapeHtml(item.text) + "</div>" +
        mapHtml + "</li>";
    });

    categoryIssues[cat].partial.forEach(function(item) {
      var q = getMapping(item.text);
      var isNa = item.type === "na";
      var antwortText = isNa ? "NICHT BEANTWORTET / N.A." : "TEILWEISE / IN PLANUNG";
      
      var mapHtml = "";
      if (q && q.mapping) {
        if (q.infoKey && INFO_TEXTE[q.infoKey]) {
          mapHtml = "<button type='button' class='detail-mapping clickable' data-info-key='" + q.infoKey + "'>🔖 " + q.mapping + " <span>(Erklärung)</span></button>" +
                    "<div class='question-info-panel result-info-panel' data-info-panel='" + q.infoKey + "'></div>";
        } else {
          mapHtml = "<div class='detail-mapping'>🔖 " + q.mapping + "</div>";
        }
      }

      ul.innerHTML += "<li class='detail-item detail-partial'>" +
        "<div class='detail-header'><span class='detail-icon'>⚠️</span><span class='detail-status partial'>" + (isNa ? "Nicht bewertet" : "Teilweise") + "</span><span class='detail-answer'>Deine Antwort: <strong>" + antwortText + "</strong></span></div>" +
        "<div class='detail-frage'>" + escapeHtml(item.text) + "</div>" +
        mapHtml + "</li>";
    });

    categoryIssues[cat].good.forEach(function(item) {
      var q = getMapping(item.text);
      var mapHtml = "";
      if (q && q.mapping) {
        if (q.infoKey && INFO_TEXTE[q.infoKey]) {
          mapHtml = "<button type='button' class='detail-mapping clickable' data-info-key='" + q.infoKey + "'>🔖 " + q.mapping + " <span>(Erklärung)</span></button>" +
                    "<div class='question-info-panel result-info-panel' data-info-panel='" + q.infoKey + "'></div>";
        } else {
          mapHtml = "<div class='detail-mapping'>🔖 " + q.mapping + "</div>";
        }
      }

      ul.innerHTML += "<li class='detail-item detail-good'>" +
        "<div class='detail-header'><span class='detail-icon'>✅</span><span class='detail-status good'>Umgesetzt</span><span class='detail-answer'>Deine Antwort: <strong>JA</strong></span></div>" +
        "<div class='detail-frage'>" + escapeHtml(item.text) + "</div>" +
        mapHtml + "</li>";
    });

    sec.appendChild(ul);
    resultDetails.appendChild(sec);
  });

  var kategorienScores = {};
  Object.keys(categoryIssues).forEach(function(cat) {
    var g = categoryIssues[cat].good.length;
    var p = categoryIssues[cat].partial.length;
    var b = categoryIssues[cat].bad.length;
    var total = g + p + b;
    kategorienScores[cat] = total > 0 ? Math.round(((g + p * 0.5) / total) * 100) : 0;
  });

  svgDonutChart(kategorienScores);
  localStorage.removeItem("privacyCheckDraft"); 
  
  // Render den neuen interaktiven Aktionsplan (To-Do-Liste)
  renderActionPlan(categoryIssues);

  // Event-Listener für die Mapping-Buttons im Report anhängen
  attachResultInfoHandlers();
}

// ---- NEU: AKTIONSPLAN (TO-DO-LISTE) GENERIEREN ----
function renderActionPlan(categoryIssues) {
  var container = document.getElementById("actionPlanContainer");
  if (!container) return;

  var openTasks = [];
  
  // Alle "bad" und "partial" Antworten sammeln
  Object.keys(categoryIssues).forEach(function(cat) {
    categoryIssues[cat].bad.forEach(function(item) {
      openTasks.push({ text: item.text, cat: cat, type: "bad" });
    });
    categoryIssues[cat].partial.forEach(function(item) {
      if(item.type !== "na") { // "na" (nicht anwendbar) ignorieren wir
        openTasks.push({ text: item.text, cat: cat, type: "partial" });
      }
    });
  });

  // Wenn alles perfekt ist, keinen Plan anzeigen
  if (openTasks.length === 0) {
    container.innerHTML = "<div class='action-plan-empty'>🎉 Keine offenen Maßnahmen! Alle geprüften Anforderungen sind umgesetzt.</div>";
    return;
  }

  // HTML für die Checkliste zusammenbauen
  var html = "<h3>Dein Aktionsplan (" + openTasks.length + " offene Punkte)</h3>";
  html += "<div class='progress-bar-container'><div id='actionProgress' class='progress-bar-fill' style='width: 0%'></div></div>";
  html += "<p id='actionProgressText' class='progress-text'>0 von " + openTasks.length + " erledigt</p>";
  
  html += "<div class='action-task-list'>";
  openTasks.forEach(function(task, index) {
    var badgeClass = task.type === "bad" ? "critical" : "warning";
    var badgeText = task.type === "bad" ? "Kritisch" : "Wichtig";
    
    html += "<label class='action-task-item'>" +
              "<input type='checkbox' class='action-checkbox' data-index='" + index + "'>" +
              "<div class='action-task-content'>" +
                "<div class='action-task-header'>" +
                  "<span class='tag " + badgeClass + "'>" + badgeText + "</span>" +
                  "<span class='action-task-cat'>" + task.cat + "</span>" +
                "</div>" +
                "<p class='action-task-text'>" + escapeHtml(task.text) + "</p>" +
              "</div>" +
            "</label>";
  });
  html += "</div>";

  container.innerHTML = html;

  // Event-Listener für die Fortschrittsanzeige anhängen
  var checkboxes = container.querySelectorAll(".action-checkbox");
  checkboxes.forEach(function(box) {
    box.addEventListener("change", function() {
      var checkedCount = container.querySelectorAll(".action-checkbox:checked").length;
      var totalCount = openTasks.length;
      var percent = Math.round((checkedCount / totalCount) * 100);
      
      document.getElementById("actionProgress").style.width = percent + "%";
      document.getElementById("actionProgressText").innerText = checkedCount + " von " + totalCount + " erledigt";
      
      // Visuelles Feedback für das erledigte Item
      if(box.checked) {
        box.closest(".action-task-item").classList.add("done");
      } else {
        box.closest(".action-task-item").classList.remove("done");
      }
    });
  });
}

function attachResultInfoHandlers() {
  document.querySelectorAll(".detail-mapping.clickable").forEach(function(btn) {
    btn.addEventListener("click", function() {
      var key = btn.getAttribute("data-info-key");
      var info = INFO_TEXTE[key];
      if (!info) return;

      var panel = btn.nextElementSibling;
      if (!panel) return;

      if (panel.classList.contains("open")) {
        panel.classList.remove("open");
        panel.innerHTML = "";
      } else {
        panel.classList.add("open");
        panel.innerHTML = "<h4>" + info.title + "</h4><p>" + info.body + "</p>";
      }
    });
  });
}

// ---- 6. SVG DONUT CHART ----
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

    var kurzLabel = label.replace("Einwilligung / Cookies", "Cookies").replace("Datenminimierung", "Dat.-min.").replace("Auftragsverarbeitung", "AV").replace("Rechtsgrundlagen", "Rechtsgr.").replace("Sicherheit / Governance", "Sec/Gov").replace("Sicherheit / Monitoring", "Sec/Mon").replace("Sicherheit / Kryptographie", "Krypto").replace("Transparenz / DSGVO", "Transparenz").replace("Sicherheit / Lifecycle", "Lifecycle");

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

// ---- 7. AUTO-SAVE & HILFSFUNKTIONEN ----
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

    if (draft.dataCategories && draft.dataCategories.indexOf("special") > -1) {
      if (!QUESTIONS.some(function(q) { return q.id === "dsfa"; })) {
        QUESTIONS.push({
          id: "dsfa",
          text: "🚨 [HOHES RISIKO ERKANNT] Wurde aufgrund der Verarbeitung sensibler Daten eine formalisierte Datenschutz-Folgenabschätzung (DSFA) gem. Art. 35 DSGVO durchgeführt und dokumentiert?",
          category: "Risikomanagement",
          weight: 4,
          goodAnswer: "yes",
          mapping: "DSGVO: Art. 35 | ISO 27001: A.5.34",
          infoKey: "dsfa_info"
        });
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
