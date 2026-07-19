export const revalidate = 60;
import ProductDetails from "@/components/ProductDetails";
import { getProductById } from "@/lib/getProducts";
import { getRelatedProducts } from "@/lib/getRelatedProducts";

export async function generateMetadata({ params }) {
  const { id } = await params;

  const product = await getProductById(id);

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
    <ProductDetails
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}