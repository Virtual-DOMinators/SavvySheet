# Branch-workflow i detta repo

## Branch-struktur

- **main** – Alltid stabil/produktion. Endast testad och godkänd kod ska hit.
- **dev** – Här samlas all utveckling innan det slås ihop till main.
- **feature/xxx** – Skapa en ny branch utifrån dev för varje ny funktion.
- **bugfix/xxx** – Skapa en ny branch utifrån dev för varje buggfix.

---

## Så här jobbar du med branches

### 1. Skapa utvecklingsbranchen `dev` (om den inte finns)

```bash
git checkout main
git pull
git checkout -b dev
git push -u origin dev
```

### 2. Skapa en feature-branch (exempel: upload)

```bash
git checkout dev
git pull
git checkout -b feature/upload
git push -u origin feature/upload
```

### 3. Skapa en bugfix-branch (exempel: file-upload)

```bash
git checkout dev
git pull
git checkout -b bugfix/file-upload
git push -u origin bugfix/file-upload
```

---

## Workflow för pull requests

1. Gör klart ditt arbete i din feature/bugfix-branch.
2. Skapa en pull request **mot dev** och be om granskning.
3. När allt är godkänt, merge:a till **dev**.
4. När dev är tillräckligt stabil och testad, gör en pull request från **dev till main** för produktionssättning.

---

## Tips

- Arbeta aldrig direkt på `main` eller `dev`!
- Döp dina branches tydligt, t.ex. `feature/login-form` eller `bugfix/typo-footer`.
- Håll dina branches uppdaterade med `dev` för att undvika merge-konflikter.

---
