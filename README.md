# PrivacyCheck

Ein Tool, das ich entwickelt habe, um Entwicklern schnell zu zeigen, 
wo ihre Web-App in Sachen Sicherheit und Datenschutz steht.

**Live:** https://eb-sec.github.io/PrivacyCheck/

---

## Was macht es?

Du gibst an, welche Technologien du nutzt (z.B. SQL-Datenbank, AWS, 
Docker) und welche Daten deine App verarbeitet. Basierend darauf 
bekommt du einen maßgeschneiderten Fragenkatalog – keine generischen 
Checklisten, sondern Fragen die wirklich zu deinem Stack passen.

Am Ende siehst du konkret, was fehlt, warum es ein Problem ist und 
wie du es behebst – inklusive Code-Beispielen.

---

## Was steckt drin?

- Dynamische Fragen je nach Tech-Stack (Cloud, SQL, Docker, Payment)
- Bewertung nach OWASP Top 10 & ISO 27001
- Dashboard mit Verlauf deiner bisherigen Audits (LocalStorage)
- Aktionsplan mit Code-Snippets direkt im Browser
- Kein Backend, keine Abhängigkeiten – läuft komplett im Browser

---

## Gebaut mit

Vanilla JavaScript, HTML, CSS – bewusst ohne Frameworks,
um zu zeigen was ohne React & Co. möglich ist.

---

## Hintergrund

Entstanden während meines Cybersecurity-Studiums bei Masterschool (2026).
Ich wollte ein Tool bauen, das ich selbst bei eigenen Projekten 
tatsächlich nutzen würde.
