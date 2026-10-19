# Will — personal portfolio

A lightweight, responsive editorial portfolio built for GitHub Pages. There is no build step or framework.

## Personalize the content

Edit `content.js` to update the public name, contact link, positioning, background, experience, projects, and notes. Placeholder entries are explicitly marked so they can be replaced without hunting through the page markup.

For deeper edits:

- `index.html` controls the page structure and static copy.
- `styles.css` contains the visual system and responsive layout.
- `script.js` renders the editable content and subtle reveal motion.
- `assets/will-avatar.png` is the privacy-preserving illustrated portrait.
- `assets/favicon.svg` is the browser icon.
- `projects/cre-underwriting/` contains the interactive CRE Underwriting Workbench.
- `projects/model-qa/` contains the browser-local Financial Model QA Agent prototype.
- `projects/shared/project.css` provides the shared visual system for both prototypes.

## Analyst Workflow Lab

The first two portfolio projects form a small **Build → Review** workflow:

1. **CRE Underwriting Workbench** builds an auditable five-year acquisition case from synthetic assumptions, including debt metrics, returns, and sensitivity analysis.
2. **Financial Model QA Agent** reviews spreadsheet structure for formula errors, gaps, pattern breaks, hard-coded assumptions, and percentage anomalies.

Both are educational prototypes. The underwriting model uses synthetic inputs and the QA tool produces review signals rather than financial, investment, or model-certification advice. Uploaded workbooks are processed in the browser and are not sent to a server by this project.

## Preview locally

Run a basic local server from this directory:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Publish with GitHub Pages

Push this folder to a GitHub repository, then open **Settings → Pages**. Under **Build and deployment**, select **Deploy from a branch**, choose your default branch and the `/ (root)` folder, then save.

If the repository is named `<username>.github.io`, the site will be available at `https://<username>.github.io/`. Otherwise it will usually be at `https://<username>.github.io/<repository>/`.
