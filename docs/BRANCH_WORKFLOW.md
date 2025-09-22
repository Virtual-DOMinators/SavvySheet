# Branch-workflow – Steg för steg

Den här guiden beskriver hur du skapar, arbetar med och slår ihop branches på ett tydligt och säkert sätt i detta repository.

---

## Innehåll

1. [Översikt branch-struktur](#översikt-branch-struktur)
2. [Skapa branch – steg för steg](#skapa-branch--steg-för-steg)
3. [Arbeta i din branch](#arbeta-i-din-branch)
4. [Hålla din branch uppdaterad](#hålla-din-branch-uppdaterad)
5. [Skapa Pull Request (PR)](#skapa-pull-request-pr)
6. [Merge-processen](#merge-processen)
7. [Branch-namnstandard](#branch-namnstandard)
8. [Felsökning och vanliga problem](#felsökning-och-vanliga-problem)

---

## Översikt branch-struktur

- **main**: Produktionsklar/stabil kod. Här deployas till produktion.
- **dev**: Samlar all utveckling innan det slås ihop till main.
- **feature/namn**: Nya funktioner (utgår från dev).
- **bugfix/namn**: Buggfixar (utgår från dev).
- **docs/namn**: Dokumentationsändringar.
- **hotfix/namn**: Akuta buggfixar (utgår direkt från main).

---

## Skapa branch – steg för steg

1. **Uppdatera din lokala dev:**
   ```bash
   git checkout dev
   git pull origin dev
   ```
2. **Skapa ny branch utifrån dev:**
   ```bash
   git checkout -b feature/ny-funktion
   # eller
   git checkout -b bugfix/namn-på-bugg
   # eller
   git checkout -b docs/namn
   ```
3. **Push din nya branch till GitHub:**
   ```bash
   git push -u origin feature/ny-funktion
   ```

---

## Arbeta i din branch

- Gör dina commits, t.ex.
  ```bash
  git add .
  git commit -m "Beskrivande commit-meddelande"
  ```
- Se till att committa ofta och beskriv tydligt vad du gjort.

---

## Hålla din branch uppdaterad

Om andra gör ändringar på `dev` kan du behöva hämta dessa till din branch för att undvika konflikter:

```bash
git checkout dev
git pull origin dev
git checkout feature/ny-funktion
git merge dev
# Eller, om du föredrar rebase:
git rebase dev
```

Lös eventuella konflikter, commit:a och fortsätt.

---

## Skapa Pull Request (PR)

1. När du är klar, pusha alla ändringar:
   ```bash
   git push
   ```
2. Gå till GitHub och skapa en PR från din branch till `dev`.
3. Skriv en tydlig PR-beskrivning:
   - Vad har ändrats?
   - Varför?
   - Något att tänka på vid granskning/test?
4. Be minst en kollega granska PR:en.

---

## Merge-processen

1. Få godkännande på din PR.
2. Merg:a din branch till `dev` via GitHub (eller med knappen "Merge pull request").
3. Om du använt squash/rebase, ta bort din feature/bugfix-branch efter merge (GitHub frågar om du vill ta bort den).
4. När `dev` är stabil och testad, gör PR från `dev` till `main` för release.

---

## Branch-namnstandard

- `feature/ny-funktion`
- `bugfix/fixa-fel`
- `docs/uppdatera-readme`
- `hotfix/akut-bugg`

Håll namnen korta, beskrivande och använd bindestreck.

---

## Felsökning och vanliga problem

**Merge-konflikter:**
Lös dessa i din editor eller terminal, se till att testa och committa igen.

**Glömt att skapa branch?**
Stash:a dina ändringar, byt branch, och applicera stashen:

```bash
git stash
git checkout feature/korrekt-branch
git stash pop
```

**Behöver ta bort en branch?**

```bash
git branch -d feature/du-inte-behöver
git push origin --delete feature/du-inte-behöver
```

---

## Kort workflow för olika scenarier

**Ny funktion:**
dev → feature/namn → PR till dev → merge till dev → ev. merge till main

**Buggfix:**
dev → bugfix/namn → PR till dev → merge till dev

**Akut buggfix i produktion:**
main → hotfix/namn → PR till main → merge till main → merge main → dev

---

**Tips!**

- Arbeta aldrig direkt på main eller dev.
- Håll dina branches uppdaterade.
- Skriv tydliga commit- och PR-meddelanden.
- Fråga kollegor om du är osäker!

---
