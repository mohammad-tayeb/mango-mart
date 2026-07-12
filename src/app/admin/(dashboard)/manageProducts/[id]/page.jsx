import EditProductForm from "@/components/EditProductForm";
import { getProductById } from "@/lib/getProducts";


export default async function EditProductPage({ params }) {
    const { id } = await params;

    const product = await getProductById(id);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">
                Edit Product
            </h1>

            <EditProductForm product={product} id={id} />
        </div>
    );
}