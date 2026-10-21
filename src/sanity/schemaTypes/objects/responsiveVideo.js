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
 */
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
      options: { accept: "video/mp4,video/webm,video/quicktime" },
      description:
        "MP4 reads everywhere. Keep it under about 15 MB - it is the first thing the page loads.",
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
