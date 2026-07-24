import EditProductForm from "@/components/EditProductForm";
import { getProductById } from "@/lib/getProducts";


export default async function EditProductPage({ params }) {
    const { id } = await params;

    const product = await getProductById(id);

    return (
        <div className="mt-2 mb-10">
            <h1 className="md:text-3xl sm:ms-2 ms-0 text-1xl font-bold mb-2">
                Edit Product
            </h1>

            <EditProductForm product={product} id={id} />
        </div>
    );
}