import { servicePage } from "./servicePage";

/*
 * Everything the studio knows how to edit. One type to begin with - the four
 * service pages the site already reads out of `src/data` - and the rest of the
 * site's content follows as it is moved across.
 */
export const schema = {
  types: [servicePage],
};
