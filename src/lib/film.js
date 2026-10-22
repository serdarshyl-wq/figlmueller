/*
 * A film, as the browser is offered it.
 *
 * Two cuts, and up to two files in each: the film itself and the same film as
 * an MP4 behind it. Everything is handed to the `video` element as a list of
 * sources and the browser does the choosing - it takes the first one whose
 * condition matches the screen and whose format it can read, which is the only
 * way to pick that works before any of it has loaded.
 *
 * The order is what makes it work. The tall cut comes first and carries the
 * condition, so only a screen taller than it is wide takes it; the wide cut
 * carries none and is what every other screen - and any browser that ignores
 * the condition - falls to. Within a cut the WebM comes first: it is the
 * smaller file, and the MP4 behind it is there for the iPhones that cannot
 * read WebM.
 */
export const TALL_MEDIA = "(max-aspect-ratio: 1/1)";

const WEBM = "video/webm";

const inCut = (cut, media) => {
  const files = (cut?.files ?? []).filter((file) => file?.url);

  return [
    ...files.filter((file) => file.type === WEBM),
    ...files.filter((file) => file.type !== WEBM),
  ].map((file) => ({ ...file, media }));
};

/* The sources a film is offered as, in the order they are offered. Empty where
   nothing has been uploaded, which is what tells a section to fall back to the
   film - or the run of frames - it ships with. */
export function filmSources(video) {
  const wide = inCut(video?.wide);
  if (!wide.length) return [];

  return [...inCut(video?.tall, TALL_MEDIA), ...wide];
}

/* A file the site ships with, offered the same way. */
export const shippedSource = (url) => [{ url }];
