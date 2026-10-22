# Figlmueller Ind | L.L.C — handover

A Next.js 16 site (App Router, JavaScript) with a Sanity Studio embedded at
`/admin`. Every page of text, every picture and every film on the public site is
read from Sanity at build time and re-read at most once a minute, so the client
edits the site themselves and nothing here has to be rebuilt by hand.

This file is what you need to get it running and deployed. It is not a tour of
the code; the code carries its own comments.

---

## 1. Running it

- **Node 20.9 or newer** (built and tested on 24).
- `npm ci` — the lockfile is committed and in sync. Do not `npm install` on a
  fresh clone; `npm ci` is what the host runs.
- `npm run dev` — <http://localhost:3000>, studio at <http://localhost:3000/admin>.
- `npm run build` / `npm start` — production build and server.
- `npx eslint src` — lint. Worth running before you commit.

It will not start without the environment variables below: the Sanity client
throws at import if the project id is missing, by design.

> When verifying CMS changes in a production build, delete the whole `.next`
> directory first. Next reuses route output it believes is unchanged, and
> `.next/cache` alone is not enough.

---

## 2. Environment variables

`.env*` is gitignored, so **nothing here reaches you in the repository**. Copy
`.env.example` to `.env.local` for development, and set the same keys in the
host. On Vercel: *Project → Settings → Environment Variables*, for Production,
Preview **and** Development, then redeploy — adding a variable does not trigger
a build on its own, and a deploy without them fails at "Collecting page data".

### Public — the content store (not secrets; the studio runs in the browser)

| Key | Value |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `z9xgg97x` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2026-10-21` |

The API version is pinned on purpose: a query made against a date is answered
the way that date answered it. Move it forward deliberately, never by accident.

### Secret — the mailbox the enquiry form sends through

| Key | What it is |
| --- | --- |
| `SMTP_HOST` | the mailbox's SMTP host |
| `SMTP_PORT` | `465` is treated as the encrypted one, anything else as STARTTLS |
| `SMTP_USER` / `SMTP_PASS` | the account that sends |
| `MAIL_FROM` | what the mail is sent as, e.g. `FIGLMUELLER <no-reply@figlmueller.ae>`. Must be an address that account is allowed to send from. |
| `ENQUIRY_INBOX` | optional fallback only — where enquiries land is written in the studio |

Any provider works; nothing in the code is tied to one. For deliverability use
a mailbox on the client's own domain and publish SPF and DKIM for it, otherwise
the mail will be filed as spam.

---

## 3. Sanity

Project `z9xgg97x`, dataset `production`, managed at <https://sanity.io/manage>.
You are being added as an **administrator**; nothing in the repository grants
access to the content, so everything below is done in that console.

### Before it goes live

1. **Accept the invitation** and check you can open `/admin` locally.
2. **Add every deployed domain to CORS origins, with credentials.** Only
   `http://localhost:3000` and `http://localhost:3333` are allowed today, so
   production, staging and preview domains each have to be added by hand.
   Without it `/admin` loads and then fails to read anything, and nothing says
   why.
3. **Leave the dataset public.** It is `public` today, which is what lets the
   site read it with no token — the way a brochure site should. If you make it
   private, every read needs a server-side token and
   `src/sanity/lib/client.js` has to be changed for it; the studio would keep
   working while the public site quietly fell back to its built-in text.
4. **There is no studio to deploy.** It is served by this app at `/admin`, so
   `sanity deploy` is not part of the process. `sanity.cli.js` is there for
   dataset work from the command line, nothing else.
5. **No API tokens exist, and none are needed.** If you create one for a
   migration, scope it and delete it afterwards.

### Day to day

- The client edits at `/admin`. A publish is live within a minute
  (`revalidate: 60`), not at the next build.
- Invite the client's own people as **editors**, not administrators.
- **Back up before anything large**: `npx sanity login`, then
  `npx sanity dataset export production backup.tar.gz`. Restoring is
  `sanity dataset import`.
- **Do not rename the dataset, and do not change document ids.** The studio
  opens each section by a fixed id and each page by its route; renaming either
  takes the content off the page it belongs to.
- **The schema is code.** Adding, removing or renaming a field happens in
  `src/sanity/schemaTypes` and needs a deploy — it cannot be done from the
  studio. Field descriptions there are written for the client to read, so keep
  that voice if you add to them.
- Assets live in the project's own store. Deleting a document does not delete
  the pictures and films it used; clear those from the media library.

### How it is laid out

The studio's left-hand list is written out in `src/sanity/structure.js` and
mirrors the site: Homepage, About, Services, Contact, Citrine® Machine,
Resources, Let's talk, Legal. Section documents are opened by name and cannot be
created twice; pages that have a route — the service pages, Citrine, the three
legal pages — are opened by that route. Every field carries a description
explaining what it does on the page and what it should be given.

---

## 4. The enquiry form

`/connect-us` posts to `POST /api/enquiry` (`src/app/api/enquiry/route.js`,
Node runtime, never edge).

- The address it is sent **to** is read from Sanity on every request — studio →
  *Let's talk* → *Where enquiries are sent*. Changing it needs no deploy.
- The mail is sent **from** `MAIL_FROM` with the sender's own address as
  `Reply-To`, so answering the mail answers them.
- Attachments are carried through, up to 4 MB in total. A serverless function is
  handed the whole request in memory and most hosts refuse much more; raise the
  constant in the route only if the host allows it.
- A hidden field traps bots: a filled one is answered as a success and no mail
  is sent. Nothing is stored anywhere — the enquiry is a mail and nothing else.
- Without the SMTP variables the route answers 500 and the form shows its
  "could not be sent" line. The rest of the site is unaffected.

---

## 5. What is still placeholder

**Every picture and every film currently in the CMS is a placeholder.** None of
it is licensed for the live site. The client replaces them in the studio; no
code change is needed.

- **Films** are uploaded in two cuts, 16:9 and 9:16, and each cut takes a WebM
  plus the same film as an MP4 behind it (WebM is not read by an iPhone that has
  not been updated since March 2024). The 9:16 slots are **empty** everywhere —
  until they are filled, a phone gets the wide cut cropped to the middle.
- Guidance for the client is written into the upload fields: WebM, under 5 MB
  per cut, silent, and 5–10 seconds for the opening film.
- `public/ctrine-dummy/` holds 160 JPEG frames (36 MB). They are the fallback
  for the Citrine section on the home page, used only when no film is written in
  the studio. Once the client's own film is in place they can be deleted.
- **The three legal pages are drafts.** They were written to match what the site
  actually does (no analytics, no advertising cookies, one local-storage entry),
  but they have not been through a lawyer. They must be reviewed before launch.

---

## 6. Shape of the thing

- `src/app/(site)` — the public pages. `src/app/(studio)` — the studio. They are
  separate route groups with separate root layouts.
- `src/app/api/enquiry` — the only API route.
- `src/components/sections/<page>` — one component per section of a page. Most
  are client components driving GSAP timelines from the scroll.
- `src/sanity/schemaTypes` — the schema, one folder per page.
  `src/sanity/lib` — one reader per page; a page is read in a single request.
- `src/app/css/*.css` — Tailwind v4. Desktop classes live in the components;
  these files hold the overrides below 1280px, written with `@apply`.
- Animation is GSAP with a house scroll driver (`src/lib/scrub.js`) and Lenis
  for smooth scrolling. `prefers-reduced-motion` is respected everywhere: the
  same pages, set still.

If a section looks like it ignores the CMS, it does not — every one of them
falls back to what it ships with when its fields are empty, so a half-filled
store never leaves a hole in the page.
