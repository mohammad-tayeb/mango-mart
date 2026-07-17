import CopyButton from "@/components/CopyButton";
import Image from "next/image";

export default async function OrderSuccess({ params }) {
    const { trackingId } = await params;

    return (
        <div className="max-w-2xl mx-auto py-20 px-6">
            <div className="rounded-2xl border bg-white shadow-lg p-8 text-center">

                <div className="flex items-center justify-center">
                    <Image
                        src="/icon.gif"
                        alt="Order Success"
                        width={96}
                        height={96}
                        className="object-contain select-none"
                    />
                </div>

                <h1 className="text-3xl font-bold">
                    Order Placed Successfully
                </h1>

                <p className="mt-3 text-gray-600">
                    Thank you for your order.
                </p>

                <div className="mt-8 rounded-lg bg-gray-50 p-4 max-w-sm mx-auto">
                    <p className="text-sm text-gray-500">
                        Tracking ID
                    </p>

                    {/* ফ্লেক্স বক্সের ভেতর আইডি এবং আমাদের ক্লায়েন্ট কপি বাটন */}
                    <div className="mt-2 flex items-center justify-between bg-white border rounded-lg p-2.5 shadow-sm gap-2">
                        <p className="text-xl font-bold text-orange-500 font-mono select-all">
                            {trackingId}
                        </p>

                        {/* শুধু এই অংশটুকু ক্লায়েন্ট সাইডে রিঅ্যাক্ট করবে */}
                        <CopyButton text={trackingId} />
                    </div>
                </div>

            </div>
        </div>
    );
}