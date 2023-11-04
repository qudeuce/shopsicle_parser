type HTML = string;

type Variants = string[]; //TODO: Update to enum

type Size = string; //TODO: Update to enum

type Description = string;

type Price = number;

type ID = number;

type Title = string;

type Currency = string | undefined;

type Domain = {
  name: Title;
  url: URL;
  logo_url: URL;
};

type DomainParser = {
  domain: Domain;
  parser: (html: HTML) => Item[];
};

type Brand = {
  name: Title;
  logo_url: URL;
};

type Gender = "Womens" | "Mens" | "Unisex";

type Image = {
  isPrimary: boolean;
  colour: string;
  colourWayId: number;
  imageType: string;
  url: URL;
  productId: ID;
  alternateText: string;
  isVisible: boolean;
};

type ProductVariant = {
  variantId: ID;
  size: Size;
  hasIngredients: boolean;
  sizeId: ID;
  colour: string;
  colourWayId: ID;
  isPrimary: boolean;
  sizeOrder: number;
  sku: string;
};

interface Product {
  name: string;
  brandName: string;
  isOneSize: boolean;
  productCode: ID;
  gender: string;
  images: Image[];
  variants: ProductVariant[];
}

interface Item {
  productId: ID;
  title: Title;
  price: Price;
  currency: Currency;
  description: Description | undefined;
  variants: Variants | undefined;
  url: URL | undefined;
  picture_url: URL | undefined;
  domain: Domain | undefined;
  brand: Brand | undefined;
}

export type {
  Brand,
  Currency,
  Description,
  Domain,
  DomainParser,
  HTML,
  ID,
  Image,
  Item,
  Price,
  Product,
  ProductVariant,
  Size,
  Title,
  Variants,
};
