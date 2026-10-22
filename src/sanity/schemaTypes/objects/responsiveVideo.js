/*
 * A film in both shapes a phone and a desk want.
 *
 * One file cannot serve both. A 16:9 film on a portrait screen is either
 * letterboxed into a strip or cropped so hard that what it was shot for is off
 * the sides - which is what the site does today, and what the client sees when
 * they open it on a phone. So the film is uploaded twice, cut for each shape,
 * and the screen picks: the wide one for a desk, the tall one for a phone.
 *
 * A cut is the film and nothing else. When the intro hands the page over, and
 * how much of the film a returning reader is given, are read off the file's own
 * length - so a new upload of any length works without anyone setting a number.
 *
 * WHAT TO UPLOAD, AND WHY IT IS ASKED FOR
 * The film is the first thing on the screen and the reader is looking at a
 * blank page until it arrives, so its weight is the page's speed. WebM carries
 * the same picture in the smallest file a browser reads, and a film with no
 * sound track is smaller again - these films are played muted, so a sound
 * track is weight nobody will ever hear.
 *
 * WebM, though, is only read on an iPhone from iOS 17.4 - March 2024 - and an
 * iPhone X or 8 can never be given it at all. So a cut takes two files: the
 * film, and the same film as an MP4 behind it. Both are offered to the browser
 * and the WebM is offered first, so a modern screen is given the small file
 * and an older iPhone is given the one it can read. Where only one file is
 * uploaded, that is the one everybody gets.
 */
const ADVICE = [
  "WebM is the one to upload here: the same picture in the smallest file.",
  "Under 5 MB is where it performs best - this cut on its own, since a screen loads only the cut it needs.",
  "Silent: these films are played muted, so a sound track is weight nobody hears. Export without audio.",
].join(" ");

const BACKUP_ADVICE = [
  "The same film again as an MP4, for an iPhone that has not been updated since March 2024 - those cannot read WebM, and would be shown nothing at all.",
  "Not needed where the file above is already an MP4.",
].join(" ");

const cut = (name, title, ratio, description) => ({
  name,
  title,
  type: "object",
  description,
  options: { collapsible: true, collapsed: false },
  fields: [
    {
      name: "file",
      title: `Film (${ratio})`,
      type: "file",
      options: { accept: "video/webm,video/mp4,video/quicktime" },
      description: ADVICE,
    },
    {
      name: "backup",
      title: `The same film as MP4 (${ratio})`,
      type: "file",
      options: { accept: "video/mp4,video/quicktime" },
      description: BACKUP_ADVICE,
    },
  ],
});

export const responsiveVideo = {
  name: "responsiveVideo",
  title: "Film",
  type: "object",
  fields: [
    cut(
      "wide",
      "Wide cut",
      "16:9",
      "Played on anything from a tablet held on its side upwards."
    ),
    cut(
      "tall",
      "Tall cut",
      "9:16",
      "Played on a phone and on a tablet held upright. Left empty, the wide cut is used everywhere - cropped, the way it is today."
    ),
  ],
};
