# Will — personal portfolio

A lightweight, responsive portfolio built for GitHub Pages. There is no build step or framework.

## Personalize the content

Edit `content.js` to update the public name, email, positioning, biography, and project cards. The starting copy intentionally avoids unsupported claims about experience or achievements.

For deeper edits:

- `index.html` controls the page structure and static copy.
- `styles.css` contains the visual system and responsive layout.
- `script.js` renders the editable content and subtle reveal motion.
- `assets/favicon.svg` is the browser icon.

## Preview locally

Run a basic local server from this directory:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Publish with GitHub Pages

Push this folder to a GitHub repository, then open **Settings → Pages**. Under **Build and deployment**, select **Deploy from a branch**, choose your default branch and the `/ (root)` folder, then save.

If the repository is named `<username>.github.io`, the site will be available at `https://<username>.github.io/`. Otherwise it will usually be at `https://<username>.github.io/<repository>/`.
