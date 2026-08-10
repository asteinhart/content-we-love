# Content We Love

Check out the site [here](https://asteinhart.github.io/content-we-love/).

A static site: `index.html` / `about.html` + vanilla JS/CSS in `static/`.

Content lives in Airtable. `build_data.py` pulls it, joins the scraped metadata
in `clean_meta.json`, and writes `data/records.json`, which the page fetches.

To refresh after adding content in Airtable, run the **Refresh data** workflow
from the Actions tab (it commits the new JSON, and Pages redeploys). Or locally:

```
AIRTABLE_KEY=... python build_data.py
```

To preview locally, serve the folder (needed so the `fetch` works):

```
python -m http.server
```
