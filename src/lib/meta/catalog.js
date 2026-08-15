const META_API_VERSION = process.env.META_API_VERSION || "v26.0";

const META_CATALOG_ID = process.env.META_CATALOG_ID;

const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

if (!META_CATALOG_ID) {
  throw new Error("META_CATALOG_ID is missing");
}

if (!META_ACCESS_TOKEN) {
  throw new Error("META_ACCESS_TOKEN is missing");
}

const META_URL = `https://graph.facebook.com/${META_API_VERSION}/${META_CATALOG_ID}/items_batch`;

function stripHtml(html = "") {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function getMetaPrice(product) {
  const variants = Array.isArray(product.variants) ? product.variants : [];

  const prices = variants
    .map((variant) => {
      const price = Number(variant.price);
      const offerPrice = Number(variant.offerPrice);

      if (price > 0) {
        return {
          price,
          offerPrice: offerPrice > 0 && offerPrice < price ? offerPrice : null,
        };
      }

      return null;
    })
    .filter(Boolean);

  if (prices.length > 0) {
    return prices.reduce((lowest, current) => {
      const lowestEffective = lowest.offerPrice ?? lowest.price;

      const currentEffective = current.offerPrice ?? current.price;

      return currentEffective < lowestEffective ? current : lowest;
    });
  }

  const unitPrice = Number(product.unitPricePerKg || 0);

  return {
    price: unitPrice,
    offerPrice: null,
  };
}
export function mapProductToMeta(product) {
  const productId = product._id.toString();

  const images = Array.isArray(product.images)
    ? product.images.filter(Boolean)
    : [];

  const pricing = getMetaPrice(product);

  const availability =
    product.stock?.status === "in_stock" ? "in stock" : "out of stock";

  return {
    id: productId,

    title: product.name,

    description: stripHtml(product.description || ""),

    link: `https://mangomartbd.shop/products/${productId}`,

    image_link: images[0] || undefined,

    additional_image_link: images.length > 1 ? images.slice(1) : undefined,

    price: `${pricing.price} BDT`,

    sale_price: pricing.offerPrice ? `${pricing.offerPrice} BDT` : undefined,

    availability,

    condition: "new",

    visibility: "published",

    brand: "Mango Mart BD",

    product_type: product.category,
  };
}

export async function syncProductsToMeta(products) {
  if (!Array.isArray(products) || products.length === 0) {
    throw new Error("No products supplied for Meta sync");
  }

  const requests = products.map((product) => ({
    method: "UPDATE",

    data: mapProductToMeta(product),
  }));

  const response = await fetch(META_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      access_token: META_ACCESS_TOKEN,

      item_type: "PRODUCT_ITEM",

      allow_upsert: true,

      requests,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("Meta Catalog API error:", result);

    throw new Error(
      result?.error?.message || "Meta Catalog API request failed",
    );
  }

  return result;
}
