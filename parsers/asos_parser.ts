import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";
import { Document, DOMParser } from "denodom";
import {
  Brand,
  Currency,
  Description,
  Domain,
  HTML,
  ID,
  Item,
  Price,
  Product,
  ProductVariant,
  Title,
  Variants,
} from "../types.ts";

import { getPrice as formatPrice } from "../util/util.ts";
// import b from "https://esm.sh/v133/xmlchars@2.2.0/denonext/xmlns/1.0/ed3.js";

function getMixAndMatchItems(
  _mixAndMatch: cheerio.Cheerio<cheerio.Element>,
): Item[] {
  return [];
}

const getProductId = (window: Object): ID => {
  return getProductFromWindow(window).productCode;
};

const getProductDescription = (structuredData: Object): Description => {
  return (structuredData as { "@graph": any[] })["@graph"][0]["description"];
};

const getPrice = (
  structuredData: Object,
  _coreProduct: cheerio.Cheerio<cheerio.Element>,
): Price => {
  let price: Price | undefined = undefined;

  try {
    const graph = (structuredData as { "@graph": any[] })["@graph"];
    if (Array.isArray(graph) && graph.length > 0) {
      price = graph[0]["offers"]["lowPrice"];
    }
  } catch {
    // Do nothing if priceCurrency is not found
  }

  if (price === undefined) {
    price = Number(
      formatPrice(_coreProduct.find("[data-testid=current-price]").text()),
    );
  }

  return price ?? 0;
};

const getURL = (structuredData: Object): URL => {
  return new URL((structuredData as { "@graph": any[] })["@graph"][0]["url"]);
};

const getBrand = (window: Object): Brand => {
  return {
    name: getProductFromWindow(window).brandName,
    logo_url: new URL("https://www.asos.com/favicon.ico"),
  };
};

const getCurrency = (structuredData: Object): Currency => {
  try {
    const graph = (structuredData as { "@graph": any[] })["@graph"];
    if (Array.isArray(graph) && graph.length > 0) {
      return graph[0]["offers"]["priceCurrency"];
    }
  } catch {
    // Do nothing if priceCurrency is not found
  }
  return undefined;
};

const getDomain = (window: Object): Domain => {
  return {
    name: "ASOS",
    url: new URL("https://www.asos.com"),
    logo_url: new URL("https://www.asos.com/favicon.ico"),
  };
};

const getPictureURL = (window: Object): URL | undefined => {
  return getProductFromWindow(window).images[0].url;
};

const getVariants = (window: Object): Variants => {
  const variants: Variants = [];
  getProductFromWindow(window).variants.forEach((variant: ProductVariant) => {
    variants.push(variant.size);
    variants.push(variant.colour);
  });
  return [...new Set(variants)];
};

const getTitle = (window: Object): Title => {
  return getProductFromWindow(window).name;
};

const getProductFromWindow = (window: Object): Product => {
  return (window as { asos: { pdp: { config: { product: Product } } } }).asos
    .pdp.config.product;
};

export default function parse(html: HTML): Item[] {
  const $ = cheerio.load(html);
  const items: Item[] = [];

  // get element with id mix-and-match
  const mixAndMatch = $("#mix-and-match");
  const ismixAndMatch = mixAndMatch.length > 0;

  // get all script tags from html
  const scripts = $("script");

  // iterate through all script tags and get the one that contains the string "window.asos"
  let asosScript = "";
  scripts.each((_: number, script: cheerio.Element) => {
    if ($(script).html()?.includes("window.asos.pdp.config")) {
      asosScript = $(script).html()!;
      // stop iterating through scripts
      return false;
    }
  });

  const window: Object = {};
  const document: Document = new DOMParser().parseFromString(
    html,
    "text/html",
  )!;

  // get the text from the script tag and wrap in JSDOM
  eval(asosScript);

  // extract the value of window.asos.pdp.config
  // const asosConfig = window.asos.pdp.config;

  //

  // console.log(asosScript)
  console.log(JSON.stringify(window, null, 2));

  // if mixAndMatch is not empty then get items from mixAndMatch
  if (ismixAndMatch) {
    const mixAndMatchItems = getMixAndMatchItems(mixAndMatch);
    items.push(...mixAndMatchItems);
    return items;
  }

  // get element with id core-product
  const coreProduct = $("#core-product");

  // get text for h1 element inside core-product
  const title: Title = getTitle(window);

  const price: Price = getPrice(window, coreProduct);

  const picture_url: URL | undefined = getPictureURL(window);

  const variants: Variants = getVariants(window);

  const structuredData = JSON.parse($("#split-structured-data").text());
  const productId: ID = getProductId(window);
  const description: Description = getProductDescription(structuredData);

  const currency: Currency = getCurrency(structuredData);

  const brand: Brand = getBrand(window);

  const url: URL = getURL(structuredData);

  const domain: Domain = getDomain(window);

  const item: Item = {
    productId,
    title,
    price,
    description,
    currency,
    variants,
    url,
    picture_url,
    domain,
    brand,
  };
  items.push(item);

  return items;
}
