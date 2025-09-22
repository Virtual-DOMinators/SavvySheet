# Planering – SavySheet (tog ett namn sålänge)

En modern frontend-app för att ladda upp, visa, redigera och exportera Excel/Google Sheets direkt i webbläsaren.

---

## 🛠 Teknikval

- **React** (Vite eller Create React App)
- **xlsx (SheetJS)** – läsa/skriva Excel-filer
- **react-table** eller **material-react-table** – tabellvisning/redigering
- **jsPDF** + **jspdf-autotable** – export till PDF
- **Google Sheets API** (från frontend, via OAuth2) – export till Google Sheets (extra)
- **Styling:** Material UI eller TailwindCSS

---

## 🗂 Komponenter & Flöde

1. **UploadFile-komponent**
   - Ladda upp `.xlsx` eller ange Google Sheet-länk
2. **Parsing**
   - Läs och tolka Excel-data (SheetJS)
3. **EditableTable-komponent**
   - Visa och redigera datan i tabell
4. **ExportButton-komponent(er)**
   - Export till Excel, PDF och ev. Google Sheets
5. **Styling**
   - Snygg, responsiv design

---

## 🧩 Kanban/Arbetsuppgifter

- [ ] Skapa repo, mappstruktur, README och docs
- [ ] Välj tabell-bibliotek (react-table/material-react-table)
- [ ] Sätt upp filuppladdning och parsing
- [ ] Visa data i redigerbar tabell
- [ ] Implementera cellredigering
- [ ] Exportera till Excel (.xlsx)
- [ ] Exportera till PDF
- [ ] (Extra) Export till Google Sheets (kräver OAuth)
- [ ] Dokumentation och tester

---

## ❓ Frågor att besvara

| Fråga                                                        | Kommentar/Beslut | Ansvarig | Status |
| ------------------------------------------------------------ | ---------------- | -------- | ------ |
| Tabell-bibliotek (react-table/material-react-table/Ag-Grid)? |                  |          |        |
| Hur ska filuppladdning se ut (drag&drop, knapp)?             |                  |          |        |
| Behövs import av Google Sheet, eller bara export?            |                  |          |        |
| Hur ser användarflödet ut? (skiss/mockup)                    |                  |          |        |
| Hur validerar vi fil och data?                               |                  |          |        |
| Hur testar vi parsing/redigering/export?                     |                  |          |        |
| Vilken styling/metod för responsivitet?                      |                  |          |        |
| Hur hanteras export till Google Sheets?                      |                  |          |        |
| Minimikrav för projektet?                                    |                  |          |        |
| Extra/avancerade funktioner?                                 |                  |          |        |

---

## 💡 Idéer & Avancerade funktioner (om tid finns)

- Fler filformat (CSV, TSV)
- Flera sheets i samma fil
- Undo/redo
- Sortering/filter på kolumner
- Dra & släpp-kolumner
- Kolumnvalidering (t.ex. tal/text)
- Snygga teman/dark mode

---

## 📄 Dokumentation

- README.md – projektöversikt, installation, användning
- PLANERING.md – denna fil, planering och frågor
- Evt. docs/ – för wireframes, beslut, changelog m.m.

---

_Senast uppdaterad: 2025-09-22_
