# Our Story

An elegant, mobile-friendly wedding story website built as plain HTML, CSS and
JavaScript. It is designed to be published free of charge on GitHub Pages.

**Live address once published:**

```text
https://manvendrasc.github.io/our-story/
```

Anyone with that link can open it. No GitHub account is needed to view it.

---

## 1. Publish it (about 5 minutes)

1. Go to <https://github.com/new>.
2. **Repository name:** `our-story`
3. Choose **Public**, then click **Create repository**.
4. On the new repository page, click **uploading an existing file**.
5. Drag in everything from this folder:
   `index.html`, `404.html`, `favicon.svg`, `.nojekyll`,
   and the `css`, `js`, `content` and `photos` folders.
6. Click **Commit changes**.
7. Go to **Settings > Pages**.
8. Under *Build and deployment* choose **Deploy from a branch**,
   select branch **main** and folder **/ (root)**, then click **Save**.
9. Wait a few minutes, then open the link above.

> Changes can take up to 10 minutes to appear. If you do not see an update,
> refresh with `Ctrl` + `F5`.

### If the `.nojekyll` file will not upload

Browsers sometimes hide files starting with a dot. If that happens, create it
on GitHub instead: **Add file > Create new file**, name it `.nojekyll`,
leave it empty, and commit.

---

## 2. Make it yours

### Your words

Open `index.html` on GitHub and click the pencil icon to edit.
Every place you need to change is marked with:

```html
<!-- EDIT ME -->
```

That covers your names, initials, the date, the city, all five chapters,
the film-strip captions and the footer.

### Your photos

Everything lives in the `photos` folder.

- **To swap a photo:** upload a new image using the same file name.
- **To add or remove album photos:** upload the file, then edit the list in
  `content/site-content.js`.

See `photos/README.md` for the full list of file names and recommended sizes.

### Your proposal and meeting dates

The chapter dates (`October 2021`, `December 2025`) are also marked with
`<!-- EDIT ME -->`. Change them to your own.

### Your countdown

In `index.html`, find:

```html
<p class="countdown" id="countdown" data-date="2027-03-13" hidden></p>
```

Change `data-date` to your wedding date. Delete the whole line to hide it.
The countdown appears only while the date is still in the future.

---

## 3. What is on the page

| Section        | What it does                                                        |
| -------------- | ------------------------------------------------------------------- |
| **Home**       | Full-screen cover with your names, date and a slow cinematic zoom    |
| **Our Story**  | Five chapters, including a scrapbook film strip and a quote chapter  |
| **Our Photos** | Magazine-style album with a full-screen viewer                       |

The `Home`, `Our Story` and `Our Photos` links behave like tabs, and the
active one is highlighted as you scroll.

**The album viewer supports:** click or tap to open, arrow keys, swiping on a
phone, `Esc` to close, and full keyboard navigation.

---

## 4. Preview it on your computer first

```powershell
cd our-story
python -m http.server 8000
```

Then open <http://localhost:8000>. Press `Ctrl` + `C` to stop.

Opening `index.html` by double-clicking also works, but a local server is
closer to how GitHub Pages will behave.

---

## 5. Folder structure

```text
our-story/
├─ index.html              your words and page structure
├─ 404.html                shown if someone mistypes the address
├─ favicon.svg             the little browser icon
├─ .nojekyll               tells GitHub to publish the files as they are
├─ css/styles.css          colours, fonts and layout
├─ js/site.js              menu, scroll effects and photo viewer
├─ content/site-content.js your album photo list
├─ photos/                 every image on the site
└─ tools/                  script that made the placeholder images
```

The `tools` folder is optional. Delete it once you have added real photos.

---

## 6. Design notes

- **Colours:** ivory `#FAF6EF`, wine `#6F2335`, antique gold `#B9924A`,
  dusty rose `#C98F91`
- **Fonts:** Cormorant Garamond, Inter and Great Vibes, loaded from Google Fonts
- **Accessibility:** keyboard friendly, visible focus rings, alt text on every
  image, and animations switch off automatically for anyone who has reduced
  motion enabled on their device
- **Performance:** no frameworks, lazy-loaded images, roughly 2 MB total

---

## 7. Before you share the link

This website is public and can be found by search engines.

- Do not publish your home address, phone numbers or booking references.
- The city and the date are usually enough.
- Send private details, venue directions and schedules through your invitation
  instead.

---

## 8. Optional extras

- **Custom domain** such as `aaravandisha.com`: buy a domain, then follow
  <https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site>.
  The GitHub address stays free; only the domain costs money.
- **RSVP:** link a free Google Form from the final chapter.

---

Built as an original design. It is not affiliated with The Knot or any
wedding website provider.
