/*
 * The studio's root, and deliberately bare.
 *
 * Sanity's studio brings its own typography, its own colours and its own
 * scrolling. The site's root brings a smooth-scroll wrapper that would take the
 * wheel out of its hands, a fixed bar that would stand over its menus, and a
 * sheet of global CSS written for the site - so the studio is given a root of
 * its own with none of that in it. Nothing is imported here on purpose.
 */
/* Kept out of search results by the studio's own metadata, which the page
   re-exports; all this adds is the name on the tab. */
export const metadata = {
  title: "Figlmueller — admin",
};

export default function StudioRootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
