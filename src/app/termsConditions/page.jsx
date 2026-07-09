function page() {
    return (
        <div className="min-h-screen bg-slate-50 py-4 px-4 sm:px-6 lg:px-8 flex justify-center">
            <div className="max-w-2xl w-full bg-white rounded-2xl border border-slate-100 shadow-sm p-8 sm:p-12 text-slate-800">

                {/* Main Heading */}
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-6">
                    Terms & Conditions
                </h1>

                <p className="text-sm text-slate-600 leading-relaxed mb-8">
                    By using this website and placing an order, you agree to the following terms.
                </p>

                {/* Section 1 */}
                <section className="mb-8">
                    <h2 className="text-lg font-bold text-slate-900 mb-3">
                        Orders & Acceptance
                    </h2>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 leading-relaxed">
                        <li>All orders are subject to availability and acceptance by us.</li>
                        <li>We reserve the right to cancel any order, including for pricing errors, suspected fraud, or stock issues. If cancelled, any amount paid will be refunded.</li>
                        <li>Prices and offers may change without notice.</li>
                    </ul>
                </section>

                {/* Section 2 */}
                <section className="mb-8">
                    <h2 className="text-lg font-bold text-slate-900 mb-3">
                        Payment
                    </h2>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 leading-relaxed">
                        <li>We accept Cash on Delivery (COD), bKash, Nagad, and bank transfer.</li>
                        <li>Some orders may require an advance payment to confirm (especially for free-delivery or high-value orders).</li>
                        <li>For online payments, you must provide a valid Transaction ID. Orders with invalid TrxIDs will be held until verified.</li>
                    </ul>
                </section>

                {/* Section 3 */}
                <section className="mb-8">
                    <h2 className="text-lg font-bold text-slate-900 mb-3">
                        Shipping & Delivery
                    </h2>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 leading-relaxed">
                        <li>Delivery within Dhaka: typically 1–2 working days.</li>
                        <li>Outside Dhaka: typically 2–4 working days.</li>
                        <li>Courier fees are shown at checkout and may vary by district.</li>
                        <li>We are not liable for delays caused by the courier, weather, or public holidays.</li>
                    </ul>
                </section>

                {/* Section 4 */}
                <section className="mb-8">
                    <h2 className="text-lg font-bold text-slate-900 mb-3">
                        Returns & Refunds
                    </h2>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 leading-relaxed">
                        <li>Check your parcel in front of the delivery person. Report damage or wrong item immediately.</li>
                        <li>Returns are accepted within 3 days for damaged/defective items or wrong products.</li>
                        <li>Products must be unused, in original packaging, with invoice.</li>
                        <li>Refunds are processed within 7 business days after we receive the returned item.</li>
                    </ul>
                </section>

                {/* Section 5 */}
                <section className="mb-8">
                    <h2 className="text-lg font-bold text-slate-900 mb-3">
                        Customer Responsibilities
                    </h2>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 leading-relaxed">
                        <li>Provide an accurate delivery address and reachable phone number.</li>
                        <li>Be available to receive the parcel, or designate someone who can.</li>
                        <li>Repeated order cancellations or refusal at delivery may result in future orders being held for advance payment.</li>
                    </ul>
                </section>

                {/* Section 6 */}
                <section className="mb-8">
                    <h2 className="text-lg font-bold text-slate-900 mb-3">
                        Liability
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        Our liability is limited to the value of the product purchased. We are not liable for indirect or consequential losses.
                    </p>
                </section>

                {/* Section 7 */}
                <section className="mb-8">
                    <h2 className="text-lg font-bold text-slate-900 mb-3">
                        Changes
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        We may update these terms from time to time. The date at the bottom of this page shows when it was last updated.
                    </p>
                </section>

                {/* Footer Admin Note */}
                <p className="text-xs italic text-slate-500 mb-8">
                    Edit this template from Admin → Pages to match your business practices.
                </p>

                {/* Divider and Timestamp */}
                <hr className="border-slate-100 mb-4" />
                <p className="text-xs text-slate-400">
                    Last updated: 28/04/2026
                </p>

            </div>
        </div>
    )
}
export default page