import ProductDetails from "@/components/ProductDetails";
import { getProductById } from "@/lib/getProducts";
import { getRelatedProducts } from "@/lib/getRelatedProducts";

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