import { aboutSections } from "@/sanity/schemaTypes/about";
import { homeSections } from "@/sanity/schemaTypes/home";

/*
 * The studio's own left-hand list.
 *
 * Written out rather than left to the default, so what an editor opens is the
 * site's own shape - the pages in the order they are linked, each a folder of
 * its sections - rather than an alphabetical list of document types.
 *
 * Every section is a document of its own and always the same one: opened by
 * name rather than through a list with a single entry and a new button that
 * would make a second one.
 */
const sectionItem = (S, { name, title }) =>
  S.listItem()
    .title(title)
    .id(name)
    .child(S.document().schemaType(name).documentId(name).title(title));

const pageFolder = (S, id, title, sections) =>
  S.listItem()
    .title(title)
    .id(id)
    .child(
      S.list()
        .title(title)
        .items(sections.map((section) => sectionItem(S, section)))
    );

export const structure = (S) =>
  S.list()
    .title("Figlmueller")
    .items([
      pageFolder(S, "homepage", "Homepage", homeSections),
      pageFolder(S, "aboutpage", "About", aboutSections),
      S.divider(),
      S.documentTypeListItem("servicePage").title("Service pages"),
    ]);
