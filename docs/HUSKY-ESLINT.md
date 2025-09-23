## Husky & Pre-commit hooks

Vi använder [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/okonet/lint-staged) för att säkerställa kodkvalitet automatiskt innan kod committas till repot.

### Hur funkar det?

- **Husky** kör en pre-commit hook varje gång du försöker göra en git commit.
- **lint-staged** ser till att endast staged filer (de du håller på att committa) lintas och formatteras automatiskt innan committen går igenom.
- Om du har kodfel (t ex ESLint errors) som inte kan fixas automatiskt så blockeras committen tills du åtgärdat felet.

### Hur körs det?

1. När du kör `git commit` körs kommandon från `.husky/pre-commit`.
2. Dessa kommandon (via lint-staged) formaterar/lintar dina staged filer.
3. Om allt är ok → committen går igenom.
4. Om det finns fel → du får ett felmeddelande, committen blockeras och du får fixa felen.

### Exempel på `.husky/pre-commit`

```sh
#!/bin/sh
npx lint-staged
```

### Exempel på `lint-staged` i `package.json`

```json
"lint-staged": {
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ]
}
```

### Viktigt

- **Ingen deprecated-varning** – vi använder senaste Husky (v10+).
- Endast staged filer påverkas.
- Du måste ha dependencies installerade:
  ```sh
  npm install
  ```

### Vill du stänga av hooks tillfälligt?

Kör:

```sh
HUSKY=0 git commit
```

---

**Fråga gärna om du undrar över Husky eller lint-staged!**
