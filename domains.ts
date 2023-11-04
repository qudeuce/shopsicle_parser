import { DomainParser } from "./types.ts";
import Parsers from "./parsers/parsers.ts";

const asos: DomainParser = {
  domain: {
    name: "asos",
    url: new URL("https://www.asos.com"),
    logo_url: new URL("https://www.asos.com/favicon.ico"),
  },
  parser: Parsers.asos,
};

// return the domain object for the given domain
export const getDomain = (domainName: string): DomainParser => {
  switch (domainName) {
    case asos.domain.url.hostname:
      return asos;
    default:
      throw new Error("Domain not found");
  }
};
