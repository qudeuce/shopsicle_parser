import { HTML, Item } from "./types.ts";
import { getDomain } from "./domains.ts";

export const parseHTML = (html: HTML, url: URL): Item[] => {
  const domain = getDomain(url.hostname);
  try {
    const items = domain.parser(html);
    return items;
  } catch (error) {
    console.log(error);
    return [];
  }
};
