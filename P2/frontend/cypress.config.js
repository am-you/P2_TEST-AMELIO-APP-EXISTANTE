const { defineConfig } = require('cypress');
const fs = require('fs');
const path = require('path');

// Am.Yo : lance les parcours et écrit le rapport de couverture
module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://127.0.0.1:4200',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: false,
    video: false,
    screenshotOnRunFailure: false,
    setupNodeEvents(on) {
      on('after:run', (results) => {
        const tests = [];
        for (const run of results.runs || []) {
          for (const test of run.tests || []) {
            const title = Array.isArray(test.title) ? test.title.join(' ') : String(test.title);
            tests.push({ title, state: test.state });
          }
        }
        const passed = tests.filter((test) => test.state === 'passed').length;
        const total = tests.length;
        const percent = total === 0 ? 0 : Math.round((100 * passed) / total);
        const rows = tests.map((test) => `<tr><td>${test.title}</td><td>${test.state}</td></tr>`).join('');
        const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><title>Couverture E2E</title></head>
<body>
<h1>Parcours E2E : ${percent} %</h1>
<p>${passed} parcours réussis sur ${total}. Seuil demandé : 80 %.</p>
<table>
<thead><tr><th>Parcours</th><th>Résultat</th></tr></thead>
<tbody>${rows}</tbody>
</table>
</body>
</html>`;
        const directory = path.resolve(__dirname, '../Ex2/couverture-e2e');
        fs.mkdirSync(directory, { recursive: true });
        fs.writeFileSync(path.join(directory, 'index.html'), html);
      });
    },
  },
});
