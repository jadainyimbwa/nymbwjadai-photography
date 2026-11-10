# Photography portfolio

Plain HTML/CSS/JS — no build step. Works as-is on GitHub Pages.

## Add your photos
1. Drop your images into the `images/` folders (or make new ones).
2. Open `js/data.js` and replace the placeholder paths with your files, e.g. `images/portraits/01.jpg`.
3. Change the name, series titles and number of photos there too.
4. Replace `images/portrait.svg` and the email/Instagram links in `about.html`.

To add a 5th series: copy `series-04.html` to `series-05.html`, set `data-series="4"`, update the footer label, and add a matching entry in `js/data.js`.

Tip: resize photos to ~2000px on the long edge (JPG, under 500 KB each) so pages load fast.

## Publish on GitHub Pages
```bash
git init
git add .
git commit -m "Add portfolio site"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```
Then on GitHub: **Settings → Pages → Source: Deploy from a branch → `main` / root → Save.**
The site goes live at `https://<username>.github.io/<repo>/` (name the repo `<username>.github.io` to get the root URL).

Controls: arrow keys / swipe / side arrows to navigate, **Overview** for the thumbnail grid, **Menu** for series.
