/*
 * A service page as the sections take it: what the studio holds, read over the
 * file the page ships with, field by field.
 *
 * Anything left empty in the studio keeps what is in the file, so a half-filled
 * document never leaves a hole in the page - and a picture that has not been
 * uploaded yet is the one the site was built with rather than nothing at all.
 */
export function servicePageContent(shipped, content) {
  const systems = content?.blocks?.length ? content.blocks : shipped.blocks;

  return {
    hero: {
      title: content?.hero?.title || shipped.hero.title,
      image: content?.hero?.image?.url || shipped.hero.image,
      alt: content?.hero?.alt || shipped.hero.alt,
    },
    intro: {
      title: content?.intro?.title?.length
        ? content.intro.title
        : shipped.intro.title,
      body: content?.intro?.body || shipped.intro.body,
    },
    blocks: systems.map((block, index) => {
      const shippedBlock = shipped.blocks[index];

      return {
        id: block.id || shippedBlock?.id || `system-${index + 1}`,
        title: block.title || shippedBlock?.title,
        body: block.body || shippedBlock?.body,
        items: block.items?.length ? block.items : shippedBlock?.items,
        /* A system written in the studio with no picture of its own falls back
           to the one in its place in the file, and to the head of the page
           where there is nothing in that place to fall back to. */
        image:
          block.image?.url ||
          block.image ||
          shippedBlock?.image ||
          shipped.hero.image,
      };
    }),
    closing: shipped.closing
      ? {
        title: content?.closing?.title?.length
          ? content.closing.title
          : shipped.closing.title,
        body: content?.closing?.body || shipped.closing.body,
      }
      : content?.closing,
  };
}
