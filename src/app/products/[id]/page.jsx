export const revalidate = 60;
import ProductDetails from "@/components/ProductDetails";
import { getProductById } from "@/lib/getProducts";
import { getRelatedProducts } from "@/lib/getRelatedProducts";

export async function generateMetadata({ params }) {
  const { id } = await params;

  const product = await getProductById(id);
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",

    name: product.name,
    description: product.description,
    image: product.images,
    sku: product._id.toString(),
    category: product.category,

    brand: {
      "@type": "Brand",
      name: "Mango Mart BD",
    },

    offers: product.variants.map((variant) => ({
      "@type": "Offer",
      url: `https://mangomartbd.shop/products/${id}`,

      priceCurrency: "BDT",
      price: variant.offerPrice ?? variant.price,

      availability:
        product.stock.status === "out_of_stock"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",

      itemCondition: "https://schema.org/NewCondition",

      seller: {
        "@type": "Organization",
        name: "Mango Mart BD",
      },
    })),
  };

  if (!product) {
    return {
      title: "Product Not Found | Mango Mart BD",
    };
  }

  return {
    title: `${product.name} | Mango Mart BD`,
    description: product.description,

    keywords: [
      product.name,
      product.category,
      "Buy Mango Online Bangladesh",
      "Fresh Mango",
      "Chemical Free Mango",
    ],

    alternates: {
      canonical: `https://mangomartbd.shop/products/${id}`,
    },

    openGraph: {
      title: product.name,
      description: product.description,
      url: `https://mangomartbd.shop/products/${id}`,
      siteName: "Mango Mart BD",
      images: [
        {
          url: product.images[0],
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      locale: "en_US",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [product.images[0]],
    },
  };
}

export default async function Page({ params }) {
  const { id } = await params;

  const product = await getProductById(id)
  const relatedProducts = await getRelatedProducts(id)


  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />

      <ProductDetails
        product={product}
        relatedProducts={relatedProducts}
      />
    </>
  );
}