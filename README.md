# PrivacyCheck

A tool I built to give developers a quick, clear picture of where their web app stands on security and privacy.

**Live:** https://eb-sec.github.io/PrivacyCheck/

---

## What does it do?

You specify which technologies you use (e.g. SQL database, AWS, Docker) and what kind of data your app processes. Based on that, you get a tailored set of questions — not generic checklists, but questions that actually match your stack.

At the end you see exactly what is missing, why it is a problem, and how to fix it — including code examples.

---

## Features

- Dynamic questions based on your tech stack (Cloud, SQL, Docker, Payment)
- Assessment mapped to OWASP Top 10 & ISO 27001
- Dashboard with audit history (LocalStorage)
- Action plan with code snippets — directly in the browser
- No backend, no dependencies — runs entirely client-side

---

## Built with

Vanilla JavaScript, HTML, CSS — deliberately framework-free to show what is possible without React and similar tools.

---

## Background

Built during my Cybersecurity training at Masterschool (2026).
I wanted to create a tool I would actually use on my own projects.
