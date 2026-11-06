# Shimla Cypher

Single-page music label website based on the supplied Shimla Cypher design preview.

## Files

- `dist/index.html` — page content and original illustrative artwork.
- `dist/styles.css` — supplied responsive design.
- `dist/contact.css` — contact form styles.
- `dist/app.js` — slideshow, mobile navigation, dialogs and contact interaction.
- `dist/config.js` — official contact email and future platform destinations.
- `dist/assets/` — original logo and display font extracted from the supplied file.

## Contact

The form opens a draft in the visitor's email application addressed to `shimlacxpher@gmail.com`. The visitor sends it there; the website does not store enquiries or claim delivery.

## Future content

Artist names, photographs, management details and platform links remain placeholders from the supplied design. Replace them with confirmed information as it becomes available. There are no third-party scripts or build dependencies.

## GitHub Pages hosting

The deployment workflow in `.github/workflows/pages.yml` publishes only `dist/` to GitHub Pages. The site uses relative asset paths and has no dependency on ChatGPT sign-in.

In the repository's **Settings → Pages**, set **Source** to **GitHub Actions**. GitHub Free requires a public repository for Pages; GitHub Pro also supports publishing from private repositories.

After enabling Pages, open **Actions → Deploy Shimla Cypher to GitHub Pages → Run workflow** for the first deployment. Later changes to `dist/` on `main` deploy automatically. The expected address is `https://lawmeskiviahs.github.io/shimla-cypher/`; the workflow's deployment result confirms when it is live.

The earlier Sites hosting configuration is retained in `.openai/hosting.json` for reference. It is not included in the GitHub Pages deployment.
