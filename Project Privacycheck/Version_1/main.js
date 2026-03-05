// Oben einfügen (persönlicher Kommentar):
/*
PrivacyCheck von Elias Bach - für Cybersecurity Portfolio
Erstellt Feb 2026 während Masterschool-Kurs
Version 1.0 - MVP fertig
*/

// Zeile 10: const QUESTIONS → meineFragen
// Zeile 150: renderQuestions → meineFragenAnzeigen

// ---- Fachliche Fragen/Checks ----
// Jede Frage hat: id, text, category, weight, goodAnswer
const QUESTIONS = [
  {
    id: "https",
    text: "Wird die gesamte Kommunikation deiner Web-App ausschließlich über HTTPS abgewickelt?",
    category: "Sicherheit",
    weight: 3,
    goodAnswer: "yes",
  },
  {
    id: "pwdHash",
    text: "Werden Passwörter ausschließlich gehasht (z.B. mit bcrypt/argon2) und niemals im Klartext gespeichert?",
    category: "Sicherheit",
    weight: 3,
    goodAnswer: "yes",
  },
  {
    id: "dpNotice",
    text: "Gibt es eine leicht auffindbare Datenschutzerklärung mit Informationen nach Art. 13 DSGVO (Verantwortlicher, Zwecke, Rechtsgrundlagen usw.)?",
    category: "Transparenz",
    weight: 3,
    goodAnswer: "yes",
  },
  {
    id: "impressum",
    text: "Ist ein vollständiges Impressum leicht erreichbar?",
    category: "Transparenz",
    weight: 1,
    goodAnswer: "yes",
  },
  {
    id: "minimization",
    text: "Erhebst du nur die für den jeweiligen Zweck unbedingt notwendigen Pflichtfelder (Datenminimierung)?",
    category: "Datenminimierung",
    weight: 2,
    goodAnswer: "yes",
  },
  {
    id: "consentCookies",
    text: "Verwendest du Tracking- oder Marketing-Cookies nur nach expliziter Einwilligung (z.B. Cookie-Banner)?",
    category: "Einwilligung / Cookies",
    weight: 3,
    goodAnswer: "yes",
  },
  {
    id: "legalBasis",
    text: "Sind für alle Verarbeitungszwecke klare Rechtsgrundlagen definiert (Art. 6 DSGVO)?",
    category: "Rechtsgrundlagen",
    weight: 2,
    goodAnswer: "yes",
  },
  {
    id: "processors",
    text: "Hast du mit allen eingesetzten Auftragsverarbeitern (z.B. Hosting, SaaS-Tools) DSGVO-konforme Verträge geschlossen?",
    category: "Auftragsverarbeitung",
    weight: 2,
    goodAnswer: "yes",
  },
  {
    id: "accessControl",
    text: "Gibt es ein Rollen- und Berechtigungskonzept für Zugriffe auf personenbezogene Daten (Least Privilege)?",
    category: "Sicherheit / Governance",
    weight: 2,
    goodAnswer: "yes",
  },
  {
    id: "logging",
    text: "Werden sicherheitsrelevante Zugriffe und Ereignisse protokolliert (Logging) und regelmäßig ausgewertet?",
    category: "Sicherheit / Monitoring",
    weight: 1,
    goodAnswer: "yes",
  },
];

let currentStep = 1;
const maxStep = 4;

// Elemente
const steps = document.querySelectorAll(".step");
const stepIndicators = document.querySelectorAll(".step-indicator");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const questionsContainer = document.getElementById("questionsContainer");
const resultSummary = document.getElementById("resultSummary");
const resultDetails = document.getElementById("resultDetails");
const printReportBtn = document.getElementById("printReportBtn");

// ---- Initialisierung ----
renderQuestions();
updateStepView();

// ---- Navigation ----
prevBtn.addEventListener("click", () => {
  if (currentStep > 1) {
    currentStep--;
    updateStepView();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentStep < maxStep) {
    // Optional: einfache Validierungen
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;

    currentStep++;
    if (currentStep === maxStep) {
      // Ergebnis berechnen
      computeAndRenderResult();
      nextBtn.disabled = true;
    }
    updateStepView();
  }
});

printReportBtn.addEventListener("click", () => {
  window.print();
});

// ---- Funktionen ----
function updateStepView() {
  steps.forEach((step, index) => {
    step.classList.toggle("active", index + 1 === currentStep);
  });

  stepIndicators.forEach((ind) => {
    const stepNum = parseInt(ind.dataset.step, 10);
    ind.classList.toggle("active", stepNum === currentStep);
  });

  prevBtn.disabled = currentStep === 1;
  nextBtn.disabled = currentStep === maxStep;
  nextBtn.textContent = currentStep === maxStep - 1 ? "Auswertung" : "Weiter";
}

function renderQuestions() {
  questionsContainer.innerHTML = "";
  QUESTIONS.forEach((q) => {
    const card = document.createElement("div");
    card.className = "question-card";

    const title = document.createElement("p");
    title.className = "question-title";
    title.textContent = q.text;

    const meta = document.createElement("p");
    meta.className = "question-meta";
    meta.textContent = `${q.category} • Gewichtung: ${q.weight}`;

    const options = document.createElement("div");
    options.className = "question-options";
    options.innerHTML = `
      <label><input type="radio" name="q-${q.id}" value="yes" /> Ja</label>
      <label><input type="radio" name="q-${q.id}" value="partial" /> Teilweise / In Planung</label>
      <label><input type="radio" name="q-${q.id}" value="no" /> Nein</label>
      <label><input type="radio" name="q-${q.id}" value="na" /> Nicht anwendbar</label>
    `;

    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(options);
    questionsContainer.appendChild(card);
  });
}

function validateStep1() {
  const appName = document.getElementById("appName").value.trim();
  const appType = document.getElementById("appType").value;
  if (!appName || !appType) {
    alert("Bitte gib mindestens einen App-Namen und eine Art der Anwendung an.");
    return false;
  }
  return true;
}

function validateStep2() {
  const dataChecked = document.querySelectorAll(
    "#dataCategories input[type='checkbox']:checked"
  ).length;
  const purposeChecked = document.querySelectorAll(
    "#processingPurposes input[type='checkbox']:checked"
  ).length;

  if (dataChecked === 0 && purposeChecked === 0) {
    if (
      !confirm(
        "Du hast weder Datenkategorien noch Zwecke ausgewählt. Bist du sicher, dass deine App keine personenbezogenen Daten verarbeitet?"
      )
    ) {
      return false;
    }
  }
  return true;
}

function computeAndRenderResult() {
  const appName = document.getElementById("appName").value.trim();
  const appType = document.getElementById("appType").value;
  const targetAudience = document.getElementById("targetAudience").value.trim();

  const dataCategories = getCheckedValues("#dataCategories");
  const purposes = getCheckedValues("#processingPurposes");

  let totalWeight = 0;
  let achievedScore = 0;

  const categoryIssues = {}; // {category: {good:[],partial:[],bad:[]}}

  QUESTIONS.forEach((q) => {
    const answer = getRadioValue(`q-${q.id}`);
    const cat = q.category;
    if (!categoryIssues[cat]) {
      categoryIssues[cat] = { good: [], partial: [], bad: [] };
    }

    totalWeight += q.weight;

    if (!answer || answer === "na") {
      // nicht anwendbar -> neutral, aber Hinweis
      categoryIssues[cat].partial.push(q.text + " (nicht beantwortet / N.A.)");
      return;
    }

    if (answer === q.goodAnswer) {
      achievedScore += q.weight;
      categoryIssues[cat].good.push(q.text);
    } else if (answer === "partial") {
      achievedScore += q.weight * 0.5;
      categoryIssues[cat].partial.push(q.text);
    } else {
      // bewusst anders (z.B. nein)
      categoryIssues[cat].bad.push(q.text);
    }
  });

  const percentage =
    totalWeight > 0 ? Math.round((achievedScore / totalWeight) * 100) : 0;

  const scoreClass =
    percentage >= 80 ? "good" : percentage >= 50 ? "medium" : "bad";

  // Zusammenfassung
  resultSummary.innerHTML = `
    <p><strong>App:</strong> ${appName || "Unbenannte Anwendung"} ${
    appType ? "• Typ: " + appTypeLabel(appType) : ""
  } ${
    targetAudience ? "• Zielgruppe: " + escapeHtml(targetAudience) : ""
  }</p>
    <p class="score-badge ${scoreClass}">
      <span>${percentage}</span><span class="unit">/ 100 Punkte</span>
    </p>
    <div class="tag-row">
      ${renderScoreTags(percentage, dataCategories, purposes)}
    </div>
  `;

  // Detailbereiche
  resultDetails.innerHTML = "";
  Object.keys(categoryIssues).forEach((cat) => {
    const sec = document.createElement("div");
    sec.className = "result-section";

    const h3 = document.createElement("h3");
    h3.textContent = cat;
    sec.appendChild(h3);

    const { good, partial, bad } = categoryIssues[cat];

    const ul = document.createElement("ul");

    if (bad.length) {
      bad.forEach((t) => {
        const li = document.createElement("li");
        li.innerHTML =
          `<strong style="color:#fecaca;">Offen/Kritisch:</strong> ` +
          escapeHtml(t);
        ul.appendChild(li);
      });
    }
    if (partial.length) {
      partial.forEach((t) => {
        const li = document.createElement("li");
        li.innerHTML =
          `<strong style="color:#fef9c3;">Teilweise / Planen:</strong> ` +
          escapeHtml(t);
        ul.appendChild(li);
      });
    }
    if (good.length) {
      good.forEach((t) => {
        const li = document.createElement("li");
        li.innerHTML =
          `<strong style="color:#bbf7d0;">Umgesetzt:</strong> ` +
          escapeHtml(t);
        ul.appendChild(li);
      });
    }

    if (!bad.length && !partial.length && !good.length) {
      const li = document.createElement("li");
      li.textContent = "Keine Bewertung (keine Antwort / nicht anwendbar).";
      ul.appendChild(li);
    }

    sec.appendChild(ul);
    resultDetails.appendChild(sec);
  });

  // Empfehlungstext ergänzen
  const advice = document.createElement("div");
  advice.className = "result-section";
  advice.innerHTML =
    "<h3>Nächste Schritte</h3>" +
    renderAdviceText(percentage, dataCategories, purposes);
  resultDetails.appendChild(advice);
}

function getCheckedValues(selector) {
  return Array.from(
    document.querySelectorAll(`${selector} input[type='checkbox']:checked`)
  ).map((el) => el.value);
}

function getRadioValue(name) {
  const checked = document.querySelector(
    `input[name='${name}']:checked`
  );
  return checked ? checked.value : null;
}

function appTypeLabel(value) {
  switch (value) {
    case "saas":
      return "SaaS / Online-Service";
    case "shop":
      return "Online-Shop";
    case "content":
      return "Content-Website / Blog";
    case "internal":
      return "Interne Unternehmensanwendung";
    case "other":
      return "Sonstiges";
    default:
      return value;
  }
}

function renderScoreTags(percentage, dataCategories, purposes) {
  const tags = [];

  if (percentage >= 80) {
    tags.push(
      `<span class="tag">Gute Datenschutz-Basis, einzelne Punkte prüfen</span>`
    );
  } else if (percentage >= 50) {
    tags.push(
      `<span class="tag warning">Solide Basis, mehrere Verbesserungsmöglichkeiten</span>`
    );
  } else {
    tags.push(
      `<span class="tag critical">Hoher Verbesserungsbedarf bei Datenschutz &amp; Sicherheit</span>`
    );
  }

  if (dataCategories.includes("special")) {
    tags.push(
      `<span class="tag critical">Besondere Kategorien: strenge Anforderungen</span>`
    );
  }

  if (purposes.includes("analytics") || dataCategories.includes("tracking")) {
    tags.push(`<span class="tag warning">Tracking/Analytics im Einsatz</span>`);
  }

  if (purposes.includes("newsletter")) {
    tags.push(`<span class="tag warning">Newsletter/Marketing: Einwilligungen sauber dokumentieren</span>`);
  }

  return tags.join("");
}

function renderAdviceText(percentage, dataCategories, purposes) {
  let text = "";

  if (percentage >= 80) {
    text +=
      "<p>Deine Web-App hat bereits eine gute Basis in Bezug auf Datenschutz &amp; Sicherheit. Prüfe dennoch kritisch, ob alle Dokumentationspflichten erfüllt sind (z.B. Datenschutzhinweise, Verträge mit Auftragsverarbeitern).</p>";
  } else if (percentage >= 50) {
    text +=
      "<p>Die Grundlagen sind angelegt, aber es bestehen mehrere Bereiche mit Optimierungspotenzial. Priorisiere zuerst Sicherheitsmaßnahmen (HTTPS, Passwortschutz) und Transparenz (Datenschutzerklärung, Rechtsgrundlagen).</p>";
  } else {
    text +=
      "<p>Aktuell besteht erheblicher Handlungsbedarf. Konzentriere dich zunächst auf technische Basismaßnahmen (Transportverschlüsselung, Passwort-Sicherheit) und formelle Anforderungen wie Datenschutzhinweise und Rechtsgrundlagen.</p>";
  }

  if (dataCategories.includes("special")) {
    text +=
      "<p>Da du besondere Kategorien personenbezogener Daten verarbeitest (z.B. Gesundheitsdaten), gelten erhöhte Anforderungen. Prüfe insbesondere die Rechtsgrundlagen, zusätzliche Schutzmaßnahmen und ob eine Datenschutz-Folgenabschätzung erforderlich sein kann.</p>";
  }

  if (purposes.includes("analytics") || dataCategories.includes("tracking")) {
    text +=
      "<p>Für Tracking- und Marketing-Technologien solltest du saubere Einwilligungs- und Opt-out-Mechanismen implementieren (z.B. zustimmungsbasierter Cookie-Banner) und die eingesetzten Tools in deiner Datenschutzerklärung transparent machen.</p>";
  }

  if (!dataCategories.length && !purposes.length) {
    text +=
      "<p>Du hast aktuell keine Datenkategorien/Zwecke angegeben. Falls deine Anwendung in Zukunft personenbezogene Daten verarbeitet, solltest du diesen Check erneut durchführen.</p>";
  }

  return text;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
