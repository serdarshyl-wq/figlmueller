/*
 * The three things that say which content store this site is talking to, read
 * from the environment rather than written here: the same code runs against the
 * live dataset and against whatever a developer is working in.
 *
 * They are `NEXT_PUBLIC_` because the studio at /admin runs in the browser and
 * needs them there. None of them is a secret - a project id and a dataset name
 * are public facts about a Sanity project, and what may be read from it is
 * decided by the dataset's own permissions, not by hiding these.
 */
export const projectId = required(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "NEXT_PUBLIC_SANITY_PROJECT_ID"
);

export const dataset = required(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "NEXT_PUBLIC_SANITY_DATASET"
);

/*
 * Pinned, not current. Sanity dates its API, and a query made against a date is
 * answered the way that date answered it - so the site cannot be changed under
 * us by a release upstream. Moved forward on purpose, never by accident.
 */
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-10-21";

function required(value, name) {
  if (value) return value;

  throw new Error(
    `Missing ${name}. Copy .env.example to .env.local and fill it in.`
  );
}
