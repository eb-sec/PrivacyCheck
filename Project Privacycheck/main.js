/*
PrivacyCheck von Elias Bach
Masterschool Cybersecurity Portfolio – Feb 2026 Berlin
Version 4.0 – Dynamische Tech-Deep-Dives & Radar-Chart Visualisierung
*/

// ---- 1. BASIS-FRAGEN (inkl. todoText für den Aktionsplan) ----
var BASE_QUESTIONS = [
  {
    id: "https",
    text: "Wird die gesamte Kommunikation der Web-App (inkl. API-Schnittstellen und Backends) nachweislich ausschließlich über HTTPS mit TLS 1.2 oder TLS 1.3 abgewickelt (gemäß BSI TR-02102-2)?",
    category: "Sicherheit / Kryptographie",
    weight: 3,
    goodAnswer: "yes",
    mapping: "ISO 27001: A.8.24 | OWASP: A02:2021",
    infoKey: "https_tls",
    critical: true,
    todoText: "TLS-Konfiguration auf dem Server überprüfen. Zertifikat einrichten, HTTP auf HTTPS umleiten und Legacy-Protokolle (TLS 1.0/1.1) serverseitig deaktivieren."
  },
  {
    id: "pwdHash",
    text: "Werden Authentifizierungsinformationen (Passwörter) ausschließlich mit starken, iterativen Hash-Verfahren (z.B. bcrypt, Argon2id oder PBKDF2) verarbeitet und niemals im Klartext oder als schwacher Hash (MD5, SHA1) gespeichert?",
    category: "Sicherheit / Kryptographie",
    weight: 3,
    goodAnswer: "yes",
    mapping: "ISO 27001: A.8.5 | OWASP: A07:2021",
    infoKey: "hashing",
    critical: true,
    todoText: "Passwort-Hashing-Algorithmus im Backend auf bcrypt, Argon2id oder PBKDF2 umstellen (inkl. automatischem Salt). Klartext-Passwörter aus der Datenbank migrieren/löschen."
  },
  {
    id: "dpNotice",
    text: "Ist eine vollständige, transparente und leicht verständliche Datenschutzerklärung verfügbar, die präzise über Verarbeitungszwecke, Speicherdauer und Betroffenenrechte gem. Art. 13 und 14 DSGVO informiert?",
    category: "Transparenz / DSGVO",
    weight: 3,
    goodAnswer: "yes",
    mapping: "DSGVO: Art. 12-14",
    infoKey: "datenschutzerklaerung",
    todoText: "Datenschutzerklärung gem. Art. 13/14 DSGVO von einem Experten/Tool erstellen lassen. Sie muss von jeder Seite aus erreichbar sein und alle Tools (Tracking, Hosting) benennen."
  },
  {
    id: "minimization",
    text: "Wird das Prinzip der Datenminimierung („Privacy by Default“) technisch erzwungen, sodass Pflichtfelder in Formularen streng auf den jeweiligen Verarbeitungszweck begrenzt sind?",
    category: "Datenminimierung",
    weight: 2,
    goodAnswer: "yes",
    mapping: "DSGVO: Art. 5 (1) c & Art. 25",
    infoKey: "datenminimierung",
    todoText: "Alle Eingabeformulare der App überprüfen. Nicht zwingend notwendige Felder entfernen oder als 'optional' markieren, um 'Privacy by Default' technisch zu erzwingen."
  },
  {
    id: "cookies",
    text: "Verhindert die Applikation das Setzen von nicht-essenziellen Cookies (z.B. Analytics, Marketing), bis der Nutzer über einen Cookie-Banner eine aktive, informierte und widerrufbare Einwilligung erteilt hat?",
    category: "Einwilligung / Cookies",
    weight: 3,
    goodAnswer: "yes",
    mapping: "ePrivacy-RL | TDDDG: § 25",
    infoKey: "cookies_consent",
    todoText: "Einen rechtskonformen Consent-Manager (Cookie-Banner) integrieren. Drittanbieter-Skripte (Analytics, Werbung) dürfen technisch erst NACH aktivem Opt-in geladen werden."
  },
  {
    id: "legalBasis",
    text: "Sind für alle Verarbeitungszwecke (z.B. Newsletter, Vertragserfüllung, Tracking) die jeweiligen Rechtsgrundlagen nach Art. 6 Abs. 1 DSGVO im Verzeichnis von Verarbeitungstätigkeiten (VVT) sauber dokumentiert?",
    category: "Rechtsgrundlagen",
    weight: 2,
    goodAnswer: "yes",
    mapping: "DSGVO: Art. 6 & Art. 30",
    infoKey: "rechtsgrundlagen",
    todoText: "Ein Verzeichnis von Verarbeitungstätigkeiten (VVT) anlegen. Darin für jeden Prozess (Hosting, Mails, Analytics) die genaue Rechtsgrundlage nach Art. 6 DSGVO dokumentieren."
  },
  {
    id: "processors",
    text: "Wurde mit allen externen Dienstleistern (Cloud-Hosting, SaaS-Tools, Analytics-Anbietern), die Zugriff auf personenbezogene Daten haben, ein Auftragsverarbeitungsvertrag (AVV) gem. Art. 28 DSGVO geschlossen?",
    category: "Auftragsverarbeitung",
    weight: 2,
    goodAnswer: "yes",
    mapping: "DSGVO: Art. 28 | ISO 27001: A.5.19",
    infoKey: "auftragsverarbeitung",
    todoText: "Inventar aller Dienstleister (Hoster, Mail-Provider, Tools) erstellen und mit jedem Anbieter einen schriftlichen Auftragsverarbeitungsvertrag (AVV) abschließen/downloaden."
  },
  {
    id: "access",
    text: "Existiert ein dokumentiertes Identitäts- und Berechtigungsmanagement (Rollenkonzept), das Zugriffe nach dem Prinzip der geringsten Berechtigung („Least Privilege“) einschränkt und beim Wechsel von Rollen automatisiert entzieht?",
    category: "Sicherheit / Governance",
    weight: 2,
    goodAnswer: "yes",
    mapping: "ISO 27001: A.5.15 | OWASP: A01:2021", 
    infoKey: "berechtigungskonzept",
    todoText: "Rollen- und Berechtigungskonzept (RBAC) ausarbeiten und im Code durchsetzen ('Least Privilege'). Direkte Objektreferenzen (IDOR) in der API absichern."
  },
  {
    id: "logging",
    text: "Werden sicherheitsrelevante Ereignisse (z.B. fehlgeschlagene Logins, Rechteänderungen) in unveränderlichen Logs revisionssicher protokolliert und regelmäßig auf Anomalien geprüft (Monitoring)?",
    category: "Sicherheit / Monitoring",
    weight: 1,
    goodAnswer: "yes",
    mapping: "ISO 27001: A.8.15 | OWASP: A09:2021",
    infoKey: "logging",
    todoText: "Security-Logging implementieren. Fehlgeschlagene Logins, Admin-Aktionen und Passwort-Resets manipulationssicher protokollieren und an ein zentrales Monitoring anbinden."
  },
  {
    id: "vulnManagement",
    text: "Werden technische Schwachstellen in der genutzten Software (z.B. Frameworks, Bibliotheken, OS) systematisch erfasst, bewertet und durch ein Patch-Management zeitnah behoben?",
    category: "Sicherheit / Lifecycle",
    weight: 3,
    goodAnswer: "yes",
    mapping: "ISO 27001: A.8.8 | OWASP: A06:2021",
    infoKey: "vuln_management",
    todoText: "Abhängigkeiten automatisch prüfen lassen (z.B. 'npm audit' in CI/CD). Veraltete Bibliotheken updaten und einen regelmäßigen Patch-Zyklus für den Server definieren."
  }
];

// ---- DYNAMISCHE EDGE-CASE FRAGEN (Werden je nach App-Typ injiziert) ----
const DYNAMIC_QUESTIONS = {
  saas: {
    id: "apiSecurity",
    text: "⚡ [SaaS & API Deep Dive] Werden API-Endpunkte sicher authentifiziert (z.B. mittels kryptographisch signierter JWT-Token) und gibt es ein striktes Rate-Limiting gegen Brute-Force-Angriffe?",
    category: "Sicherheit / API",
    weight: 3,
    goodAnswer: "yes",
    mapping: "OWASP API:2023",
    infoKey: "api_security",
    critical: true,
    todoText: "API-Authentifizierung (JWT mit sicherer Signatur & kurzer Expiration) und Rate-Limiting am API-Gateway zwingend implementieren."
  },
  shop: {
    id: "paymentPci",
    text: "💳 [E-Commerce Deep Dive] Werden Zahlungsdaten (z.B. Kreditkarten) strikt nach PCI-DSS verarbeitet, d.h. nicht im eigenen Backend gespeichert, sondern tokenisiert über externe Payment-Gateway-Provider abgewickelt?",
    category: "Compliance / Payment",
    weight: 4,
    goodAnswer: "yes",
    mapping: "PCI-DSS v4.0",
    infoKey: "pci_dss",
    critical: true,
    todoText: "Zahlungsabwicklung auf zertifizierte Drittanbieter (Stripe, PayPal) auslagern. Niemals Kreditkarten-Daten (PAN) in der eigenen Datenbank speichern."
  },
  content: {
    id: "cmsSecurity",
    text: "📝 [Content/Blog Deep Dive] Ist das Admin-Panel (CMS-Zugang) besonders abgesichert, z.B. durch 2-Faktor-Authentifizierung (2FA) für Redakteure und eine IP-Restriktion?",
    category: "Sicherheit / Governance",
    weight: 2,
    goodAnswer: "yes",
    mapping: "ISO 27001: A.5.17",
    infoKey: "cms_security",
    critical: false,
    todoText: "Admin-Panel (z.B. /wp-admin) absichern: 2-Faktor-Authentifizierung für Redakteure erzwingen und Login-Versuche begrenzen (Fail2Ban)."
  }
};

var QUESTIONS = [...BASE_QUESTIONS]; // Die aktive Arbeitskopie

// ---- 2. DETAILLIERTE ERKLÄRUNGSTEXTE FÜR DIE INFO-BUTTONS ----
const INFO_TEXTE = {
  https_tls: { title: "Verschlüsselung der Datenübertragung", body: "Um Daten auf dem Weg zwischen Browser und Server vor Abhören zu schützen, fordert ISO 27001 A.8.24 starke Kryptographie. BSI TR-02102-2 verbietet alte Protokolle wie TLS 1.0/1.1." },
  hashing: { title: "Sicheres Passwort-Hashing", body: "Passwörter dürfen niemals im Klartext gespeichert werden (OWASP A07:2021). BSI TR-02102-1 empfiehlt iterative Verfahren mit Salt wie bcrypt, Argon2id oder PBKDF2." },
  datenschutzerklaerung: { title: "Informationspflichten (Art. 13 & 14 DSGVO)", body: "Nutzer müssen zum Zeitpunkt der Erhebung genau erfahren, wer die Daten verarbeitet, zu welchem Zweck, auf welcher Rechtsgrundlage und wie lange." },
  datenminimierung: { title: "Datenminimierung & Privacy by Design", body: "Personenbezogene Daten müssen auf das absolut notwendige Minimum beschränkt werden (Art. 5 DSGVO). Applikationen müssen datenschutzfreundlich voreingestellt sein (Privacy by Default)." },
  cookies_consent: { title: "Cookie-Einwilligung (TDDDG)", body: "Nach dem deutschen TDDDG und ePrivacy-RL dürfen nicht-essenzielle Tracker/Cookies erst nach aktiver, informierter Einwilligung (Opt-in) gesetzt werden." },
  rechtsgrundlagen: { title: "Rechtmäßigkeit der Verarbeitung", body: "Jede Verarbeitung benötigt eine Rechtsgrundlage (Art. 6 DSGVO), z.B. Einwilligung, Vertragserfüllung oder berechtigtes Interesse. Dies muss im VVT dokumentiert sein." },
  auftragsverarbeitung: { title: "Auftragsverarbeitungsverträge (AVV)", body: "Sobald externe Dienstleister (z.B. AWS, Vercel) weisungsgebunden personenbezogene Daten verarbeiten, ist zwingend ein AVV nach Art. 28 DSGVO abzuschließen." },
  berechtigungskonzept: { title: "Identity & Access Management", body: "Nutzer dürfen nur exakt die Berechtigungen erhalten, die sie benötigen (Least Privilege). Mangelhafte Zugriffskontrolle ist das Top-Risiko (OWASP A01:2021 Broken Access Control)." },
  logging: { title: "Protokollierung & Monitoring", body: "Um Sicherheitsvorfälle zu erkennen, müssen Login-Fehler und Admin-Aktionen manipulationssicher protokolliert werden (ISO 27001 A.8.15 / OWASP A09:2021)." },
  vuln_management: { title: "Schwachstellenmanagement", body: "Veraltete Softwarekomponenten sind ein Haupteinfallstor für Hacker. ISO 27001 A.8.8 verlangt ein striktes Patch-Management." },
  dsfa_info: { title: "Datenschutz-Folgenabschätzung (DSFA)", body: "Werden hochsensible Daten verarbeitet, besteht ein hohes Risiko. Art. 35 DSGVO schreibt dann eine ausführliche, dokumentierte Risikoanalyse vor." },
  // Neue Deep-Dive Infos:
  api_security: { title: "API-Sicherheit & JWT", body: "APIs sind das primäre Ziel moderner Angriffe. OWASP API:2023 fordert kryptografisch starke Authentifizierung (z.B. signierte JSON Web Tokens) und Rate-Limiting gegen DoS-Angriffe." },
  pci_dss: { title: "Kreditkartenverarbeitung (PCI-DSS)", body: "Die Verarbeitung von Kreditkarten unterliegt extrem strengen Payment Card Industry (PCI-DSS) Standards. E-Commerce-Sites sollten niemals eigene Server für den Zahlungsfluss nutzen, sondern sichere Iframes/Token der Zahlungsanbieter." },
  cms_security: { title: "CMS Access Control", body: "Admin-Bereiche von Blogs (z.B. WordPress) werden automatisiert von Botnetzen angegriffen. Ohne 2FA und IP-Beschränkungen (ISO 27001 A.5.17) droht die komplette Übernahme der Website." }
};

var FARBEN = ["#3b82f6","#10b981","#f59e0b","#8b5cf6","#ef4444","#06b6d4","#84cc16","#f97316","#ec4899","#64748b"];

var currentStep = 1;
var maxStep = 4;

var prevBtn = document.getElementById("prevBtn");
var nextBtn = document.getElementById("nextBtn");
var printBtn = document.getElementById("printReportBtn");
var exportCsvBtn = document.getElementById("exportCsvBtn");
var backToStep3Btn = document.getElementById("backToStep3Btn");

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

  // DYNAMISCHE FRAGEN INJEKTION VOR SCHRITT 3
  if (currentStep === 2) {
    var specialCheckbox = document.querySelector("input[value='special']");
    var isSpecial = specialCheckbox ? specialCheckbox.checked : false;
    var appType = document.getElementById("appType").value;
    
    // Reset auf Base-Questions, um Duplikate beim Vor/Zurück zu vermeiden
    QUESTIONS = [...BASE_QUESTIONS];

    // 1. Risiko-Frage (DSFA) einbauen falls sensible Daten verarbeitet werden
    if (isSpecial) {
      QUESTIONS.push({
        id: "dsfa",
        text: "🚨 [HOHES RISIKO ERKANNT] Wurde aufgrund der Verarbeitung sensibler Daten eine formalisierte Datenschutz-Folgenabschätzung (DSFA) gem. Art. 35 DSGVO durchgeführt und dokumentiert?",
        category: "Risikomanagement",
        weight: 4,
        goodAnswer: "yes",
        mapping: "DSGVO: Art. 35 | ISO 27001: A.5.34",
        infoKey: "dsfa_info",
        todoText: "Eine formelle Datenschutz-Folgenabschätzung (DSFA) nach Art. 35 DSGVO durchführen und dokumentieren."
      });
    }

    // 2. Tech Deep-Dive einbauen basierend auf App-Typ
    if (DYNAMIC_QUESTIONS[appType]) {
      QUESTIONS.push(DYNAMIC_QUESTIONS[appType]);
    }

    renderQuestions();
  }

  if (currentStep < maxStep) {
    currentStep++;
    if (currentStep === maxStep) computeAndRenderResult();
    updateStepView();
    saveDraft();
  }
});

if(backToStep3Btn) backToStep3Btn.addEventListener("click", function() { currentStep = 3; updateStepView(); });
if(printBtn) printBtn.addEventListener("click", function() { window.print(); });
var container = document.querySelector(".app-container");
if (container) container.addEventListener("change", function() { saveDraft(); });

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
        var toDoString = q.todoText ? q.todoText : q.text;
        var desc = "Die Anforderung wurde mit '" + (answer === "no" ? "Nein" : "Teilweise") + "' bewertet. To-Do: " + toDoString.replace(/,/g, "");

        var row = ["Task", priority, '"' + summary + '"', '"' + desc + '"', '"' + q.category + '"'].join(",");
        csvContent += row + "\n";
      }
    });

    if (!hasIssues) { alert("Es gibt keine offenen Maßnahmen. Deine App ist konform!"); return; }

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "DSGVO_Massnahmen_" + appName.replace(/\s+/g, '_') + ".csv");
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  });
}

// ---- 4. UI RENDER FUNKTIONEN ----
function updateStepView() {
  document.querySelectorAll(".step").forEach(function(s, i) { s.classList.toggle("active", i + 1 === currentStep); });
  document.querySelectorAll(".step-indicator").forEach(function(ind) { ind.classList.toggle("active", parseInt(ind.dataset.step) === currentStep); });
  prevBtn.disabled = currentStep === 1;
  
  var mainFooter = document.getElementById("mainNavFooter");
  if (currentStep === maxStep) {
    if(mainFooter) mainFooter.style.display = "none";
  } else {
    if(mainFooter) mainFooter.style.display = "flex";
    nextBtn.textContent = currentStep === maxStep - 1 ? "Auswertung" : "Weiter";
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
        panel.classList.remove("open"); panel.innerHTML = "";
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
  var criticalFailures = [];

  QUESTIONS.forEach(function(q) {
    var answer = getRadioValue("q-" + q.id);
    // Wir extrahieren nur den Hauptteil der Kategorie (vor dem Slash), damit das Radar-Chart nicht überladen wird
    var mainCat = q.category.split(" / ")[1] || q.category.split(" / ")[0]; 
    if (!categoryIssues[mainCat]) categoryIssues[mainCat] = {good:[], partial:[], bad:[]};
    totalWeight += q.weight;
    
    if (!answer || answer === "na") { 
      categoryIssues[mainCat].partial.push({text: q.text, type: "na", todoText: q.todoText, cat: q.category}); 
      return; 
    }
    
    if (answer === q.goodAnswer) { 
      achievedScore += q.weight;       
      categoryIssues[mainCat].good.push({text: q.text, todoText: q.todoText, cat: q.category}); 
    } else if (answer === "partial") { 
      achievedScore += q.weight * 0.5; 
      categoryIssues[mainCat].partial.push({text: q.text, type: "partial", todoText: q.todoText, cat: q.category}); 
    } else {                                   
      categoryIssues[mainCat].bad.push({text: q.text, todoText: q.todoText, cat: q.category}); 
      if (q.critical) criticalFailures.push(q.category);
    }
  });

  var percentage = totalWeight > 0 ? Math.round((achievedScore / totalWeight) * 100) : 0;
  var scoreClass = percentage >= 80 ? "good" : percentage >= 50 ? "medium" : "bad";

  var showstopperHtml = "";
  if (criticalFailures.length > 0) {
    scoreClass = "bad"; 
    var uniqueCrits = criticalFailures.filter(function(v, i, a) { return a.indexOf(v) === i; });
    showstopperHtml = "<div class='critical-alert-box'><h4>🚨 KRITISCHES SICHERHEITSRISIKO</h4><p>Die Anwendung weist eklatante Basis-Sicherheitslücken auf (Showstopper in: <strong>" + uniqueCrits.join(", ") + "</strong>). Ein Live-Betrieb ist strengstens abzuraten, bis diese Maßnahmen umgesetzt wurden!</p></div>";
  }

  document.getElementById("resultSummary").innerHTML =
    "<p><strong>App:</strong> " + escapeHtml(appName) + (appType ? " • Typ: " + appTypeLabel(appType) : "") + (zielgruppe ? " • Zielgruppe: " + escapeHtml(zielgruppe) : "") + "</p>" + showstopperHtml +
    "<p class='score-badge " + scoreClass + "'><span>" + percentage + "</span><span class='unit'>/ 100 Punkte</span></p>" +
    "<div class='tag-row'>" + renderScoreTags(percentage, dataCategories, purposes) + "</div>";

  var resultDetails = document.getElementById("resultDetails");
  resultDetails.innerHTML = "";
  
  function getMapping(fragetext) { return QUESTIONS.find(function(x) { return fragetext.indexOf(x.text) > -1; }); }

  var kategorienScores = {};

  Object.keys(categoryIssues).forEach(function(cat) {
    var g = categoryIssues[cat].good.length;
    var p = categoryIssues[cat].partial.length;
    var b = categoryIssues[cat].bad.length;
    var total = g + p + b;
    kategorienScores[cat] = total > 0 ? Math.round(((g + p * 0.5) / total) * 100) : 0;

    var sec = document.createElement("div");
    sec.className = "result-section";
    // Nutze den vollen Kategorienamen vom ersten Item für die Überschrift
    var fullCatName = (categoryIssues[cat].good[0] || categoryIssues[cat].partial[0] || categoryIssues[cat].bad[0]).cat;
    sec.innerHTML = "<h3>" + fullCatName + "</h3>";
    var ul = document.createElement("ul");

    categoryIssues[cat].bad.forEach(function(item) {
      var q = getMapping(item.text);
      var mapHtml = q && q.mapping ? (q.infoKey && INFO_TEXTE[q.infoKey] ? "<button type='button' class='detail-mapping clickable' data-info-key='" + q.infoKey + "'>🔖 " + q.mapping + " <span>(Erklärung)</span></button><div class='question-info-panel result-info-panel' data-info-panel='" + q.infoKey + "'></div>" : "<div class='detail-mapping'>🔖 " + q.mapping + "</div>") : "";
      ul.innerHTML += "<li class='detail-item detail-bad'><div class='detail-header'><span class='detail-icon'>❌</span><span class='detail-status bad'>Offen / Kritisch</span><span class='detail-answer'>Deine Antwort: <strong>NEIN</strong></span></div><div class='detail-frage'>" + escapeHtml(item.text) + "</div>" + mapHtml + "</li>";
    });

    categoryIssues[cat].partial.forEach(function(item) {
      var q = getMapping(item.text);
      var antwortText = item.type === "na" ? "NICHT BEANTWORTET / N.A." : "TEILWEISE / IN PLANUNG";
      var mapHtml = q && q.mapping ? (q.infoKey && INFO_TEXTE[q.infoKey] ? "<button type='button' class='detail-mapping clickable' data-info-key='" + q.infoKey + "'>🔖 " + q.mapping + " <span>(Erklärung)</span></button><div class='question-info-panel result-info-panel' data-info-panel='" + q.infoKey + "'></div>" : "<div class='detail-mapping'>🔖 " + q.mapping + "</div>") : "";
      ul.innerHTML += "<li class='detail-item detail-partial'><div class='detail-header'><span class='detail-icon'>⚠️</span><span class='detail-status partial'>" + (item.type === "na" ? "Nicht bewertet" : "Teilweise") + "</span><span class='detail-answer'>Deine Antwort: <strong>" + antwortText + "</strong></span></div><div class='detail-frage'>" + escapeHtml(item.text) + "</div>" + mapHtml + "</li>";
    });

    categoryIssues[cat].good.forEach(function(item) {
      var q = getMapping(item.text);
      var mapHtml = q && q.mapping ? (q.infoKey && INFO_TEXTE[q.infoKey] ? "<button type='button' class='detail-mapping clickable' data-info-key='" + q.infoKey + "'>🔖 " + q.mapping + " <span>(Erklärung)</span></button><div class='question-info-panel result-info-panel' data-info-panel='" + q.infoKey + "'></div>" : "<div class='detail-mapping'>🔖 " + q.mapping + "</div>") : "";
      ul.innerHTML += "<li class='detail-item detail-good'><div class='detail-header'><span class='detail-icon'>✅</span><span class='detail-status good'>Umgesetzt</span><span class='detail-answer'>Deine Antwort: <strong>JA</strong></span></div><div class='detail-frage'>" + escapeHtml(item.text) + "</div>" + mapHtml + "</li>";
    });

    sec.appendChild(ul);
    resultDetails.appendChild(sec);
  });

  // Zeichne BEIDE Charts
  svgDonutChart(kategorienScores);
  svgRadarChart(kategorienScores);
  
  localStorage.removeItem("privacyCheckDraft"); 
  renderActionPlan(categoryIssues);
  attachResultInfoHandlers();
}

// ---- AKTIONSPLAN GENERIEREN ----
function renderActionPlan(categoryIssues) {
  var container = document.getElementById("actionPlanContainer");
  if (!container) return;
  var openTasks = [];
  Object.keys(categoryIssues).forEach(function(cat) {
    categoryIssues[cat].bad.forEach(function(item) { openTasks.push({ text: item.todoText || item.text, cat: item.cat, type: "bad" }); });
    categoryIssues[cat].partial.forEach(function(item) { if(item.type !== "na") openTasks.push({ text: item.todoText || item.text, cat: item.cat, type: "partial" }); });
  });

  if (openTasks.length === 0) {
    container.innerHTML = "<div class='action-plan-empty'>🎉 Keine offenen Maßnahmen! Alle geprüften Anforderungen sind umgesetzt.</div>"; return;
  }

  var html = "<h3>Dein Aktionsplan (" + openTasks.length + " offene Punkte)</h3><div class='progress-bar-container'><div id='actionProgress' class='progress-bar-fill' style='width: 0%'></div></div><p id='actionProgressText' class='progress-text'>0 von " + openTasks.length + " erledigt</p><div class='action-task-list'>";
  openTasks.forEach(function(task, index) {
    var badgeClass = task.type === "bad" ? "critical" : "warning";
    var badgeText = task.type === "bad" ? "Kritisch" : "Wichtig";
    html += "<label class='action-task-item'><input type='checkbox' class='action-checkbox' data-index='" + index + "'><div class='action-task-content'><div class='action-task-header'><span class='tag " + badgeClass + "'>" + badgeText + "</span><span class='action-task-cat'>" + task.cat + "</span></div><p class='action-task-text'>" + escapeHtml(task.text) + "</p></div></label>";
  });
  container.innerHTML = html + "</div>";

  var checkboxes = container.querySelectorAll(".action-checkbox");
  checkboxes.forEach(function(box) {
    box.addEventListener("change", function() {
      var checkedCount = container.querySelectorAll(".action-checkbox:checked").length;
      var percent = Math.round((checkedCount / openTasks.length) * 100);
      document.getElementById("actionProgress").style.width = percent + "%";
      document.getElementById("actionProgressText").innerText = checkedCount + " von " + openTasks.length + " erledigt";
      if(box.checked) box.closest(".action-task-item").classList.add("done"); else box.closest(".action-task-item").classList.remove("done");
    });
  });
}

function attachResultInfoHandlers() {
  document.querySelectorAll(".detail-mapping.clickable").forEach(function(btn) {
    btn.addEventListener("click", function() {
      var key = btn.getAttribute("data-info-key");
      var info = INFO_TEXTE[key];
      var panel = btn.nextElementSibling;
      if (!info || !panel) return;
      if (panel.classList.contains("open")) { panel.classList.remove("open"); panel.innerHTML = ""; } 
      else { panel.classList.add("open"); panel.innerHTML = "<h4>" + info.title + "</h4><p>" + info.body + "</p>"; }
    });
  });
}

// ---- 6. CHARTS GENERIEREN (Donut & Radar) ----
function svgDonutChart(daten) {
  var labels = Object.keys(daten), werte = Object.values(daten);
  var total = werte.reduce(function(a, b) { return a + b; }, 0) || 1;
  var cx = 150, cy = 150, r = 110, innerR = 75, startWinkel = -Math.PI / 2;
  var pfade = "";

  labels.forEach(function(label, i) {
    var anteil = werte[i] / total;
    var endWinkel = startWinkel + anteil * 2 * Math.PI;
    var x1 = cx + r * Math.cos(startWinkel), y1 = cy + r * Math.sin(startWinkel);
    var x2 = cx + r * Math.cos(endWinkel), y2 = cy + r * Math.sin(endWinkel);
    var ix1 = cx + innerR * Math.cos(startWinkel), iy1 = cy + innerR * Math.sin(startWinkel);
    var ix2 = cx + innerR * Math.cos(endWinkel), iy2 = cy + innerR * Math.sin(endWinkel);
    var gb = anteil > 0.5 ? 1 : 0;
    
    // Vermeide Bug bei 100% einer einzigen Kategorie
    if(anteil === 1) {
      pfade += "<circle cx='"+cx+"' cy='"+cy+"' r='"+(r - (r-innerR)/2)+"' fill='none' stroke='" + FARBEN[i % FARBEN.length] + "' stroke-width='"+(r-innerR)+"'/>";
    } else {
      var d = "M " + x1.toFixed(1) + " " + y1.toFixed(1) + " A " + r + " " + r + " 0 " + gb + " 1 " + x2.toFixed(1) + " " + y2.toFixed(1) + " L " + ix2.toFixed(1) + " " + iy2.toFixed(1) + " A " + innerR + " " + innerR + " 0 " + gb + " 0 " + ix1.toFixed(1) + " " + iy1.toFixed(1) + " Z";
      pfade += "<path d='" + d + "' fill='" + FARBEN[i % FARBEN.length] + "' stroke='#0f172a' stroke-width='2'/>";
    }
    startWinkel = endWinkel;
  });

  var durchschnitt = Math.round(werte.reduce(function(a, b) { return a + b; }, 0) / (werte.length || 1));
  var svg = "<svg viewBox='0 0 300 300' width='100%' style='max-width:300px;'>" + pfade +
    "<circle cx='" + cx + "' cy='" + cy + "' r='" + (innerR - 2) + "' fill='#0f172a'/>" +
    "<text x='" + cx + "' y='" + (cy + 5) + "' text-anchor='middle' fill='#e5e7eb' font-size='32' font-weight='bold'>" + durchschnitt + "%</text>" +
    "<text x='" + cx + "' y='" + (cy + 25) + "' text-anchor='middle' fill='#94a3b8' font-size='11'>Konformität</text></svg>";

  var container = document.getElementById("svgChartContainer");
  if(container) container.innerHTML = svg;

  var legende = "";
  labels.forEach(function(label, i) {
    legende += "<div class='legende-item'><span class='legende-farbe' style='background:" + FARBEN[i % FARBEN.length] + "'></span><span>" + label + ": <strong>" + werte[i] + "%</strong></span></div>";
  });
  var legendeContainer = document.getElementById("chartLegende");
  if(legendeContainer) legendeContainer.innerHTML = legende;
}

function svgRadarChart(daten) {
  var labels = Object.keys(daten), werte = Object.values(daten);
  var totalAxes = labels.length;
  if (totalAxes < 3) return; // Ein Polygon braucht mindestens 3 Ecken

  // HIER SIND DIE ANPASSUNGEN:
  // Ich habe die ViewBox von 300 auf 400 verbreitert und cx/cy in die neue Mitte (200, 150) gesetzt.
  // Das gibt links und rechts enorm viel Platz für extrem lange Wörter wie "Risikomanagement".
  var cx = 200, cy = 150, r = 90; 
  var svg = "<svg viewBox='0 0 400 300' width='100%' style='max-width:400px; overflow: visible;'>";

  // Hintergrund-Netz zeichnen (5 Stufen)
// ... der Rest bleibt exakt gleich ...


  // Hintergrund-Netz zeichnen (5 Stufen)
  for (var level = 1; level <= 5; level++) {
    var levelR = r * (level / 5);
    var points = "";
    for (var i = 0; i < totalAxes; i++) {
      var angle = (Math.PI * 2 * i / totalAxes) - Math.PI / 2;
      points += (cx + levelR * Math.cos(angle)).toFixed(1) + "," + (cy + levelR * Math.sin(angle)).toFixed(1) + " ";
    }
    svg += "<polygon points='" + points.trim() + "' fill='none' stroke='#334155' stroke-width='1'/>";
  }

  // Achsen und Labels zeichnen
  var dataPoints = "";
  for (var j = 0; j < totalAxes; j++) {
    var angle = (Math.PI * 2 * j / totalAxes) - Math.PI / 2;
    var ax = cx + r * Math.cos(angle), ay = cy + r * Math.sin(angle);
    svg += "<line x1='" + cx + "' y1='" + cy + "' x2='" + ax + "' y2='" + ay + "' stroke='#334155' stroke-width='1'/>";

    // Polygon-Punkte für die echten Daten berechnen
    var valR = r * (werte[j] / 100);
    dataPoints += (cx + valR * Math.cos(angle)).toFixed(1) + "," + (cy + valR * Math.sin(angle)).toFixed(1) + " ";

    // Labels außen positionieren
    var labelR = r + 20;
    var lx = cx + labelR * Math.cos(angle), ly = cy + labelR * Math.sin(angle);
    var anchor = lx > cx + 10 ? "start" : (lx < cx - 10 ? "end" : "middle");
    
    svg += "<text x='" + lx + "' y='" + ly + "' text-anchor='" + anchor + "' fill='#94a3b8' font-size='10' alignment-baseline='middle' font-weight='500'>" + labels[j] + "</text>";
  }

  // Das eigentliche Werte-Polygon
  svg += "<polygon points='" + dataPoints.trim() + "' fill='rgba(59, 130, 246, 0.3)' stroke='#3b82f6' stroke-width='2'/>";

  // Punkte auf dem Polygon
  for (var k = 0; k < totalAxes; k++) {
     var angleK = (Math.PI * 2 * k / totalAxes) - Math.PI / 2;
     var valRK = r * (werte[k] / 100);
     svg += "<circle cx='" + (cx + valRK * Math.cos(angleK)).toFixed(1) + "' cy='" + (cy + valRK * Math.sin(angleK)).toFixed(1) + "' r='4' fill='#3b82f6'/>";
  }

  svg += "</svg>";
  var container = document.getElementById("svgRadarContainer");
  if(container) container.innerHTML = svg;
}

// ---- 7. AUTO-SAVE & HILFSFUNKTIONEN ----
function saveDraft() {
  var draft = {
    step: currentStep, appName: document.getElementById("appName").value, appType: document.getElementById("appType").value,
    targetAudience: document.getElementById("targetAudience").value, dataCategories: getCheckedValues("#dataCategories"), purposes: getCheckedValues("#processingPurposes"), answers: {}
  };
  QUESTIONS.forEach(function(q) { var answer = getRadioValue("q-" + q.id); if (answer) draft.answers[q.id] = answer; });
  try { localStorage.setItem("privacyCheckDraft", JSON.stringify(draft)); showSaveIndicator(); } catch(e) { console.error(e); }
}

function loadDraft() {
  var draftJson = localStorage.getItem("privacyCheckDraft");
  if (!draftJson) return;
  try {
    var draft = JSON.parse(draftJson);
    if (draft.appName) document.getElementById("appName").value = draft.appName;
    if (draft.appType) document.getElementById("appType").value = draft.appType;
    if (draft.targetAudience) document.getElementById("targetAudience").value = draft.targetAudience;

    if (draft.dataCategories) draft.dataCategories.forEach(function(val) { var cb = document.querySelector("#dataCategories input[value='" + val + "']"); if (cb) cb.checked = true; });
    if (draft.purposes) draft.purposes.forEach(function(val) { var cb = document.querySelector("#processingPurposes input[value='" + val + "']"); if (cb) cb.checked = true; });
    
    // Da sich QUESTIONS dynamisch aufbauen, simulieren wir hier keinen Klick, 
    // wir setzen nur den Step, falls valid.
    if (draft.step && draft.step > 1 && draft.step < 4) currentStep = draft.step;
  } catch (e) { console.error(e); }
}

function showSaveIndicator() {
  var indicator = document.getElementById("saveIndicator");
  if (!indicator) {
    indicator = document.createElement("div"); indicator.id = "saveIndicator"; indicator.className = "save-indicator"; indicator.innerHTML = "💾 Entwurf gespeichert"; document.body.appendChild(indicator);
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
