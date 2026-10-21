/*
 * The studio's own left-hand list.
 *
 * Written out rather than left to the default, so what an editor opens is the
 * site's own shape - pages, in the order the site reads them - rather than an
 * alphabetical list of document types.
 */
export const structure = (S) =>
  S.list()
    .title("Figlmueller")
    .items([
      S.documentTypeListItem("servicePage").title("Service pages"),
    ]);
