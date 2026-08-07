function page() {
    return (
        <div className="bg-slate-50 py-4 px-4 sm:px-6 lg:px-8 flex justify-center">
            <div className="max-w-2xl w-full bg-white rounded-2xl border border-slate-100 shadow-sm p-8 sm:p-12 text-slate-800">

                {/* Main Heading */}
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-6">
                    Refund & Return Policy
                </h1>

                <p className="text-sm text-slate-600 leading-relaxed mb-8">
                    We strive to deliver every order in excellent condition. If you receive an incorrect, damaged, or defective item, we&apos;re here to help with a replacement or refund where applicable.
                </p>

                {/* Section 1 */}
                <section className="mb-8">
                    <h2 className="text-lg font-bold text-slate-900 mb-3">
                        Please Check Your Order Upon Delivery
                    </h2>

                    <p className="text-sm text-slate-600 leading-relaxed">
                        We recommend inspecting your package as soon as it arrives. If you notice any visible damage, missing items, or receive the wrong product, inform the delivery personnel immediately and contact our support team as soon as possible.
                    </p>
                </section>

                {/* Section 2 */}
                <section className="mb-8">
                    <h2 className="text-lg font-bold text-slate-900 mb-3">
                        Return & Replacement Eligibility
                    </h2>

                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 leading-relaxed">
                        <li>The item was received in a damaged or defective condition.</li>
                        <li>You received a different product, size, or variant than the one you ordered.</li>
                        <li>The issue is reported within <strong className="text-slate-900">3 days</strong> of delivery.</li>
                        <li>The product is returned with its original packaging, accessories, and purchase invoice.</li>
                    </ul>
                </section>

                {/* Section 3 */}
                <section className="mb-8">
                    <h2 className="text-lg font-bold text-slate-900 mb-3">
                        Items That Cannot Be Returned
                    </h2>

                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 leading-relaxed">
                        <li>Fresh or perishable products that were accepted in satisfactory condition.</li>
                        <li>Products that have been used, altered, or damaged after delivery.</li>
                        <li>Requests based solely on personal preference or change of mind after acceptance.</li>
                    </ul>
                </section>

                {/* Section 4 */}
                <section className="mb-8">
                    <h2 className="text-lg font-bold text-slate-900 mb-3">
                        Refund Process
                    </h2>

                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 leading-relaxed">
                        <li>Refunds are initiated after the returned product has been inspected and approved.</li>
                        <li>Processing usually takes up to <strong className="text-slate-900">7 business days</strong>.</li>
                        <li>Online payments are refunded to the original payment method whenever possible.</li>
                        <li>Cash on Delivery (COD) refunds are sent via bKash, Nagad, or bank transfer.</li>
                        <li>Shipping fees are refundable only when the return is the result of our mistake.</li>
                    </ul>
                </section>

                {/* Section 5 */}
                <section className="mb-8">
                    <h2 className="text-lg font-bold text-slate-900 mb-3">
                        How to Request a Return
                    </h2>

                    <p className="text-sm text-slate-600 leading-relaxed">
                        To start a return or replacement request, please contact us through our{" "}
                        <a
                            href="/contact"
                            className="text-red-500 hover:underline font-medium"
                        >
                            Contact page
                        </a>{" "}
                        and provide your order or invoice number along with clear photos of the product and the issue. Our support team will review your request and guide you through the next steps.
                    </p>
                </section>

                {/* Section 6 */}
                <section className="mb-8">
                    <h2 className="text-lg font-bold text-slate-900 mb-3">
                        Additional Information
                    </h2>

                    <p className="text-sm text-slate-600 leading-relaxed">
                        We reserve the right to decline refund or replacement requests that do not meet the conditions outlined in this policy. Each request is reviewed individually to ensure a fair resolution for both our customers and our business.
                    </p>
                </section>

                {/* Footer Note */}
                <p className="text-xs italic text-slate-500 mb-8">
                    Edit this template from Admin → Pages to reflect your business policies.
                </p>

                {/* Divider and Timestamp */}
                <hr className="border-slate-100 mb-4" />

                <p className="text-xs text-slate-400">
                    Last updated: 05/08/2026
                </p>

            </div>
        </div>
    );
}

export default page;