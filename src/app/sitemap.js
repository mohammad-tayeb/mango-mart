import dbConnect, { collectionNameObj } from "@/lib/dbConnect";

export default async function sitemap() {
  const baseUrl = "https://mangomartbd.shop";

  const productCollection = await dbConnect(
    collectionNameObj.productCollection
  );

  // Only include products that are in stock
  const products = await productCollection
    .find({
      "stock.status": "in_stock",
    })
    .project({
      _id: 1,
      updatedAt: 1,
    })
    .toArray();

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/products/${product._id}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/trackParcel`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacyPolicy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/termsConditions`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...productUrls,
  ];
}